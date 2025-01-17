import User from "../../schema/User.js";

export default async function GAuthCallback(req, res) {
    try {
        const { code } = req.body;
        const data = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URL,
            grant_type: "authorization_code",
        };
        console.log(data);
        const response = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
            method: "POST",
            body: JSON.stringify(data),
        });
        const access_token_data = await response.json();
        const { id_token } = access_token_data;
        console.log(id_token);
        const token_info_response = await fetch(
          `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
        );
        const token_info_data = await token_info_response.json();
        const { email, name } = token_info_data;
        let user = await User.findOne({ email }).select("-password");
        if (!user) {
          user = await User.create({ email, name});
        }
        res.status(201).send({
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              authToken: user._id,
            },
          });
        
    } catch (error) {
        console.error("Error generating Google OAuth URL:", error);
        res.status(500).json({ error: error.message });
        
    }
}

