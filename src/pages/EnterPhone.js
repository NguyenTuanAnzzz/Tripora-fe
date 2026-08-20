import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import ButtonField from "../components/ButtonField";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const EnterPhone = () => {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { token, user, getMyProfile } = useAuth();

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Wait for user data to load
    if (token && !user.role) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <Loading className="w-12 h-12" />
            </div>
        );
    }

    // If user already has a phone number, redirect them away
    if (user.phone) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!phone) {
            setMessage("Vui lòng nhập số điện thoại");
            return;
        }

        // Example regex for Vietnamese phone number
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            setMessage("Số điện thoại không hợp lệ");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/enter-phone", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ phone }),
            });
            
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: "Lỗi phản hồi từ server" };
            }

            if (!response.ok) {
                setMessage(data.message || "Có lỗi xảy ra");
                return;
            }

            setMessage("Cập nhật số điện thoại thành công");
            await getMyProfile();
            navigate("/");
        } catch (error) {
            setMessage("Không thể kết nối đến server");
        }
    };

    return (
        <AuthLayout
            title="Nhập số điện thoại"
            subtitle="Vui lòng nhập số điện thoại của bạn để tiếp tục."
        >
            <form className="mt-8 flex flex-col" onSubmit={handleSubmit}>
                <InputField
                    label="Số điện thoại"
                    type="tel"
                    id="phone"
                    placeholder="Nhập số điện thoại..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                
                <div className="mt-2">
                    <ButtonField type="submit">
                        Tiếp tục
                    </ButtonField>
                </div>

                {message && <ErrorMessage message={message} />}
            </form>
        </AuthLayout>
    );
};

export default EnterPhone;
