import { Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../constants/colors";

export const SignOutButton = ({ style }) => {
    const confirmSignOut = () => {
        Alert.alert(
            "Confirm Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            router.replace("/sign-in");
                        } catch (error) {
                            Alert.alert("Error", "Failed to sign out.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <TouchableOpacity onPress={confirmSignOut} style={style}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
    );
};
