export default async function GAuth(req, res) {
    try {
        const GOOGLE_OAUTH_SCOPES = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ];
        const state = "some_state"; // You can replace it with a dynamically generated state
        const scopes = encodeURIComponent(GOOGLE_OAUTH_SCOPES.join(" "));

        const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URL)}&access_type=offline&response_type=code&state=${encodeURIComponent(state)}&scope=${scopes}`;
        res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
    } catch (error) {
        console.error("Error generating Google OAuth URL:", error);
        res.status(500).json({ error: error.message });
    }
}
