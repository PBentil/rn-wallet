import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useState} from 'react'
import {styles} from "../../assets/styles/auth.styles";
import {Image} from "expo-image";
import {COLORS} from "../../constants/colors";
import {Ionicons} from "@expo/vector-icons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            if(err.errors?.[0]?.code === "form_password_incorrect"){
                setError("Password is incorrect. Please try again.");
            }else {
                setError("An error occurred. Please try again");
            }
            console.error(JSON.stringify(err, null, 2))

        }
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraHeight={100}
        >
        <View style={styles.container}>
            <Image style={styles.illustration} source={require('../../assets/images/revenue-i4.png')} />
            <Text style={styles.title}>Welcome Back</Text>
            {error? (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={24} color={COLORS.expense} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError(null)}>
                        <Ionicons name="close" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>
            ): null}
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={[styles.input , error &&  styles.errorInput]}
            />
            <TextInput
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={[styles.input , error &&  styles.errorInput]}
            />
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/(auth)/sign-up" asChild>
                    <TouchableOpacity >
                        <Text style={styles.linkText}>Sign up</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
        </KeyboardAwareScrollView>
    )
}