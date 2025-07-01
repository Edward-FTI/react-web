import React from "react";
import { useNavigate } from "react-router-dom";
import { ResetPasswordByEmail } from "../Api/apiPembeli";

const ResetPassword = () => {
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const email = e.target.email.value.trim();

        if (!email) {
            alert("Email is required.");
            return;
        }

        try {
            const response = await ResetPasswordByEmail(email);

            if (response && response.message) {
                alert(response.message); // e.g., "Password reset successfully!"
                navigate("/login");
            } else {
                alert("Failed to reset password. Please try again.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            alert(error.message || "Failed to reset password.");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h1>Reset Password by Email</h1>
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    name="email"
                    placeholder="Masukkan Email"
                    required
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
