// src/components/AuthPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords for registration
    if (isRegister && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // Determine API endpoint based on register/login mode
    const url = isRegister
      ? "http://localhost:5000/api/users/register"
      : "http://localhost:5000/api/users/login";

    // For login, send only email and password
    const dataToSend = isRegister
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, dataToSend);
      if (response.status === 200) {
        const successMsg = response.data.message || "Success!";
        setMessage(successMsg);
        toast.success(successMsg);
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/kanban");
        }, 1000);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Marketing / Information Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Organize Your Work with Kanban
          </h1>
          <p className="text-lg opacity-90 text-gray-800 dark:text-gray-300">
            A simple and intuitive Kanban board to help you manage your tasks
            and projects effectively. Create lists, add tasks, set priorities,
            and track progress all in one place.
          </p>
        </div>
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
            {isRegister ? "Register" : "Login"}
          </h2>
          {message && (
            <p className="text-red-500 text-sm mb-4 text-center">{message}</p>
          )}
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            {isRegister && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-white">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                // Reset form data and message when toggling
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
                setMessage("");
              }}
              className="text-blue-500 underline ml-1"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
