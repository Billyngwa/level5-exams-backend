const user = require("../models/user");
const userFxn = {
    getAllUsers:  (req,res) => {
        user.find({})
        .then(user => {
            res.status(200).json(
                {
                    status:true,
                    data:user
                }
            );
        }).catch(error =>{
            const err = "error loading data"
            res.status(500).json(
                {
                    status:false,
                    data:err
                }
            );
        })
    },
    getUserById:  (req,res) => {
        const userId = req.params.id;
        
        user.findById(userId)
        .then(foundUser => {
            if(!foundUser){
             return   res.status(401).json({
                    User:"user not found"
                })
            }
            res.json({
                User:foundUser.firstName
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occured while retrieving Product with id " + id
            })
        })
    },

    deleteAllUsers: (req,res) => {
        user.deleteMany({})
        .then(sample =>{
            return res.sendStatus(sample.deletedCount)
        }).catch(err =>{
            res.status(500).json({
                message: err.message || "Error occured while retrieving Product with id " + id
            })
        })
    },
    deleteUserById: (req,res) => {
        const id = req.params.id
        user.findByIdAndDelete(id)
        .then(sample =>{
            return res.status(200).json({message:`${sample.firstName} deleted with success`})
        }).catch(err =>{
            res.status(500).send({
                message: err.message || "Error occured while retrieving Product with id " + id
            })
        })
    }
}

module.exports = userFxn;