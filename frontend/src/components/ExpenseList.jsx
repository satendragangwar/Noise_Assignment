import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function ExpenseList({ onLogout }) {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        amount: '',
        category: '',
        date: '',
        description: '',
    });
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchExpenses = async () => {
        const token = localStorage.getItem('token');
        let url = `${import.meta.env.VITE_BACKEND_URL}/expenses`;
        
        const params = new URLSearchParams();
        if (filterCategory) {
            params.append('category', filterCategory);
        }
        if (filterDate) {
            params.append('date', filterDate);
        }
        if (params.toString()) {
            url += "?" + params.toString();
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch expenses');
            }
            const data = await response.json();
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [filterCategory, filterDate]);

    const handleInputChange = (e) => {
        setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify(newExpense),
            });

            if (response.ok) {
                fetchExpenses();
                setNewExpense({ amount: '', category: '', date: '', description: '' });
                closeModal();
            } else {
                console.error('Error adding expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                },
            });

            if (response.ok) {
                fetchExpenses();
            } else {
                console.error('Error deleting expense:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const handleFilterChange = (e) => {
        if (e.target.name === 'category') {
            setFilterCategory(e.target.value);
        } else if (e.target.name === 'date') {
            setFilterDate(e.target.value);
        }
    };

    const handleTotalExpenses = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/expenses/total?start=${startDate}&end=${endDate}`, {
                headers: {
                    'Authorization': token,
                },
            });
            const data = await response.json();
            setTotalExpenses(data.total);
        } catch (error) {
            console.error('Error fetching total expenses:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const expenseData = expenses.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += parseFloat(expense.amount);
        return acc;
    }, {});

    const pieData = Object.keys(expenseData).map((key) => ({
        name: key,
        value: expenseData[key],
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow mb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl mt-3 font-bold text-gray-800">Expense Tracker</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={openModal}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Expense
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Expense Breakdown</h2>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={pieData}
                                cx={150}
                                cy={150}
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        <div className="mt-6 p-4 bg-white shadow rounded">
                            <div className="flex items-center mb-2">
                                <label htmlFor="start-date" className="mr-2 text-gray-700 font-bold">
                                    Start Date:
                                </label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex items-center mb-2">
                                <label htmlFor="end-date" className="mr-2 text-gray-700 font-bold">
                                    End Date:
                                </label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <button
                                onClick={handleTotalExpenses}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Calculate Total
                            </button>
                            <p className="mt-2 text-gray-700">Total Expenses: ${totalExpenses}</p>
                        </div>
                    </div>

                    <div className="lg:w-2/3 lg:pl-4 mt-4 lg:mt-0">
                        <div className="mb-4 p-4 bg-white shadow rounded">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Filters</h2>
                            <div className="flex items-center mb-2">
                                <label htmlFor="category" className="mr-2 text-gray-700 font-bold">
                                    Category:
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    id="category"
                                    value={filterCategory}
                                    onChange={handleFilterChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="date" className="mr-2 text-gray-700 font-bold">
                                    Date:
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={filterDate}
                                    onChange={handleFilterChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Expenses</h2>
                        <ul className="divide-y divide-gray-200 bg-white shadow rounded p-4">

                            {
                                expenses.length === 0 ? (
                                    <li className="py-4 text-center text-gray-800">No expenses found</li>
                                ) :  expenses.map((expense) => (
                                    <li key={expense._id} className="py-4 flex justify-between">
                                        <div className="flex-1">
                                            <div className="text-gray-800 font-medium">
                                                <span className="font-bold">Date:</span> {expense.date.substring(0, 10)}
                                            </div>
                                            <div className="text-gray-800">
                                                <span className="font-bold">Category:</span> {expense.category}
                                            </div>
                                            <div className="text-gray-800">
                                                <span className="font-bold">Description:</span> {expense.description}
                                            </div>
                                        </div>
                                        <div className="text-gray-600 font-bold flex flex-col">
                                            ${expense.amount}
                                            <button
                                                onClick={() => handleDelete(expense._id)}
                                                className="text-red-500 text-sm ml-1 mt-4 hover:text-red-700 focus:outline-none"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            
                            
                           
                        </ul>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Expense</h3>
                                <div className="mt-2">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
                                                Amount:
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                placeholder="Amount"
                                                value={newExpense.amount}
                                                onChange={handleInputChange}
                                                required
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="category-modal" className="block text-gray-700 text-sm font-bold mb-2">
                                                Category:
                                            </label>
                                            <input
                                                type="text"
                                                name="category"
                                                id="category-modal"
                                                placeholder="Category"
                                                value={newExpense.category}
                                                onChange={handleInputChange}
                                                required
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="date-modal" className="block text-gray-700 text-sm font-bold mb-2">
                                                Date:
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                id="date-modal"
                                                placeholder="Date"
                                                value={newExpense.date}
                                                onChange={handleInputChange}
                                                required
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="description-modal" className="block text-gray-700 text-sm font-bold mb-2">
                                                Description:
                                            </label>
                                            <input
                                                type="text"
                                                name="description"
                                                id="description-modal"
                                                placeholder="Description"
                                                value={newExpense.description}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Add Expense
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExpenseList;