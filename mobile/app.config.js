import 'dotenv/config';

export default {
    expo: {
        name: "Money Tracker",
        slug: "money-tracker",
        version: "1.0.0",
        extra: {
            apiUrl: process.env.API_URL,
        },

        // General scheme for all platforms (optional if you specify platform-specific)
        scheme: "moneytracker",

        ios: {
            bundleIdentifier: "com.brentTech.moneytracker",
            scheme: "moneytracker",  // iOS deep link scheme
        },

        android: {
            package: "com.brentTech.moneytracker",
            scheme: "moneytracker",  // Android deep link scheme
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

        web: {
            // No scheme here; web uses URLs normally
        },
    },
};
