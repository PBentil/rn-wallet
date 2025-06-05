import { Link, useRouter } from 'expo-router'
import {Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert} from 'react-native'
import React, { useState } from 'react'
import { styles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from "../../services /authServices";





export default function SignIn() {
    const router = useRouter()


    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const onSignInPress = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await login(emailAddress.trim(), password.trim());
            const token = response.data.token;
            const user = response.data.user;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            Alert.alert("Success", "Login successful");
            router.replace('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("Something went wrong. Please try again later.");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraHeight={100}
        >
            <View style={styles.container}>
                <Image style={styles.illustration} source={require('../../assets/images/revenue-i4.png')} />
                <Text style={styles.title}>Welcome Back</Text>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={24} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name="close" size={24} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}

                <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={setEmailAddress}
                    style={[styles.input, error && styles.errorInput]}
                />
                <TextInput
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    style={[styles.input, error && styles.errorInput]}
                />

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={onSignInPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Link href="/sign-up" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
