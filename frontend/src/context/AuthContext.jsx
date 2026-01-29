import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Optionally decode token to set user info
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};