import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../../assets/styles/create.styles';
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "../../constants/colors";

export default function AddTransactionScreen() {
    const router = useRouter();

    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [isIncomeSelected, setIsIncomeSelected] = useState(true);

    return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Transaction</Text>
                    <TouchableOpacity
                        style={styles.saveButtonContainer}
                        disabled={!amount}
                        onPress={() => console.log('Save')}
                    >
                        <Text
                            style={[
                                styles.saveButton,
                                !amount && styles.saveButtonDisabled,
                            ]}
                        >
                            Save
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.card}>

                {/* Card container */}
                <View style={styles.typeSelector}>
                    <TouchableOpacity style={[styles.typeButton, isIncomeSelected && styles.typeButtonActive]}>
                        <Ionicons
                            name="cash-outline"
                            size={24}
                            color={isIncomeSelected ? COLORS.white : COLORS.text}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, isIncomeSelected && styles.typeButtonTextActive]}>
                            Income
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.typeButton, !isIncomeSelected && styles.typeButtonActive]}>
                        <Ionicons
                            name="trending-down-outline"
                            size={24}
                            color={!isIncomeSelected ? COLORS.white : COLORS.text}
                            style={styles.typeIcon}
                        />
                        <Text style={[styles.typeButtonText, !isIncomeSelected && styles.typeButtonTextActive]}>
                            Expenses
                        </Text>
                    </TouchableOpacity>
                </View>

                    {/* Amount input */}
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

                    {/* Note input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Transaction title"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>
            </ScrollView>
    );
}
