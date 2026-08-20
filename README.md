# Expense Tracker API

A backend API for tracking personal income and expenses. Users sign up, log in, create their own categories, and log transactions. The API handles the math of current balance, spending broken down by category, and filtering transactions by date range.

**Live API:** https://expense-tracker-tuiv.onrender.com
_Note: hosted on Render's free tier. The first request may take up to a min if the service has been inactive._

## Features

- User signup and login
- JWT authentication with short-lived access tokens and refresh tokens
- Logout (revokes refresh token)
- Forgot password / reset password via email
- Rate limiting on login to prevent brute-force attempts
- Full CRUD for categories
- Full CRUD for transactions (income and expense)
- Transactions linked to categories and to the logged-in user
- Balance calculation (total income minus total expenses)
- Spending summary grouped by category
- Filter transactions by date range
- Request validation on all major inputs
- Users can only access their own data

## Built With

- Node.js
- Express.js
- MongoDB
- Mongoose (including aggregation pipelines)
- JWT
- bcryptjs
- express-validator
- express-rate-limit
- Resend (email delivery)
- dotenv
- cors

## Getting Started

Clone the repository:

    git clone https://github.com/Keben21/expense-tracker

Install dependencies:

    npm install

Create a `.env` file in the root directory:

    PORT=5000
    MONGO_URL
    JWT_SECRET
    JWT_REFRESH_SECRET
    RESEND_API_KEY

Start the server:

    npm run dev

The API will run on:

    http://localhost:5000

You can use Postman or another API testing tool to test the endpoints.

## API Endpoints

### Authentication

| Method | Endpoint                    | Description                                                 |
| ------ | --------------------------- | ----------------------------------------------------------- |
| POST   | `/api/auth/signup`          | Create a new account                                        |
| POST   | `/api/auth/login`           | Log in and receive an access + refresh token (rate limited) |
| POST   | `/api/auth/refresh`         | Get a new access token using a refresh token                |
| POST   | `/api/auth/logout`          | Log out and revoke refresh token                            |
| POST   | `/api/auth/forgot-password` | Request a password reset token via email                    |
| POST   | `/api/auth/reset-password`  | Reset password using the emailed token                      |

### Categories

All category routes require a valid access token.

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | `/api/categories`     | Create a category       |
| GET    | `/api/categories`     | Get all your categories |
| GET    | `/api/categories/:id` | Get a specific category |
| PUT    | `/api/categories/:id` | Update a category       |
| DELETE | `/api/categories/:id` | Delete a category       |

### Transactions

All transaction routes require a valid access token.

| Method | Endpoint                                | Description                                                           |
| ------ | --------------------------------------- | --------------------------------------------------------------------- |
| POST   | `/api/transactions`                     | Create a transaction                                                  |
| GET    | `/api/transactions`                     | Get all your transactions (supports `?startDate=&endDate=` filtering) |
| GET    | `/api/transactions/:id`                 | Get a specific transaction                                            |
| PUT    | `/api/transactions/:id`                 | Update a transaction                                                  |
| DELETE | `/api/transactions/:id`                 | Delete a transaction                                                  |
| GET    | `/api/transactions/summary/balance`     | Get total income, total expenses, and current balance                 |
| GET    | `/api/transactions/summary/by-category` | Get total spending grouped by category                                |

For protected routes, include the token in the request header:

    Authorization: Bearer YOUR_ACCESS_TOKEN

## Future Improvements

- Global error handling middleware
- Recurring transactions (e.g. monthly rent)
- Budgets per category with alert
