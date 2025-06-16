# Task Management API

A powerful and secure RESTful API for managing users and their tasks, built with Node.js, Express, and MongoDB. This project demonstrates modern backend development practices including JWT authentication, role-based access control, secure password handling, and advanced error management.

## ✨ Features

-   **Authentication**: Secure signup and login functionality using JSON Web Tokens (JWT).
-   **Password Management**: Hashed passwords using `bcrypt` and secure password reset via email.
-   **Authorization**: Role-based access control (`user`, `admin`) to restrict operations.
-   **Task Management**: Full CRUD (Create, Read, Update, Delete) operations for tasks, where users can only manage their own tasks.
-   **Security**: Enhanced security using `helmet`, rate limiting to prevent brute-force attacks, and parameter sanitation.
-   **Error Handling**: Advanced error handling that provides detailed messages in development and user-friendly messages in production.
-   **Code Quality**: Follows the DRY principle by using a handler factory for CRUD operations.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [MongoDB](https://www.mongodb.com/) (local instance or a cloud service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `config.env` file in the root directory by copying the `config.env.example` file and filling in your own values.

    ```bash
    cp config.env.example config.env
    ```

4.  **Start the development server:**
    ```bash
    npm start
    ```

## ⚙️ Environment Variables

The following environment variables are required for the application to run. See `config.env.example` for more details.

-   `NODE_ENV`
-   `PORT`
-   `DATABASE`
-   `DATABASE_PASSWORD`
-   `JWT_SECRET`
-   `JWT_EXPIRES_IN`
-   `JWT_COOKIE_EXPIRES_IN`
-   `EMAIL_HOST`
-   `EMAIL_PORT`
-   `EMAIL_USERNAME`
-   `EMAIL_PASSWORD`