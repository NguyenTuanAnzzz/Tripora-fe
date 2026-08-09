import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("token") || sessionStorage.getItem("token")
    );
    const [name, setName] = useState("");

    const isAuthenticated = !!token;

    // Login
    const login = async (form) => {
        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: form.email, password: form.password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || "Đăng nhập thất bại" };
            }

            const accessToken = data.access_token;
            setToken(accessToken);
            
            if (form.rememberMe) {
                localStorage.setItem("token", accessToken);
            } else {
                sessionStorage.setItem("token", accessToken);
            }

            return { success: true };

        } catch (error) {
            console.error("Error:", error);
            return { success: false, message: "Không thể kết nối đến server" };
        }
    };

    const getName = async () =>{
        try{
            const response = await fetch(
                "http://localhost:8080/api/auth/get-name", // <-- Sửa lại API endpoint lấy thông tin user cho đúng với backend của bạn
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Xóa dấu '+' thừa
                    },
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setName(data.name); // Lấy data sau khi parse JSON
            }
        } catch (error) {
            console.error("Error:", error);
            return { success: false, message: "Không thể kết nối đến server" };
        }
    }

    useEffect(() => {
        if (token) {
            getName();
        } else {
            setName("");
        }
    }, [token]);

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setToken(null);
    };

    const value = {
        token,
        isAuthenticated,
        name,
        login,
        logout,
        
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};