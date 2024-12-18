import jwt from "jsonwebtoken"
import User from "../model/User.js"
import "dotenv/config.js"


export const auth = async(req,res, next) => {
  const token = req.cookies.jwt
  try {
    const {userId} = jwt.verify(token, process.env.SECRET )
    req.user = await User.findById(userId).select("_id");
    next()
  } catch(error) {
    return res.status(500).json({ message: "No token found" })
  }
}