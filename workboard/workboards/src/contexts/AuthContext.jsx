import React, { createContext, useContext } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/login', { username, password });
            localStorage.setItem('token', response.data.access);
            // Set Authorization header after login
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            return response.data;  // You can return the entire response or just the token
        } catch (error) {
            throw error;  // Handle the error appropriately
        }
    };

    return (
        <AuthContext.Provider value={{ login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
