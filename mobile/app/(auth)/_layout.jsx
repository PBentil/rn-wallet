import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from "../../assets/styles/auth.styles";

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false, contentStyle: {backgroundColor: styles.backgroundColor} }} />
    </>
  );
}