import 'dotenv/config';

export default {
    expo: {
        name: "Money Tracker",
        slug: "money-tracker",
        version: "1.0.0",

        extra: {
            apiUrl: process.env.API_URL,
            eas: {
                projectId: "ce40dddd-57a6-455a-bacf-f48921aae891",
            },
        },

        scheme: "moneytracker",

        ios: {
            bundleIdentifier: "com.brentTech.moneytracker",
            scheme: "moneytracker",
        },

        android: {
            package: "com.brentTech.moneytracker",
            scheme: "moneytracker",
            intentFilters: [
                {
                    action: "VIEW",
                    data: [
                        {
                            scheme: "moneytracker",
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
