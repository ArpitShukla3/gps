import User from "../../schema/User.js";

const deleteTo = async (req, res) => {
    try {
        const userId = req.user._id;
        const { toId } = req.body;

        if (!toId) {
            return res.status(400).send({ error: 'toId is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (user.To.includes(toId)) {
            user.To = user.To.filter(id => id !== toId);
            await user.save();
        } else {
            return res.status(404).send({ error: 'toId not found in user\'s To list' });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};

export default deleteTo;