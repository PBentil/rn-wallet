import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { styles } from '../../assets/styles/auth.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {register, resendOtp, verifyOtp} from "../../services /authServices";

export default function SignUpScreen() {
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle registration
    const onSignUpPress = async () => {
        setError('');
        if (!emailAddress || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await register({
                email: emailAddress.trim(),
                password: password.trim(),
            });
            if (response?.data?.message === 'Verification code sent') {
                // Show verification screen
                setPendingVerification(true);
            } else {
                // If no OTP needed, redirect or show success
                Alert.alert('Registration Successful', 'You can now log in.');
                router.replace('/login');
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Failed to register. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const onVerifyPress = async () => {
        setError('');
        if (!code) {
            setError('Please enter the verification code.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await verifyOtp(emailAddress.trim(), code.trim());
            if (response?.data?.message === 'OTP verified successfully') {
                Alert.alert('Verification successful', 'You can now log in.');
                router.replace('/login');
            } else {
                setError('Verification failed. Please check the code and try again.');
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Failed to verify OTP. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Resend OTP handler
    const onResendOtp = async () => {
        setError('');
        setIsLoading(true);
        try {
            const response = await resendOtp(emailAddress.trim());
            if (response?.data?.message === 'OTP resent successfully') {
                Alert.alert('Success', 'Verification code resent to your email.');
            } else {
                setError('Failed to resend OTP. Please try again later.');
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || 'Failed to resend OTP. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>
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
                <TouchableOpacity onPress={onResendOtp} style={{ marginTop: 12 }}>
                    <Text style={[styles.linkText, { textAlign: 'center' }]}>Resend Code</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image
                    style={styles.illustration}
                    source={require('../../assets/images/revenue-i2.png')}
                />
                <Text style={styles.title}>Create an Account</Text>
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
                    keyboardType="email-address"
                    textContentType="emailAddress"
                />
                <TextInput
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
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
