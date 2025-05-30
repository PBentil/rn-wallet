import {useCallback, useState} from "react";
import {fetch} from "expo/fetch";
import {Alert} from "react-native";

const API_URL = "http://localhost:3000/";
export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    })

    const getTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${user_id}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.log(error);
        }
    }, [user_id])


    const getSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/summary/${user_id}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.log(error);
        }
    }, [user_id])

//to hit both endpoints at once
    const loadData = useCallback(async () => {
        if (!user_id) return;
        setIsLoading(true);
        try {
            await Promise.all([getTransactions(), getSummary()]);
        } catch (error) {
            console.log("error loading data", error);
        } finally {
            setIsLoading(false);
        }
    }, [getTransactions, getSummary, user_id])


    const deleteTransaction = useCallback(async (user_id) => {
        try {
            const response = await fetch(`${API_URL}/api/transactions/${user_id}`, {method: "DELETE"});
            if (!response.ok) throw new Error("Transaction deletion failed");
            loadData();
            Alert.alert("success", "Transaction deleted successfully");
        } catch (error) {
            console.log(error);
            Alert.alert("error", error.message);
        }
    })
    return {transactions, isLoading, summary, loadData, deleteTransaction};
}