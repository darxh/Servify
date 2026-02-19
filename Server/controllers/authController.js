const crypto = require("crypto")
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { verifyEmailTemplate } = require("../utils/emailTemplates");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register new user & Send Verification Email
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await User.create({
      name,
      email,
      password,
      role: role === "provider" ? "provider" : "user",
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (user) {
      const verifyUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/verify/${verificationToken}`;

      const message = verifyEmailTemplate(verifyUrl, user.name);

      try {
        await sendEmail({
          email: user.email,
          subject: "Servify Email Verification",
          message,
        });

        res.status(201).json({
          message: "Registration successful! Please check your email.",
        });
      } catch (error) {
        await user.deleteOne();
        res.status(500).json({ message: "Email could not be sent" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify User Email
// @route   GET /api/v1/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/auth/login?error=invalid_token`);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/auth/login?verified=true`);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with Google
// @route   POST /api/v1/auth/google
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, email_verified } = ticket.getPayload();

    if (!email_verified) {
      return res.status(400).json({ message: "Google email is not verified." });
    }

    let user = await User.findOne({ email });

    if (user) {
      const accessToken = generateToken(res, user._id);
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
        accessToken,
      });
    } else {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      user = await User.create({
        name: name,
        email: email,
        password: randomPassword,
        profileImage: picture,
        isVerified: true,
        role: "user",
      });
      const accessToken = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phoneNumber: user.phoneNumber,
        accessToken,
      });
    }

  } catch (error) {
    res.status(400).json({ message: "Backend Error: " + error.message });
  }
};


// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {

      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first." });
      }

      const accessToken = generateToken(res, user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      
      if (req.body.phoneNumber !== undefined) {
        user.phoneNumber = req.body.phoneNumber;
      }

      if (req.body.password) {
        if (!req.body.currentPassword) {
          return res.status(400).json({ 
            message: "You must provide your current password to set a new one." 
          });
        }

        const isMatch = await user.comparePassword(req.body.currentPassword);
        if (!isMatch) {
          return res.status(400).json({ 
            message: "The current password you entered is incorrect." 
          });
        }

        user.password = req.body.password;
      }

      if (req.file) {
        user.profileImage = req.file.path;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        phoneNumber: updatedUser.phoneNumber,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, googleLogin, getMe, updateUserProfile };