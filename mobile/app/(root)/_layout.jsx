import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { styles } from "../../assets/styles/auth.styles";


export default function ProtectedLayout() {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Redirect href="/sign-in" />;
    }

    return (
        <>
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <Stack screenOptions={{ headerShown: false, contentStyle: {backgroundColor:styles.backgroundColor} }} />
        </>
    );
}