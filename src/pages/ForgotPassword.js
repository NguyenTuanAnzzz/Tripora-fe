import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import ButtonField from "../components/ButtonField";
import ErrorMessage from "../components/ErrorMessage";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const inputRefs = useRef([]);

    const handleSendOtp = async(e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email}),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Quên mật khẩu thất bại");
                return;
            }

            console.log("Send OTP to", email);
            setStep(2); // Chuyển sang bước nhập OTP

        } catch (error) {
            console.error("Error:", error);
            setMessage("Không thể kết nối đến server");
        }
    };

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (value === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (!alphanumericValue) return;

        const newOtp = [...otp];
        newOtp[index] = alphanumericValue.slice(-1); 
        setOtp(newOtp);

        if (index < 5 && alphanumericValue) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            if (otp[index] === '') {
                if (index > 0) inputRefs.current[index - 1].focus();
            } else {
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === "ArrowLeft") {
            if (index > 0) inputRefs.current[index - 1].focus();
        } else if (e.key === "ArrowRight") {
            if (index < 5) inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            const nextFocus = Math.min(pastedData.length, 5);
            if(nextFocus < 6) {
                inputRefs.current[nextFocus].focus();
            } else {
                inputRefs.current[5].focus();
            }
        }
    };

    const handleVerifyOtp = async(e) => {
        e.preventDefault();
        setMessage("");
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            setMessage("Vui lòng nhập đủ mã OTP 6 số");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/verify-forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, otp: otpCode}),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Xác thực OTP thất bại");
                return;
            }

            console.log("Verify OTP", otpCode, "for email", email);
            setStep(3); // Chuyển sang bước đổi mật khẩu

        } catch (error) {
            console.error("Error:", error);
            setMessage("Không thể kết nối đến server");
        }
    };

    const handleChangePassword = async(e) => {
        e.preventDefault();
        setMessage("");
        
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        const otpCode = otp.join('');

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, otp: otpCode, newPassword}),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Đổi mật khẩu thất bại");
                return;
            }

            // Chuyển về trang đăng nhập sau khi đổi thành công
            window.location.href = '/login';

        } catch (error) {
            console.error("Error:", error);
            setMessage("Không thể kết nối đến server");
        }
    };

    const isOtpComplete = otp.every((digit) => digit !== '');

    return (
        <AuthLayout
            title="Quên mật khẩu"
            subtitle={
                step === 1 ? "Nhập email của bạn để nhận mã xác thực." 
                : step === 2 ? "Nhập mã OTP đã được gửi đến email của bạn."
                : "Tạo mật khẩu mới cho tài khoản của bạn."
            }
        >
            {step === 1 ? (
                <form className="mt-8 flex flex-col" onSubmit={handleSendOtp}>
                    <InputField
                        label="Địa chỉ email"
                        type="email"
                        id="email"
                        placeholder="email@vidu.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <div className="mt-2">
                        <ButtonField type="submit">
                            Gửi mã xác nhận
                        </ButtonField>
                    </div>

                    <div className="mt-6 text-center text-body text-stone">
                        Nhớ mật khẩu?{" "}
                        <Link
                            to="/login"
                            className="text-ember-orange-link font-medium hover:underline ml-1"
                        >
                            Đăng nhập lại
                        </Link>
                    </div>
                    {message && <ErrorMessage message={message} />}
                </form>
            ) : step === 2 ? (
                <form className="mt-8 flex flex-col" onSubmit={handleVerifyOtp}>
                    
                    <div className="flex justify-between gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={2}
                                value={digit}
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-[48px] h-[56px] md:w-[60px] md:h-[64px] bg-canvas-white border border-paper rounded-xl text-carbon-black text-heading-sm font-semibold text-center transition-all outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange"
                            />
                        ))}
                    </div>
                    
                    <div className="mt-2">
                        <ButtonField type="submit" disabled={!isOtpComplete}>
                            Xác nhận OTP
                        </ButtonField>
                    </div>

                    <div className="mt-6 text-center text-body text-stone">
                        Không nhận được mã?{" "}
                        <button
                            type="button"
                            onClick={() => console.log("Resend OTP")}
                            className="text-ember-orange-link font-medium hover:underline ml-1"
                        >
                            Gửi lại mã
                        </button>
                    </div>
                    {message && <ErrorMessage message={message} />}
                </form>
            ) : (
                <form className="mt-8 flex flex-col" onSubmit={handleChangePassword}>
                    <InputField
                        label="Mật khẩu mới"
                        type="password"
                        id="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    
                    <InputField
                        label="Xác nhận mật khẩu"
                        type="password"
                        id="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    
                    <div className="mt-2">
                        <ButtonField type="submit">
                            Đổi mật khẩu
                        </ButtonField>
                    </div>
                    {message && <ErrorMessage message={message} />}
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
