import {createContext, useState, useContext, useEffect} from 'react';
import { data } from 'react-router-dom';

const AuthContext = createContext(null);

// provider component
export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    // handle login
    const login = (userData) => {
        // store data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('id', userData.id)
        setIsLoggedIn(true);
        // localStorage.setItem('user', JSON.stringify(userData))
    };

    // handle logout
    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('id')
        // localStorage.removeItem('user');
        // alert("logged out")
        setIsLoggedIn(false);
    };

    const contextValue = {
        isLoggedIn,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}