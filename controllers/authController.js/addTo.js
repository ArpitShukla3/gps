import User from "../../schema/User.js";
const addTo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { toId } = req.body;

    if (!toId) {
      return res.status(400).send({ error: "toId is required" });
    }

    const user = await User.findById(userId);
    const otherUser = await User.findById(toId);
    if (!otherUser) {
      return res.status(404).send({ error: "User not found" });
    }
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if(user._id.toString() === toId) {
      return res.status(400).send({ error: "You cannot add yourself" });
    }
    if(otherUser.From.includes(user._id)) {
      return res.status(400).send({ error: "User already in your To list" });
    }
    else{
        otherUser.From.push(user._id);
        await otherUser.save();
    }
    if (!user.To.includes(toId)) {
      user.To.push(toId);
      await user.save();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ error: "Internal server error" });
  }
};

export default addTo;
