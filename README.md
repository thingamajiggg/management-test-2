# User Management System

A full-stack application for managing users with a modern React frontend and NestJS backend.

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn package manager

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend/user-management-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your database connection in the `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=user_management
   ```

4. Start the backend server:
   ```
   npm run start:dev
   ```

   The backend will run on http://localhost:3001

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend/user-management-client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend will run on http://localhost:3000


## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user


##Frontend

1. Sorting
- Column headers are clickable to toggle between ascending 🔼 and descending 🔽 order.
- Sorting is handled using getSortedRowModel() from TanStack Table.

2.Global Search / Filtering
- A global search input is available to filter data across all columns.
- Filtering logic is managed using getFilteredRowModel().

3. Pagination
- Built-in pagination controls for navigating between pages (First, Previous, Next, Last).
- Page size selector available (10, 25, 50 rows per page).
- Pagination handled via getPaginationRowModel().