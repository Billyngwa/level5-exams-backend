const user = require("../models/user");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mailService = require("../services/mail");

const encryptPassword = (password) => {
    let hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest('hex');

}
const getDate = () => {
    let today = new Date();
    let time = today.getHours() + ":" + today.setMinutes(today.getMinutes() + 3) + ":" + today.getSeconds();
    let date = today.toUTCString().slice(0, 16);
    return {
        'time': time,
        'date': date
    }
}

const webTokenGen = (email, id) => {
    return jwt.sign(
        {
            email, id
        },
        process.env.JWTSECRET,
        {
            expiresIn: 120,

        }
    )
}

const validateUser = async (email) => {
    const userObject = await user.findOne({ email: email });
    if (!userObject) {
        return {
            status: 400,
            data: null,
            message: { message: "User not found", }
        }
    }
    return {
        status: 200,
        data: userObject,
        message: { message: "User exist" }
    }
}
const authentication = {
    register: async (req, res) => {
        //getting user inputs from request
        try {
            let { firstName, lastName, email, password } = req.body;

            console.log(`username: ${firstName}`);

            // check if all the data is present in the body else return a proper error message
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ success: false, message: "corrupted payload" });
            }

            password = encryptPassword(password);

            //CHECKING IF USER EXIST OR NOT
            const ted = await validateUser(email);
            if (ted.status === 200) {
                res.status(409).json(ted.message);
            } else {

                // creating a user in the database
                const created = await user.create({ firstName, lastName, email, password });

                //generating a webtoken for user
                const accessToken = { token: webTokenGen(email, created["_id"]) };

                res.status(201).json(accessToken);

                mailService.send(`${created.email}`, "Welcome to Basic Blog", `Hi ${created["firstName"]
                    },👋 you just joined our space pleased to see you with us 😊. Welcome on board.`);
            }

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })

        }




    },
    signIn: async (req, res) => {
        let { email, password } = req.body;

        try {
            if (!email || !password) {
                return res.status(400).json({ success: false, message: "corrupted payload" });

            }

            const ted = await validateUser(email);

            if (ted.data["password"] !== encryptPassword(password)) {
                res.status(400).json({ message: "Invalid Login" })
                return
            }

            const accessToken = { token: webTokenGen(email, ted.data["_id"]) };

            res.status(ted.status).json(accessToken);

        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })

        }


    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;
        try {
            if (!email) {
                return {
                    status: false,
                    message: "email required"
                };
            }
            const ted = await validateUser(email);

            if (ted.status === 400) return ted.message;
            const otp = Math.floor(1000 + Math.random() * 9000);

            const otpExpier = new Date();
            let expir = otpExpier.setMinutes(otpExpier.getMinutes() + 5);
            user.findOneAndUpdate(
                { email: email },
                { $set: { "otp": otp, "otpExpire": expir } },
                { returnNewDocument: true }
            ).then(updated => {

                console.log(updated);
                console.log(Date.now());

                mailService.send(updated.email, "Password Reset Token", `Here is your password reset token ${otp}`)
                
                res.status(200).json({
                    status: true,
                    message: "token sent"
                })
            })


        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })

        }


    },
    resetToken: async (req, res) => {
        let { password, confirmPassword, token } = req.body;
        try {


            if (!token) {
                return res.json({
                    status: false,
                    message: "No token Provided"
                })
            }
            if (password !== confirmPassword) {
                return res.json({
                    status: false,
                    message: "passwords do not match"
                })
            }

            const obj = await user.findOne({ otp: token });

            console.log(obj, typeof (Number(token)), Number(token), typeof (obj.otp), obj.otp);
            if (obj.otpExpire < Date.now()) {
                return res.json({
                    status: false,
                    message: "Token expired"
                })
            }

            if (obj.otp !== Number(token)) {
                return res.json({
                    status: false,
                    message: "Invalid Token"
                })
            }

            const updated = await user.findOneAndUpdate(
                { otp: token },
                { $set: { "password": encryptPassword(password) } },
                { returnNewDocument: true }
            )
            await mailService.send(updated.email, "Password Reset", `Dear User Your password has been resseted with success use it to login henceforth`)
            res.status(200).json({
                status: true,
                message: "Password resseted successfully"
            })
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message })

        }
    }
};

module.exports = authentication;
