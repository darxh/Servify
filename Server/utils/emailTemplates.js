const verifyEmailTemplate = (url, name) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background-color: #2563EB; padding: 30px 0; text-align: center; } /* Servify Blue */
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; }
          .content { padding: 40px; color: #333333; line-height: 1.6; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { background-color: #2563EB; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button:hover { background-color: #1d4ed8; }
          .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
          .link-text { color: #2563EB; word-break: break-all; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Servify</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #111827; margin-top: 0;">Hello ${name},</h2>
            <p>Welcome to Servify! We are excited to have you on board.</p>
            <p>To ensure the security of your account, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
              <a href="${url}" class="button">Verify My Account</a>
            </div>
  
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${url}" class="link-text">${url}</a></p>
            
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The Servify Team</p>
          </div>
  
          <div class="footer">
            <p>If you didn't create an account with Servify, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} Servify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  const resetPasswordTemplate = (resetUrl, userName) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">Hello ${userName},</p>
        <p style="color: #555; font-size: 16px;">We received a request to reset your password for your Servify account. If you didn't make this request, you can safely ignore this email.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #555; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #0066cc; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">This link will expire in 15 minutes.</p>
      </div>
    `;
  };

  module.exports = { verifyEmailTemplate, resetPasswordTemplate };