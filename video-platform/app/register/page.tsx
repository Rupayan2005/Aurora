"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [successMessage, setSuccessMessage] = useState("");
    
    const router = useRouter();

    // Email validation
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation
    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    // Form validation
    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(password)) {
            newErrors.password = "Password must be at least 8 characters long";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccessMessage("");
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }
            
            setSuccessMessage("Registration successful! Redirecting to login...");
            console.log(data);
            
            // Clear form
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            
            // Redirect after a short delay to show success message
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            
        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ 
                submit: error instanceof Error ? error.message : "Registration failed. Please try again." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-300">Join us today and get started</p>
                </div>

                {/* Registration Form */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-gray-700/50 text-white placeholder-gray-400 ${
                                        errors.email ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-gray-700/50 text-white placeholder-gray-400 ${
                                        errors.password ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors bg-gray-700/50 text-white placeholder-gray-400 ${
                                        errors.confirmPassword ? 'border-red-400 bg-red-900/20' : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        {/* Error Messages */}
                        {errors.submit && (
                            <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-red-300">{errors.submit}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg backdrop-blur-sm">
                                <p className="text-sm text-green-300">{successMessage}</p>
                            </div>
                        )}
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            Already have an account?{" "}
                            <button
                                onClick={() => router.push("/login")}
                                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RegisterPage;