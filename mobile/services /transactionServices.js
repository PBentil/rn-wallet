import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "./api";

async function getToken() {
    return await AsyncStorage.getItem('token');
}

async function getHeaders() {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function fetchTransactions(user_id) {
    try {
        const headers = await getHeaders();
        const response = await api.get(`/transactions/${user_id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
    }
}

export async function fetchSummary(user_id) {
    try {
        const headers = await getHeaders();
        const response = await api.get(`/transactions/summary/${user_id}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching summary:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch summary');
    }
}

export async function deleteTransactionApi(transactionId) {
    try {
        const headers = await getHeaders();
        const response = await api.delete(`/transactions/${transactionId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error deleting transaction:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to delete transaction');
    }
}

export async function addTransactionApi(transaction) {
    try {
        const headers = await getHeaders();
        const response = await api.post(`/transactions`, transaction, { headers });

        // Now backend returns { success, message, data }
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to add transaction');
        }

        // Return the actual transaction data
        return response.data.data;
    } catch (error) {
        console.error('Error in addTransactionApi:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to add transaction');
    }
}

