import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import ButtonField from "../components/ButtonField";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [message, setMessage] = useState("");
    const auth = useAuth();
    const handleSubmit = async(e) => {
        e.preventDefault();
        setMessage("");

        const result = await auth.login(form);
        if (result.success) {
            navigate("/");
        } else {
            setMessage(result.message);
        }
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại"
            subtitle="Đăng nhập để tiếp tục hành trình khám phá của bạn."
        >
            <form className="mt-8 flex flex-col" onSubmit={handleSubmit}>
                <InputField
                    label="Địa chỉ email"
                    type="email"
                    id="email"
                    placeholder="email@vidu.com"
                    value={form.email}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value,
                        })
                    }
                />

                <InputField
                    label="Mật khẩu"
                    type="password"
                    id="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={form.password}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value,
                        })
                    }
                />

                <div className="flex items-center justify-between mb-6 mt-2">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={form.rememberMe}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    rememberMe: e.target.checked,
                                })
                            }
                            className="h-20 w-20 rounded border-paper text-ember-orange focus:ring-ember-orange cursor-pointer transition-colors accent-ember-orange"
                        />
                        <label htmlFor="remember-me" className=" ml-2 block text-body-sm text-stone cursor-pointer">
                            Ghi nhớ đăng nhập
                        </label>
                    </div>
                    <Link
                        to="/forgot-password"
                        className="text-body-sm text-ember-orange-link font-medium hover:underline"
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                {/* Primary CTA - Ember Orange with Shadow */}
                <ButtonField type="submit">
                    Đăng nhập
                </ButtonField>

                <div className="flex items-center my-6 before:flex-1 before:border-t before:border-paper before:mt-0.5 after:flex-1 after:border-t after:border-paper after:mt-0.5">
                    <p className="text-center text-body-sm text-pewter mx-4">Hoặc</p>
                </div>

                {/* Secondary Ghost Button */}
                <ButtonField variant="outline">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Đăng nhập với Google
                </ButtonField>

                <div className="mt-6 text-center text-body text-stone">
                    Chưa có tài khoản?{" "}
                    <Link
                        to="/register"
                        className="text-ember-orange-link font-medium hover:underline ml-1"
                    >
                        Đăng ký
                    </Link>
                </div>
                {message && <ErrorMessage
                    message={message}
                />}
            </form>
        </AuthLayout>
    );
};

export default Login;
