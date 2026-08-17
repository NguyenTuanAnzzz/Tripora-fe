import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem("token") || sessionStorage.getItem("token")
    );
    const [user, setUser] = useState({name: "",
        email: "",
        phone: "",
        role: ""
    });

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

            const accessToken = data.access_token || data.accessToken || data.token;
            
            if (!accessToken) {
                return { success: false, message: "Lỗi: Không nhận được token từ server" };
            }

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


    const getMyProfile = async () =>{
        try{
            const response = await fetch(
                "http://localhost:8080/api/get-info", 
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response.status === 401) {
                // Token hết hạn hoặc không hợp lệ -> Đăng xuất
                logout();
            }
        } catch (error) {
            console.error("Error:", error);
            return { success: false, message: "Không thể kết nối đến server" };
        }
    }

    useEffect(() => {
        if (token) {
            getMyProfile();
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
        user,
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