# Servify

**Servify** is a full-stack service booking platform built with the MERN stack that bridges the gap between professional service providers and customers. Whether you need a plumber, electrician, cleaner, or any other professional service, Servify provides a seamless experience for browsing, comparing, and booking services.

The platform features robust role-based access control, real-time booking management, secure authentication with Google OAuth, and an intuitive interface for both service providers and customers.

![Servify Preview](https://i.postimg.cc/SNBHWS9c/Screenshot-2026-02-02-213229.png)

## Key Features

### For Customers
- **Smart Search & Filtering** - Find services by keyword, category, price range, and custom sorting options
- **Seamless Booking** - Book services for specific dates and times with automatic conflict detection
- **Personal Dashboard** - Track all your bookings with real-time status updates (Pending, Confirmed, Completed)
- **Reviews & Ratings** - Rate and review services after completion to help other users
- **Profile Management** - Update personal details, bio, and preferences

### For Service Providers
- **Service Management** - Create, update, and delete service listings with detailed descriptions and images
- **Booking Control** - Accept or reject incoming booking requests with full autonomy
- **Business Dashboard** - View earnings, manage active services, and track your schedule
- **Conflict Prevention** - Automatic detection of scheduling conflicts to prevent double bookings
- **Role-Based Access** - Specialized provider tools with secure access control

### Security & Authentication
- **JWT Authentication** - Secure token-based auth with HttpOnly cookies for enhanced security
- **Google OAuth 2.0** - One-click login and registration using Google accounts
- **Email Verification** - Account verification via email using Nodemailer
- **Password Security** - Bcrypt hashing for password protection
- **Payment Ready** - Architecture ready for payment gateway integration

---

## Tech Stack

### Frontend (Client)
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with Vite build tool |
| **Tailwind CSS 4** | Utility-first styling framework |
| **React Query** | Server state management and data fetching |
| **React Router DOM v7** | Client-side routing |
| **React Hook Form** | Form handling and validation |
| **Zod** | Schema validation |
| **Lucide React** | Modern icon library |

### Backend (Server)
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB object modeling |
| **JWT** | JSON Web Tokens for authentication |
| **Google Auth Library** | Google OAuth integration |
| **Cloudinary** | Cloud-based image storage and management |
| **Nodemailer** | Email sending service |
| **Bcrypt** | Password hashing |

---

## Getting Started

Follow these steps to set up Servify locally.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)
- **Cloudinary Account** (for image storage)
- **Google Cloud Console Project** (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/darxh/Servify.git
cd Servify
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd Server
npm install
```

Create a `.env` file in the `Server` folder with the following configuration:

```env
# Server Configuration
PORT=8080
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:8080`

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies:

```bash
cd Client
npm install
```

Create a `.env` file in the `Client` folder:

```env
VITE_API_URL=http://localhost:8080/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the frontend development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api/v1

---

## Project Structure

```
Servify/
├── Client/                       # React Frontend (Vite)
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── context/              # Global state management (AuthContext)
│   │   ├── features/             # Feature-based UI components
│   │   │   ├── auth/             # Forms and OAuth buttons
│   │   │   ├── bookings/         # Booking modals and logic
│   │   │   ├── home/             # Landing page sections (Hero, Categories, etc.)
│   │   │   ├── reviews/          # Review modals
│   │   │   └── services/         # Search & filtering components
│   │   ├── hooks/                # Custom data fetching hooks (React Query)
│   │   ├── layouts/              # UI Layouts (AuthLayout, MainLayout, Dashboard/Sidebar)
│   │   ├── lib/                  # Third-party configurations (Axios instance)
│   │   ├── pages/                # Application routes
│   │   │   ├── auth/             # LoginPage, RegisterPage
│   │   │   ├── dashboard/        # Provider/User Dashboard, Settings, Create/Edit Services
│   │   │   ├── home/             # HomePage
│   │   │   └── services/         # ServicesPage, ServiceDetailsPage
│   │   ├── utils/                # Helper functions (formatCurrency)
│   │   ├── main.jsx              # React application entry point
│   │   └── router.jsx            # Application routing (React Router)
│   ├── index.html                # HTML entry point
│   └── vite.config.js            # Vite configuration
│
└── Server/                       # Node.js & Express Backend
    ├── config/                   # Database (db.js) & Cloudinary configurations
    ├── controllers/              # Business logic handling
    │   ├── authController.js     
    │   ├── bookingController.js  
    │   ├── categoryController.js 
    │   ├── reviewController.js   
    │   └── serviceController.js  
    ├── middleware/               # Custom Express middlewares (authMiddleware.js)
    ├── models/                   # Mongoose Database Schemas
    │   ├── bookingModel.js
    │   ├── categoryModel.js
    │   ├── reviewModel.js
    │   ├── serviceModel.js
    │   └── userModel.js
    ├── routes/                   # API route definitions
    ├── utils/                    # Helper functions (emailTemplates, generateToken, sendEmail)
    ├── seed.js                   # Database seeding script
    └── server.js                 # Backend entry point
```
<!--
---

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | ❌ |
| POST | `/api/v1/auth/login` | Login with email & password | ❌ |
| POST | `/api/v1/auth/google` | Google OAuth login/register | ❌ |
| POST | `/api/v1/auth/logout` | Logout user | ✅ |
| GET | `/api/v1/auth/verify-email` | Verify email address | ❌ |
| POST | `/api/v1/auth/refresh` | Refresh access token | ✅ |

### Service Routes

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/v1/services` | Get all services (with filters) | ❌ | - |
| GET | `/api/v1/services/:id` | Get service by ID | ❌ | - |
| POST | `/api/v1/services` | Create new service | ✅ | Provider |
| PUT | `/api/v1/services/:id` | Update service | ✅ | Provider |
| DELETE | `/api/v1/services/:id` | Delete service | ✅ | Provider |
| GET | `/api/v1/services/provider/my-services` | Get provider's services | ✅ | Provider |

**Query Parameters for GET /services:**
- `search` - Search by keyword
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `sortBy` - Sort by (price, rating, createdAt)
- `order` - Order (asc, desc)

### Booking Routes

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/v1/bookings` | Create a new booking | ✅ | Customer |
| GET | `/api/v1/bookings/my-bookings` | Get user's bookings | ✅ | Customer |
| GET | `/api/v1/bookings/provider-bookings` | Get provider's bookings | ✅ | Provider |
| PATCH | `/api/v1/bookings/:id/status` | Update booking status | ✅ | Provider |
| GET | `/api/v1/bookings/:id` | Get booking details | ✅ | Customer/Provider |

### User Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/users/profile` | Get user profile | ✅ |
| PUT | `/api/v1/users/profile` | Update user profile | ✅ |
| POST | `/api/v1/users/become-provider` | Upgrade to provider account | ✅ |

### Review Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/reviews` | Create a review | ✅ |
| GET | `/api/v1/reviews/service/:serviceId` | Get service reviews | ❌ |

---

## Key Features Implementation

### Authentication Flow
1. User registers with email/password or Google OAuth
2. Email verification link sent (for email registration)
3. JWT tokens (access & refresh) issued upon successful login
4. HttpOnly cookies store refresh tokens securely
5. Access tokens include user role for authorization

### Booking System
1. Customer selects service and date/time
2. System checks for provider availability conflicts
3. Booking created with "Pending" status
4. Provider receives notification and can accept/reject
5. Customer notified of booking status changes
6. Upon completion, customer can leave a review

### Image Upload
1. Service providers upload images when creating services
2. Images processed and stored in Cloudinary
3. Optimized URLs returned and stored in MongoDB
4. Automatic image transformation and CDN delivery

---

## Security Measures

- **Password Hashing:** Bcrypt with salt rounds for secure password storage
- **JWT Tokens:** Separate access (15min) and refresh (7 days) tokens
- **HttpOnly Cookies:** Refresh tokens stored in HttpOnly cookies to prevent XSS
- **CORS Protection:** Configured CORS to allow only trusted origins
- **Input Validation:** Zod schemas validate all user inputs
- **MongoDB Injection Prevention:** Mongoose sanitizes queries automatically
- **Rate Limiting:** (Ready for implementation)
- **Helmet.js:** (Ready for implementation) Security headers

---

## Testing

```bash
# Run backend tests
cd Server
npm test

# Run frontend tests
cd Client
npm test
```

---

## Deployment

### Backend Deployment (Render, Railway, Heroku)
1. Set environment variables in hosting platform
2. Ensure MongoDB Atlas is configured
3. Deploy from GitHub repository
4. Update `CLIENT_URL` to production frontend URL

### Frontend Deployment (Vercel, Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Build the project: `npm run build`
3. Deploy the `dist` folder
4. Configure redirects for SPA routing

---
-->

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
   ```bash
   git fork https://github.com/darxh/Servify.git
   ```

2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## Roadmap

- [ ] **Payment Integration** - Stripe/PayPal integration for secure payments
- [ ] **Real-time Chat** - Socket.io for provider-customer communication
- [ ] **Push Notifications** - Real-time booking updates
- [ ] **Advanced Analytics** - Provider dashboard with earnings analytics
- [ ] **Mobile App** - React Native version
- [ ] **Multi-language Support** - i18n internationalization
- [ ] **Service Packages** - Bundle multiple services at discounted rates
- [ ] **Loyalty Program** - Rewards system for frequent users

---
