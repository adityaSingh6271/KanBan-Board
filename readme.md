# Kanban Board Application

A full‑stack Kanban board application featuring user authentication, JWT-based protection, and a modern drag‑and‑drop interface. The backend is built with Node.js, Express, and MongoDB (Mongoose) while the frontend is built using React and Tailwind CSS.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [Installation & Setup](#installation--setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Kanban Board Features](#kanban-board-features)
- [Additional Information](#additional-information)
- [License](#license)

---

## Tech Stack

- **Backend:**
  - Node.js
  - Express
  - MongoDB & Mongoose
  - JSON Web Token (JWT) for authentication
  - bcryptjs for password hashing
- **Frontend:**
  - React
  - Tailwind CSS
  - react-router-dom for routing
  - axios for HTTP requests
  - react-toastify for notifications
  - react-beautiful-dnd for drag‑and‑drop functionality

---

## Project Structure

### Backend Structure

backend/ ├── config/ │ └── connectDB.js # MongoDB connection setup ├── middleware/ │ └── authMiddleware.js # JWT token verification middleware ├── models/ │ └── User.js # Mongoose user schema & model ├── routes/ │ └── userRoutes.js # User authentication routes (register, login) ├── .env # Environment variables (MONGO_URI, JWT_SECRET, PORT, etc.) └── server.js # Express server entry point

shell
Copy
Edit

### Frontend Structure

frontend/ ├── public/ │ └── index.html ├── src/ │ ├── components/ │ │ ├── AuthPage.jsx # Login/Registration component │ │ ├── KanbanBoard.jsx # Main Kanban board component │ │ ├── List.jsx # Kanban list component │ │ └── Task.jsx # Kanban task (card) component │ ├── App.jsx # App component containing routing │ ├── index.css # Global styles (including Tailwind CSS imports) │ └── index.js # ReactDOM rendering entry point └── package.json

yaml
Copy
Edit

---

## Installation & Setup

### Backend Setup

1. **Clone the repository and navigate to the backend folder:**
   ```bash
   git clone <repository-url>
   cd backend
Install dependencies:

bash
Copy
Edit
npm install
Configure Environment Variables:
Create a .env file in the backend folder and add:

env
Copy
Edit
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
PORT=5000
Note: If you previously had a username index causing duplicate key errors, ensure that index is dropped from your database (see the Troubleshooting section below).

Run the Server:

bash
Copy
Edit
npm start
Or for development with nodemon:

bash
Copy
Edit
npm run dev
Frontend Setup
Navigate to the frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Configure Tailwind CSS:
Follow the Tailwind CSS installation guide if needed (your project should have the necessary configuration in index.css and tailwind.config.js).

Run the Frontend:

bash
Copy
Edit
npm start
Usage
Authentication Endpoints
Register:
POST /api/users/register
Body:
json
Copy
Edit
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "password": "yourpassword",
  "confirmPassword": "yourpassword"
}
Login:
POST /api/users/login
Body:
json
Copy
Edit
{
  "email": "your.email@example.com",
  "password": "yourpassword"
}
Successful authentication returns a JWT token which is used for protected routes.

Kanban Board Features
Lists:
Create, edit, and delete lists (e.g., "To Do", "In Progress", "Done").
Tasks/Cards:
Within each list, add, edit, and delete tasks. Each task includes a title, description, due date (with time via datetime-local), and priority.
Drag & Drop:
Use the drag‑and‑drop functionality powered by react-beautiful-dnd to reorder tasks within a list or move them between lists.
Notifications:
react-toastify is used to display notifications for login, logout, list actions, and error handling.
Additional Information
Authentication:
The backend uses JWT for authentication. Protected routes can be created by using middleware (see authMiddleware.js).
Error Handling:
The backend returns informative error messages if registration or login fails (e.g., duplicate email). The frontend displays these messages via toast notifications.
Troubleshooting:
If you encounter errors related to duplicate keys (e.g., the username_1 error), ensure you have dropped any outdated indexes from your MongoDB collection. Use the MongoDB Atlas UI or a one-time script to drop the index.