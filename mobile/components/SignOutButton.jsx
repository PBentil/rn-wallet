import {Alert, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons} from "@expo/vector-icons";
import {router, useNavigation} from "expo-router";
import {COLORS} from "../constants/colors";

export const SignOutButton = ({ style }) => {
    const navigation = useNavigation();

    const signOut = async () => {
        try {
            await AsyncStorage.clear(); // or remove only specific keys
            router.replace('/sign-in');
        } catch (error) {
            Alert.alert("Error", "Failed to sign out.");
        }
    };

    return (
        <TouchableOpacity onPress={signOut} style={style}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
    );
};
