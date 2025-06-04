import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../assets/styles/create.styles';
import { COLORS } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTransactionApi } from '../../services /transactionServices';

const incomeCategories = [
    { key: 'income', icon: 'wallet', label: 'Income' },
    { key: 'salary', icon: 'cash', label: 'Salary' },
    { key: 'bonus', icon: 'gift', label: 'Bonus' },
    { key: 'investment', icon: 'trending-up', label: 'Investment' },
];

const expenseCategories = [
    { key: 'food', icon: 'pizza', label: 'Food & Drinks' },
    { key: 'shopping', icon: 'cart', label: 'Shopping' },
    { key: 'transport', icon: 'bus', label: 'Transportation' },
    { key: 'entertainment', icon: 'musical-note', label: 'Entertainment' },
    { key: 'bills', icon: 'cash', label: 'Bills' },
    { key: 'others', icon: 'options', label: 'Others' },
];

export default function AddTransactionScreen() {
    const router = useRouter();

    const [userId, setUserId] = useState(null);
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [isIncomeSelected, setIsIncomeSelected] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = isIncomeSelected ? incomeCategories : expenseCategories;

    useEffect(() => {
        const debugUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            console.log('User from AsyncStorage:', userData);
        };
        debugUser();
    }, []);

    const handleSave = async () => {
        if (!amount || !title || !selectedCategory) {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }

        if (!userId) {
            Alert.alert('Error', 'User not found. Please log in again.');
            return;
        }

        setIsSubmitting(true);

        const newTransaction = {
            user_id: userId,
            title,
            amount: parseFloat(amount),
            type: isIncomeSelected ? 'Income' : 'Expense',
            category: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1),
        };

        try {
            await addTransactionApi(newTransaction);
            Alert.alert('Success', 'Transaction added successfully');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Add Transaction</Text>

                <TouchableOpacity
                    style={styles.saveButtonContainer}
                    disabled={!amount || !title || !selectedCategory || isSubmitting}
                    onPress={handleSave}
                >
                    <Text
                        style={[
                            styles.saveButton,
                            (!amount || !title || !selectedCategory || isSubmitting) && styles.saveButtonDisabled,
                        ]}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                {/* Income / Expense Switch */}
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, isIncomeSelected && styles.typeButtonActive]}
                        onPress={() => {
                            setIsIncomeSelected(true);
                            setSelectedCategory('');
                        }}
                    >
                        <Ionicons
                            name="cash-outline"
                            size={24}
                            color={isIncomeSelected ? COLORS.white : COLORS.text}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[
                                styles.typeButtonText,
                                isIncomeSelected && styles.typeButtonTextActive,
                            ]}
                        >
                            Income
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.typeButton, !isIncomeSelected && styles.typeButtonActive]}
                        onPress={() => {
                            setIsIncomeSelected(false);
                            setSelectedCategory('');
                        }}
                    >
                        <Ionicons
                            name="trending-down-outline"
                            size={24}
                            color={!isIncomeSelected ? COLORS.white : COLORS.text}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[
                                styles.typeButtonText,
                                !isIncomeSelected && styles.typeButtonTextActive,
                            ]}
                        >
                            Expenses
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₵</Text>
                    <TextInput
                        style={styles.amountInput}
                        keyboardType="numeric"
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Title Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Transaction title"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Category Section */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name="pricetags" size={15} color="#000" /> Category
                </Text>

                <View style={styles.categoryGrid}>
                    {categories.map(({ key, icon, label }) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.categoryButton,
                                selectedCategory === key && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(key)}
                        >
                            <Text
                                style={[
                                    styles.categoryButtonText,
                                    selectedCategory === key && styles.categoryButtonTextActive,
                                ]}
                            >
                                <Ionicons name={icon} style={styles.categoryIcon} /> {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
