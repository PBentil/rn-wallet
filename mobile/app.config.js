import 'dotenv/config';


export default {
    expo: {
        name: "FinTrack",
        slug: "Finance-tracker",
        version: "1.0.0",
        icon: "./assets/images/logo.png",
        adaptiveIcon: {
            foregroundImage: "./assets/images/logo.png",
            backgroundColor: "#ffffff"
        },

        backgroundColor:"#FFF8F3",
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#FFF8F3",
        },

        extra: {
            apiUrl: process.env.API_URL,
            eas: {
                projectId: "ce40dddd-57a6-455a-bacf-f48921aae891",
            },
        },

        scheme: "FinTrack",

        ios: {
            bundleIdentifier: "com.brentTech.FinTrack",
            scheme: "FinTrack",
            statusBar: {
                style: "light",
                hidden: false
            },
            infoPlist: {
                UIViewControllerBasedStatusBarAppearance: false,
                UIStatusBarHidden: false,
                UIStatusBarStyle: "UIStatusBarStyleLightContent"
            }
        },

        android: {
            package: "com.brentTech.FinTrack",
            scheme: "FinTrack",

            statusBar: {
                translucent: true,
                backgroundColor: "transparent"
            },
            navigationBar: {
                visible: "leanback"
            },
            intentFilters: [
                {
                    action: "VIEW",
                    data: [
                        {
                            scheme: "FinTrack",
                            host: "app",
                            pathPrefix: "/",
                        },
                    ],
                    category: ["BROWSABLE", "DEFAULT"],
                },
            ],
        },

        web: {},
    },
};