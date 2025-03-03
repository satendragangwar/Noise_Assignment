import React, { useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseList from './components/ExpenseList';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <ToastContainer position="top-center" />
                <Routes>
                    <Route
                        path="/login"
                        element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                    />
                    <Route
                        path="/register"
                        element={isLoggedIn ? <Navigate to="/" /> : <Register />}
                    />
                    <Route
                        path="/"
                        element={
                            isLoggedIn ? (
                                <ExpenseList onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;