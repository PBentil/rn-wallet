import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {useEffect, useState} from 'react';
import { styles } from '../../assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { register, resendOtp, verifyOtp } from "../../services /authServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const resetStates = () => {
        setEmailAddress('');
        setPassword('');
        setCode('');
        setPendingVerification(false);
        setError('');
        setIsLoading(false);
    };

    const onSignUpPress = async () => {
        setError('');
        const trimmedEmail = emailAddress.trim();
        const trimmedPassword = password.trim();


        if (!trimmedEmail && !trimmedPassword) {
            setError('Please enter your email and password.');
            return;
        }
        if (!trimmedEmail) {
            setError('Email is required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!trimmedPassword) {
            setError('Password is required.');
            return;
        }
        if (trimmedPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await register({
                email: trimmedEmail,
                password: trimmedPassword,
            });

            const message = response?.data?.message?.toLowerCase();

            if (message?.includes('verification')) {
                setPendingVerification(true);
                await AsyncStorage.setItem('email', trimmedEmail);
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(
                err?.response?.data?.message ||
                'Failed to register. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };


    const onVerifyPress = async () => {
        setError('');
        if (!code) {
            setError('Please enter the verification code.');
            return;
        }

        setIsLoading(true);

        try {
            const savedEmail = await AsyncStorage.getItem('email');

            if (!savedEmail) {
                setError('No email found for verification. Please sign up again.');
                setIsLoading(false);
                return;
            }

            const response = await verifyOtp(savedEmail.trim(), code.trim());

            if (response?.data?.message?.includes('OTP verified successfully')) {
                Alert.alert('Success', 'Email verified. You can now log in.');

                await AsyncStorage.removeItem('email');

                resetStates();
                router.replace('/sign-in');
            } else {
                setError('Verification failed. Please check the code and try again.');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(
                err?.response?.data?.message || 'Failed to verify OTP. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdown]);



    const onResendOtp = async () => {
        console.log('Trying to resend OTP...');

        if (countdown > 0) return;

        setError('');
        setIsLoading(true);

        try {
            const response = await resendOtp(emailAddress.trim());
            console.log('Resend OTP response:', response?.data);

            const message = response?.data?.message?.toLowerCase();

            if (message.includes('resent')) {
                Alert.alert('Success', 'Verification code resent to your email.');
                setCountdown(60);
            } else if (message.includes('already verified')) {
                setError('You are already verified. Please log in.');
            } else if (message.includes('wait') || message.includes('too many')) {
                setError('Please wait before requesting another OTP.');
            } else {
                setError('Failed to resend OTP. Please try again.');
            }

        } catch (err) {
            console.error('Resend OTP error:', err);
            const msg =
                err?.response?.data?.message || 'Failed to resend OTP. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };



    const renderErrorBox = () =>
        error ? (
            <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={24} color={COLORS.expense} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => setError('')}>
                    <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
            </View>
        ) : null;

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>
                {renderErrorBox()}
                <TextInput
                    value={code}
                    placeholder="Enter your verification code"
                    onChangeText={setCode}
                    style={[styles.verificationInput, error && styles.errorInput]}
                    keyboardType="numeric"
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={onVerifyPress} style={styles.button} disabled={isLoading}>
                    <Text style={styles.buttonText}>{isLoading ? 'Verifying...' : 'Verify'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onResendOtp} style={styles.button} disabled={isLoading}>
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Resending...' : 'Resend OTP'}
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image
                    style={styles.illustration}
                    source={require('../../assets/images/revenue-i2.png')}
                    contentFit="cover"
                />
                <Text style={styles.title}>Create an Account</Text>
                {renderErrorBox()}
                <TextInput
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={setEmailAddress}
                    style={[styles.input, error && styles.errorInput]}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
                <TextInput
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry
                    onChangeText={setPassword}
                    style={[styles.input, error && styles.errorInput]}
                    textContentType="password"
                />
                <TouchableOpacity onPress={onSignUpPress} style={styles.button} disabled={isLoading}>
                    <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
