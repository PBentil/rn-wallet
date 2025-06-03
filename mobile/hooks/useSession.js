import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load session from AsyncStorage when app starts
    useEffect(() => {
        const loadSession = async () => {
            try {
                const sessionData = await AsyncStorage.getItem("session");
                if (sessionData) {
                    setSession(JSON.parse(sessionData));
                }
            } catch (error) {
                console.error("Failed to load session:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    // Save session to AsyncStorage whenever it changes
    useEffect(() => {
        const saveSession = async () => {
            try {
                if (session) {
                    await AsyncStorage.setItem("session", JSON.stringify(session));
                } else {
                    await AsyncStorage.removeItem("session");
                }
            } catch (error) {
                console.error("Failed to save session:", error);
            }
        };

        saveSession();
    }, [session]);

    // Login function to set the session
    const login = (newSession) => {
        setSession(newSession);
    };

    // Logout function to clear the session
    const logout = () => {
        setSession(null);
    };

    if (loading) {
        // Optional: show a loading indicator while session is loading
        return null;
    }

    return (
        <SessionContext.Provider value={{ session, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
