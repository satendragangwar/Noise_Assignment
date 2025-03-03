# Expense Tracker Application

This is a full-stack Expense Tracker application with a React frontend and a Node.js/Express backend.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd Expense_Tracker
    ```

2. Install dependencies for both frontend and backend:
    ```sh
    # For backend
    cd backend
    npm install
    
    # For frontend
    cd ../frontend
    npm install

    ```

### Running the Application

#### Backend

1. Create a `.env` file in the [backend](http://_vscodecontentref_/0) directory with the following content:
    ```env
    PORT=8000
    MONGO_URL=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret>
    ```

2. Start the backend server:
    ```sh
    cd backend
    npm start
    
    ```

The backend server will be available at `http://localhost:8000`.

#### Frontend

1. Start the frontend development server:
    ```sh
    cd frontend
    npm run dev

    ```

The frontend application will be available at `http://localhost:5173`.
