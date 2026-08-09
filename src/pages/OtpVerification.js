import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ErrorMessage from '../components/ErrorMessage';
import ButtonField from '../components/ButtonField';

const OtpVerification = () => {
  const navigate = useNavigate();
  const { email } = useParams(); // Lấy email từ URL thay vì state

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("")
  const inputRefs = useRef([]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Cho phép xóa rỗng
    if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Chỉ cho phép chữ cái và số, tự động chuyển thành chữ hoa
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!alphanumericValue) return;

    const newOtp = [...otp];
    // Luôn lấy ký tự cuối cùng được nhập vào
    newOtp[index] = alphanumericValue.slice(-1); 
    setOtp(newOtp);

    // Tự động focus sang ô tiếp theo
    if (index < 5 && alphanumericValue) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '') {
        // Move focus to previous input on backspace if current is empty
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
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
    // Thay đổi regex để cho phép paste cả chữ và số, sau đó viết hoa
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

  const handleResend = async(e) => {
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(5 * 60);
    setIsExpired(false);
    inputRefs.current[0].focus();
    // Simulate API call for resend here
    e.preventDefault();
     

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/resend-otp",
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
                setMessage(data.message || "Gui lai otp that bai");
                return;
            }

            

        } catch (error) {
            setMessage("Không thể kết nối đến server");
        }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      setIsVerifying(true);
      setMessage(""); // Xóa lỗi cũ nếu có

      try {
        const response = await fetch(
            "http://localhost:8080/api/auth/verify-email",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // Backend yêu cầu VerifyOtpRequest bao gồm email và otp
                body: JSON.stringify({ email: email, otp: otpCode })
            }
        );

        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            setMessage(data.message || "Xác thực OTP thất bại");
            setIsVerifying(false); // Quan trọng: Phải tắt trạng thái loading
            return;
        }

        console.log("Xác thực thành công:", data);
        setIsVerifying(false);
        navigate("/");

      } catch (error) {
          console.error("Error:", error);
          setMessage("Không thể kết nối đến server");
          setIsVerifying(false); // Quan trọng: Phải tắt trạng thái loading nếu có lỗi mạng
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isComplete = otp.every((digit) => digit !== '');


  return (
    <AuthLayout
        title="Xác thực OTP"
        subtitle="Vui lòng nhập mã gồm 6 chữ số đã được gửi đến email của bạn."
    >
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col">
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
              disabled={isExpired || isVerifying}
              className="w-[48px] h-[56px] md:w-[60px] md:h-[64px] bg-canvas-white border border-paper rounded-xl text-carbon-black text-heading-sm font-semibold text-center transition-all outline-none focus:border-ember-orange focus:ring-1 focus:ring-ember-orange disabled:opacity-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 text-body-sm">
          <span className="text-stone">Mã sẽ hết hạn trong:</span>
          <span className={`font-semibold tabular-nums ${isExpired ? 'text-ember-orange' : 'text-graphite'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <ButtonField
            type="submit"
            disabled={!isComplete || isExpired || isVerifying}
        >
          {isVerifying ? "Đang xác thực..." : "Xác nhận"}
        </ButtonField>

        <div className="mt-6 text-center text-body">
          <span className="text-stone">Chưa nhận được mã? </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={!isExpired && timeLeft > 0}
            className="text-ember-orange-link font-medium hover:underline disabled:text-steel disabled:hover:no-underline disabled:cursor-not-allowed ml-1"
          >
            Gửi lại mã
          </button>
        </div>
        {message && <ErrorMessage
                    message={message}
                />}

        <div className="mt-4 text-center text-body">
          <span className="text-stone">Đã có tài khoản? </span>
          <Link to="/login" className="text-ember-orange-link font-medium hover:underline ml-1">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OtpVerification;
