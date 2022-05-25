const bcrypt = require("bcryptjs");

const User = require('../models/userModel');

exports.signUp = async (req, res, next) => {
    const {username, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    try {
        const newUser = await User.create({
            username,
            password: hashPassword
        });

        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error,
        })
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body;
    try {

        const user = await User.findOne({username});

        if(!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            });
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if(isCorrect) {
            res.status(200).json({
                status: 'success',
            })
        } else {
            res.status(403).json({
                status: 'fail',
                message: 'incorrect password'
            })
        }

    } catch (error) {
        res.status(500).json({
            status: "fail",
            error,
        })
    }
}