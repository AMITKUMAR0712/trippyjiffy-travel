import React, { useState } from "react";
import axios from "axios";
import Style from "../Style/ForgetPassword.module.scss";
import { FaLock } from "react-icons/fa";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${baseURL}/api/users/forget-password`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!email) {
      setMessage("Please enter your email.");
      setIsSuccess(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(API_URL, { email });

      setMessage(res.data.message);
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      console.error("Frontend error:", err);
      setMessage(err.response?.data?.message || "Something went wrong.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Style.ForgotPassword}>
      <div className={Style.forgotcard}>
        <div className={Style.forgotcardDisk}>
          <FaLock className={Style.lockIcon} />
          <h2>Forgot Password?</h2>
        </div>
        <div className={Style.ForgotPasswordFlex}>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && (
              <p
                className={`${Style.forgotMessage} ${isSuccess ? Style.success : Style.error
                  }`}
              >
                {isSuccess ? (
                  <FaCheckCircle className={Style.messageIcon} />
                ) : (
                  <FaExclamationCircle className={Style.messageIcon} />
                )}
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={Style.ForgotPasswordButton}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
