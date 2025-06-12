import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = Constants.expoConfig.extra.apiUrl;
console.log(baseURL);

const API = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token before request
API.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const res = await axios.post(`${baseURL}/auth/refresh-token`, {
                    refreshToken,
                });

                const newToken = res.data.token;
                await AsyncStorage.setItem('token', newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return API(originalRequest);
            } catch (refreshError) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('refreshToken');
                console.warn('Session expired, please log in again');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;
