import User from '../../schema/User.js'
export default async function fetchUserDetails(req,res) {
    try {
        // console.log(req.user)
        const user = await User.findById(req.user._id)
            .select('-Password')
            .populate('To')
            .populate('From')
            // .select('-Password -To -From')
        req.user = user;
        res.status(200).send(req.user);
    } catch (error) {
       return res.status(400).send({error: "Internal server error"})
    }
}
