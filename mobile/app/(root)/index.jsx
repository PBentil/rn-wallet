import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert, TouchableOpacity,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { styles } from "../../assets/styles/home.styles";
import useTransactions from "../../hooks/useTrannsactions";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import { SignOutButton } from "../../components/SignOutButton";
import {router} from "expo-router";


export default function Page({ user_id }) {
    const [refreshing, setRefreshing] = useState(false);
    const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user_id);

    useEffect(() => {
        if (user_id) {
            loadData();
        }
    }, [loadData, user_id]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadData();
        } catch (error) {
            Alert.alert("Error", "Failed to refresh data.");
        } finally {
            setRefreshing(false);
        }
    };

    if (isLoading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                <View style={styles.header}>
                    <Image style={styles.headerLogo} source={require('../../assets/images/logo.png')} />
                    <Text style={styles.headerTitle}>
                        <Text style={styles.headerLeft}>Hi, </Text>
                        Bentil
                    </Text>

                    <TouchableOpacity style={styles.addButton} onPress={()=> router.push('/AddTransactions')}>
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

                {/* Transactions List */}
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <FlatList
                    data={transactions}
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
                                                color: item.amount > 0 ? "green" : "red",
                                            },
                                        ]}
                                    >
                                        {item.amount > 0 ? "+" : "-"} GH₵ {Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={styles.transactionRight}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTransaction(item.id)}>
                                        <Ionicons name="trash-outline" size={24} color={COLORS.textLight} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateTitle}>No transactions yet</Text>
                            <Text style={styles.emptyStateText}>
                                Start by adding a transaction using the "+" button.
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
}
