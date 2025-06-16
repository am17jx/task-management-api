# Task Management API



<p align="center">
  <strong>A powerful, secure, and carefully designed API for managing users and their daily tasks.</strong>
  <br />
  <br />
  <a href="#✨-core-features"><strong>Explore Features »</strong></a>
  ·
  <a href="#-api-documentation"><strong>API Docs »</strong></a>
  ·
  <a href="#-getting-started"><strong>How to Run »</strong></a>
</p>

---

## 🚀 About The Project

This project is more than just an API; it's a complete solution for task management built on a strong foundation of security and performance. Developed with **Node.js** and **Express** and a **MongoDB** database, it provides a fast and reliable backend experience.

The project showcases modern backend development best practices, including:
* A complete authentication system based on **JWT**.
* Secure and encrypted password management.
* Access permissions for users and administrators.
* Advanced error handling for a stable user experience.

---

## ✨ Core Features

| Feature | Description |
| :--- | :--- |
| 🔐 **Secure Authentication** | A protected signup and login system using JWT, with token expiration for enhanced security. |
| 🔑 **Password Management** | Passwords are hashed using `bcrypt`, with a secure mechanism for resetting forgotten passwords via email. |
| 🛡️ **Permissions & Control**| A role-based access control system (`user`, `admin`) to restrict access to sensitive operations. |
| 📝 **Full Task Management**| Complete CRUD operations (Create, Read, Update, Delete) for tasks, ensuring each user can only control their own tasks. |
| ⚙️ **Advanced Security** | Uses `helmet` to set secure HTTP headers and `express-rate-limit` to protect against brute-force attacks. |
| 🛠️ **Smart Error Handling**| A global error handler that distinguishes between operational and programming errors, displaying detailed messages in development and user-friendly messages in production. |
| ♻️ **Code Quality** | Follows the "Don't Repeat Yourself" (DRY) principle by using a `handlerFactory` for repetitive database operations, resulting in cleaner and more maintainable code. |

---

## 💻 Tech Stack

* **Node.js & Express.js:** The environment and framework for building the server.
* **MongoDB:** The NoSQL database for data storage.
* **Mongoose:** For data modeling and easy interaction with the database.
* **JSON Web Tokens (JWT):** For secure authentication and route protection.
* **Bcrypt.js:** For securely hashing passwords.
* **Nodemailer:** For sending emails (like password resets).
* **Helmet, express-rate-limit, xss-clean:** To protect the application from common vulnerabilities.

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or later)
* MongoDB (either a local instance or a free account on MongoDB Atlas)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/am17jx/task-management-api.git](https://github.com/am17jx/task-management-api.git)
    cd task-management-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `config.env` in the project's root directory and fill it with the necessary variables. You can copy the contents of `config.env.example` (if it exists) as a starting point.

4.  **Run the development server:**
    ```bash
    npm start
    ```

---

## ⚙️ API Documentation

The base URL for all routes is `/api`.

### 👤 Authentication & Account Management

These routes are public and are used for managing user accounts.

| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Sign Up** | `POST` | `/users/signup` | Creates a new user. |
| **Log In** | `POST` | `/users/login` | Logs in a user and returns a JWT. |
| **Forgot Password**| `POST` | `/users/forgetPassword`| Sends a password reset link to the user's email. |
| **Reset Password** | `PATCH` | `/users/resetPassword/:token`| Resets the password using the provided token. |
| **Update Password**| `PATCH` | `/users/updateMyPassword` | Allows a logged-in user to update their current password (Protected). |

### ✅ Task Management (Protected)

These routes require the user to be logged in (send a Bearer Token in the `Authorization` header).

| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get All Tasks** | `GET` | `/task/getalltask` | Fetches all tasks belonging to the currently logged-in user. |
| **Create Task** | `POST` | `/task/createtask` | Creates a new task associated with the current user. |
| **Get Specific Task**| `GET` | `/task/:id` | Fetches details of a single task owned by the user. |
| **Update Task** | `PATCH` | `/task/:id` | Updates a task owned by the user. |
| **Delete Task** | `DELETE`| `/task/:id` | Deletes a task owned by the user. |

### 👑 User Management (Admin Only)

These routes require the user to be logged in and have an `admin` role.

| Operation | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get All Users**| `GET` | `/users` | Retrieves a list of all users in the system. |
| **Create User** | `POST` | `/users` | Creates a new user by an admin. |
| **Get Specific User**| `GET` | `/users/:id` | Retrieves data for a specific user. |
| **Update User** | `PATCH` | `/users/:id` | Updates data for a specific user. |
| **Delete User** | `DELETE`| `/users/:id` | Deletes a specific user from the system. |
