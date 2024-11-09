export default function Signout(req, res) {
    try {
        res.cookie("token", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            expires: new Date(0),
        });
        res.status(200).send({ message: "Successfully signed out" });
    } catch (error) {
        res.status(500).send({ error: "Internal server error", message: error.message });
    }
}