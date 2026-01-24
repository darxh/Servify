<div align="center">

  <h1>Servify</h1>
  
  <h3>The Modern Multi-Vendor Service Marketplace</h3>

  <p>
    A scalable MERN stack platform connecting customers with professional service providers.
    <br />
    <b>Secure. Seamless. Scalable.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/MERN-Stack-000000?style=flat&logo=mongodb&logoColor=white" alt="MERN Stack" />
    <img src="https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=flat" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=flat" alt="License" />
  </p>

  <p>
    <a href="#about-the-project">About</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

<br />

## About The Project

**Servify** is a professional-grade marketplace architecture designed to solve the fragmentation in local service bookings. It features a dual-interface system (Customer & Provider) with real-time status updates, robust security, and a seamless booking engine.

Built to demonstrate scalable backend logic using **Express 5** and a responsive modern frontend powered by **React 19** and **Vite**.

![Servify Preview](https://github.com/darxh/Servify/blob/main/Client/src/assets/preview.png)

---

## Key Features

### 🛡️ Authentication & Security
* **Advanced Auth Patterns:** Secure HttpOnly cookie implementation for session management with JWT.
* **Role-Based Access Control (RBAC):** Strictly typed permissions for `Admin`, `Provider`, and `Customer`.
* **Data Security:** Passwords hashed via **BcryptJS**; API inputs sanitized to prevent injection.

### 🛒 Marketplace Engine
* **Dynamic Listings:** Providers have full CRUD capabilities for their service portfolios.
* **Media Management:** Seamless image uploads and hosting using **Cloudinary** and **Multer**.
* **Smart Categorization:** Admin-managed taxonomy (e.g., Plumbing, Cleaning, Electrical).
* **Booking Workflow:** State-machine logic for bookings (Pending → Confirmed → Completed).

### ⚡ Frontend Performance & UX
* **State Management:** Powered by **TanStack Query (React Query)** for efficient server-state caching and synchronization.
* **Robust Forms:** Built with **React Hook Form** and **Zod** schema validation for type-safe inputs.
* **Interactive UI:** Toast notifications via **React Hot Toast** and modern iconography using **Lucide React**.

---

## Tech Stack

### Client (Frontend)
* **Core:** React 19, Vite, React Router DOM
* **Styling:** Tailwind CSS 4, PostCSS
* **State & Fetching:** TanStack React Query, Axios
* **Forms & Validation:** React Hook Form, Zod
* **UI/UX:** Lucide React, React Hot Toast

### Server (Backend)
* **Runtime:** Node.js, Express.js 5
* **Database:** MongoDB Atlas, Mongoose ODM
* **Authentication:** JSON Web Tokens (JWT), BcryptJS, Cookie-Parser
* **File Storage:** Cloudinary, Multer
* **Utilities:** Dotenv, Cors

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas Connection String
* Cloudinary API Credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/darxh/Servify.git](https://github.com/darxh/Servify.git)
    cd Servify
    ```

2.  **Setup Backend**
    ```bash
    cd Server
    npm install
    ```
    Create a `.env` file in the `Server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

3.  **Setup Frontend**
    ```bash
    cd ../Client
    npm install
    ```

### Running the App

1.  **Start the Server**
    ```bash
    # Inside /Server directory
    npm run dev
    ```

2.  **Start the Client**
    ```bash
    # Inside /Client directory
    npm run dev
    ```

Open your browser and navigate to `http://localhost:5173`.


## Project Structure

```bash
Servify/
├── Client/                 # React 19 Frontend
│   ├── src/
│   │   ├── features/       # Feature-based architecture (Auth, Bookings, Home)
│   │   ├── hooks/          # Custom Hooks (useCreateBooking, useService, etc.)
│   │   ├── pages/          # Route components
│   │   ├── context/        # Global Auth Context
│   │   └── lib/            # Axios setup & Utils
│   └── ...
├── Server/                 # Node.js Backend
│   ├── config/             # DB & Cloudinary Config
│   ├── controllers/        # Route Logic
│   ├── models/             # Mongoose Schemas (User, Service, Booking, Review)
│   ├── routes/             # API Endpoints
│   ├── middleware/         # Auth & Error handling
│   └── ...

```

---

<div align="center">
  <sub>Designed & Developed by Darshan</sub>
</div>
