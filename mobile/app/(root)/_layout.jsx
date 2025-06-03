import { Redirect, Stack, usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        return null; // or loading spinner
    }

    // If user is NOT authenticated and NOT on public pages, redirect to sign-in
    if (!isAuthenticated) {
        return <Redirect href="/sign-in" />;
    }

    // If authenticated, render the protected stack
    return <Stack screenOptions={{ headerShown: false }} />;
}
