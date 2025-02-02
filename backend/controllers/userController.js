import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                message: "User does not exists",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({
                message: "Incorrect password",
                success: false
            })
        }
        const token = createToken(user._id);
        res.json({
            success: true,
            message: "Log in successfully",
            token
        })
    } catch (error) {
        console.log(error);

    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// register user

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {

        // checking is user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({
                success: false,
                message: "User already exists"
            })
        }
        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter valid email"
            })
        }

        // if (password.length < 8) {
        //     return res.json({
        //         success: false,
        //         message: "Please enter strong password"
        //     })
        // }

        // hashing user password
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
        })

        const user = await newUser.save();
        const token = createToken(user._id)
        res.json({
            success: true,
            message: "You registered successfully",
            token
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error"
        })

    }
}


export { loginUser, registerUser }