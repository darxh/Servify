<div align="center">

  <h1>🛠️ Servify</h1>
  
  <h3>The Modern Multi-Vendor Service Marketplace</h3>

  <p>
    A scalable MERN stack platform connecting customers with professional service providers.
    <br />
    <b>Secure. Seamless. Scalable.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/MERN-Stack-000000?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
    <img src="https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>
</div>

<br />

## About The Project

**Servify** is a professional-grade marketplace architecture designed to solve the fragmentation in local service bookings. It features a dual-interface system (Customer & Provider) with real-time status updates, robust security, and a seamless booking engine.

Built to demonstrate scalable backend logic and a responsive modern frontend.

---

## Key Features

### Authentication & Security
* **JWT & Cookie Management:** Secure HttpOnly cookie implementation for session management.
* **RBAC (Role-Based Access Control):** Strictly typed roles for `Admin`, `Provider`, and `Customer`.
* **Data Protection:** Bcrypt hashing for passwords and sanitized API inputs.

### Marketplace Engine
* **Dynamic Listings:** Providers have full CRUD capabilities for their service portfolios.
* **Smart Categorization:** Admin-managed taxonomy (e.g., Plumbing, Cleaning, Electrical).
* **Booking Workflow:** State-machine logic for bookings (`Pending` → `Confirmed` → `Completed`).
* **Conflict Prevention:** Self-booking restrictions and duplicate review prevention.

### Trust System
* **Verified Reviews:** Only customers with completed bookings can leave reviews.
* **Rating Aggregation:** Real-time calculation of provider ratings.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Backend** | Node.js, Express.js, JWT, Bcrypt |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Frontend** | React.js, Vite, Tailwind CSS (In Progress) |
| **State** | React Query, Context API |
| **DevOps** | Git, npm |

---

