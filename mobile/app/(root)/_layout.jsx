import {useUser} from "@clerk/clerk-expo";
import {Redirect} from "expo-router";
import {Stack} from "expo-router";


export default function Layout() {
    const {isSignIn} = useUser();

    if (!isSignIn) return <Redirect href={'/sign-in'} />

    return <Stack screenOptions={{headerShown: false}} />

}