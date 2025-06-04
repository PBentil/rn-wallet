import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = process.env.API_URL;

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
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/transactions/${user_id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
}

export async function fetchSummary(user_id) {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/transactions/summary/${user_id}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
}

export async function deleteTransactionApi(transactionId) {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/transactions/${transactionId}`, { method: 'DELETE', headers });
    if (!response.ok) throw new Error('Failed to delete transaction');
    return true;
}

export async function addTransactionApi(transaction) {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
    }
    return response.json();
}