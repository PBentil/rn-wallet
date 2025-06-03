import api from "./api";

export const login = async (email, password) => {
    return api.post("/auth/login", { email, password });
};

export const register = async (data) => {
    return api.post("/auth/register", data);
};

export const resendOtp = async (email) => {
    return api.post("/auth/resend-otp", { email });
};

export const verifyOtp = async (email, otp) => {
    return api.post("/auth/verify-otp", { email, otp });
};
