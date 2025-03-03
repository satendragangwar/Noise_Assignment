import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                onLogin(data.token); // Store the token and update login state
                toast.success("Login Successful");
                navigate('/'); // Redirect to the main expense list page
            } else {
                toast.error("Invalid Credentials")
            }
        } catch (error) {
            toast.error("Cannot Login Now");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-md p-8 w-96">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center mt-4">
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-700">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;