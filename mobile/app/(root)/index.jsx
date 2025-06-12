import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { SignOutButton } from "../../components/SignOutButton";
import { router } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    fetchTransactions,
    fetchSummary,
    deleteTransactionApi,
} from "../../services /transactionServices";


export default function Page() {
    const [refreshing, setRefreshing] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    // Load user info
    const loadUserData = useCallback(async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('user');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                setUserId(userData.id);
                setUserName(userData.email.split('@')[0]);
                console.log(userData);
                console.log(userData.id);
            }
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    }, []);

    // Load transactions and summary
    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const [fetchedTransactions, fetchedSummary] = await Promise.all([
                fetchTransactions(userId),
                fetchSummary(userId),
            ]);
            setTransactions(fetchedTransactions);
            setSummary(fetchedSummary);
        } catch (error) {
            console.error("Error loading data:", error);
            Alert.alert("Error", "Failed to load transactions.");
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            console.log('📱 Screen focused - refreshing data...');
            const refreshOnFocus = async () => {
                await loadUserData();
                if (userId) {
                    await loadData();
                }
            };
            refreshOnFocus();
        }, [loadUserData, loadData, userId])
    );

    const getFilteredTransactions = () => {
        switch (activeTab) {
            case 'income':
                return transactions.filter(transaction => transaction.type === 'income');
            case 'expenses':
                return transactions.filter(transaction => transaction.type === 'expense');
            default:
                return transactions;
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this transaction?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteTransactionApi(transactionId);
                            await loadData();
                            Alert.alert("Success", "Transaction deleted successfully");
                        } catch (error) {
                            console.error("Delete error:", error);
                            Alert.alert("Error", error.message || "Failed to delete transaction");
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadData();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh data.");
        } finally {
            setRefreshing(false);
        }
    }, [loadData]);

    // Initial load on component mount
    useEffect(() => {
        loadUserData();
    }, []);

    // Load data when userId changes
    useEffect(() => {
        if (userId) {
            loadData();
        }
    }, [userId, loadData]);

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const filteredTransactions = getFilteredTransactions();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image style={styles.headerLogo} source={require('../../assets/images/logo.png')} />
                    <Text style={styles.headerTitle}>
                        <Text style={styles.headerLeft}>Hi, </Text>
                        {userName || 'User'}
                    </Text>

                    <TouchableOpacity style={styles.addButton} onPress={() => router.push('/AddTransactions')}>
                        <Text style={styles.addButtonText}>
                            <Ionicons name="add" size={15} /> Add
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton}>
                        <SignOutButton />
                    </TouchableOpacity>
                </View>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceTitle}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>
                        GH₵ {summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>

                    <View style={styles.balanceStats}>
                        <View style={styles.balanceStatItem}>
                            <Text style={styles.balanceStatLabel}>Income</Text>
                            <Text style={[styles.balanceStatAmount, { color: "green" }]}>
                                + GH₵ {summary.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                        <View style={[styles.balanceStatItem, styles.statDivider]}>
                            <Text style={styles.balanceStatLabel}>Expenses</Text>
                            <Text style={[styles.balanceStatAmount, { color: "red" }]}>
                                - GH₵ {summary.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Transaction Filter Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
                        onPress={() => setActiveTab('all')}
                    >
                        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'income' && styles.activeTab]}
                        onPress={() => setActiveTab('income')}
                    >
                        <Text style={[styles.tabText, activeTab === 'income' && styles.activeTabText]}>
                            Income
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'expenses' && styles.activeTab]}
                        onPress={() => setActiveTab('expenses')}
                    >
                        <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
                            Expenses
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions List */}
                <Text style={styles.sectionTitle}>
                    {activeTab === 'all' ? 'Recent Transactions' :
                        activeTab === 'income' ? 'Income Transactions' : 'Expense Transactions'}
                </Text>
                <FlatList
                    data={filteredTransactions}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.transactionsListContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderItem={({ item }) => (
                        <View style={styles.transactionCard}>
                            <View style={styles.transactionContent}>
                                <View style={styles.categoryIconContainer}>
                                    <Text>📄</Text>
                                </View>
                                <View style={styles.transactionLeft}>
                                    <Text style={styles.transactionTitle}>{item.title}</Text>
                                    <Text style={styles.transactionCategory}>{item.category}</Text>
                                </View>
                                <View style={styles.transactionRight}>
                                    <Text
                                        style={[
                                            styles.transactionAmount,
                                            {
                                                color: item.type === 'income' ? "green" : "red",

                                            },
                                        ]}
                                    >
                                        {item.type === "income" ? "+" : "-"} GH₵ {Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.transactionRight}>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteTransaction(item.id)}
                                    >
                                        <Ionicons name="trash-outline" size={24} color={COLORS.textLight} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateTitle}>
                                {activeTab === 'all' ? 'No transactions yet' :
                                    activeTab === 'income' ? 'No income transactions' : 'No expense transactions'}
                            </Text>
                            <Text style={styles.emptyStateText}>
                                {activeTab === 'all' ? 'Start by adding a transaction using the "+" button.' :
                                    activeTab === 'income' ? 'Add some income transactions to see them here.' :
                                        'Add some expense transactions to see them here.'}
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}