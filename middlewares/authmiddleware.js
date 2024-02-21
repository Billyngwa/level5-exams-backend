const JsonWebTokenError = require("jsonwebtoken/lib/JsonWebTokenError");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");

const authChecker = {
    headerFxn: (req, res, next) => {
        const header = req.headers["authorisation"];
        if (!header) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'Auth headers not provided in the request.'
                }
            });
        }

        const token = header.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                error: {
                    message: 'No token provided'
                }
            });
        }

        let validToken;

        try {
             validToken = jwt.verify(token, process.env.JWTSECRET);
        }
        catch (error) {
            if(error instanceof JsonWebTokenError){
              return  res.status(401).json({
                    status:1,
                    message:"Invalid access"
                })
            }

            return res.status(401).end();
        }
        res.json(validToken);
        next();
    },
    checkUser: async (req, res, next) => {
        console.log("request query: ", req.query);
        if(!req.body.email){
            res.json({
                status:false,
                data:null,
                message:"No email provided"
            })
            return
        }
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            res.status(403).json({
                message: `Invalid Login credentials`
            })
            return
        }


        next();

    }
}

module.exports = authChecker;