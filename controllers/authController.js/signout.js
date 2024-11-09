import { createCookieOptions } from "../../utils";

export default function Signout(req, res) {
    try {
        res.cookie("token", null,createCookieOptions);
        res.status(200).send({ message: "Successfully signed out" });
    } catch (error) {
        res.status(500).send({ error: "Internal server error", message: error.message });
    }
}