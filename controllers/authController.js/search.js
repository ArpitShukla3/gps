import User from "../../schema/User.js";

export const searchUsersByEmail = async (req, res) => {
    try {
        const email = req.query.search;
        if (!email) {
            return res.status(400).json({ message: "Email query parameter is required" });
        }
        const regex = new RegExp(email, 'i'); // 'i' makes it case insensitive
        const users = await User.find({ email: { $regex: regex } }).select('name email');

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: "Server error", error });
    }
};