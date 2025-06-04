import { useCallback, useState } from "react";
import { Alert } from "react-native";
import {
    fetchTransactions,
    fetchSummary,
    deleteTransactionApi,
    addTransactionApi
} from "../services /transactionServices";

export default function useTransactions(user_id) {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        if (!user_id) return;
        setIsLoading(true);
        try {
            const [transactionsData, summaryData] = await Promise.all([
                fetchTransactions(user_id),
                fetchSummary(user_id),
            ]);
            setTransactions(transactionsData);
            setSummary(summaryData);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [user_id]);

    const deleteTransaction = useCallback(async (transactionId) => {
        try {
            await deleteTransactionApi(transactionId);
            Alert.alert("Success", "Transaction deleted successfully");
            await loadData();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message);
        }
    }, [loadData]);



    // New: Add transaction function
    const addTransaction = useCallback(
        async (transactionData) => {
            try {
                await addTransactionApi(transactionData);
                Alert.alert("Success", "Transaction added successfully");
                await loadData();
            } catch (error) {
                console.log(error);
                Alert.alert("Error", error.message);
            }
        },
        [loadData]
    );


    return { transactions, summary, isLoading, loadData, deleteTransaction, addTransaction };
}
