const UserModel = require("../model/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")

const signUp = async (req, res)=>{
    try{
        await UserModel.create(req.body)
        res.status(200).json({message: "signUp success"})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const login = async (req, res)=>{
    try{
        const {email, password} = req.body
        const user = await UserModel.findOne({email: email})

        if(!user)
            return res.status(404).json({message: "user not found"})

        const isLogin = bcrypt.compareSync(password, user.password)

        if(!isLogin)
            return res.status(401).json({message : "enter valid password"})

        const payload = {
            email: user.email,
            mobile: user.mobile,
            fullname: user.fullname,
            id: user._id
        }

        const token = await jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: "7d"})

        res.status(200).json({
            message: "login success",
            token: token
        })

    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const uploadImage = async (req, res)=>{
    try{
        const {filename} = req.file
        if(!filename)
            return res.status(404).json({message: "file not found"})
        const user = await UserModel.findByIdAndUpdate(req.user.id, {image: filename}, {new: true})
        if(!user)
            return res.status(401).json({message: "invalid request"})
        
        res.status(200).json({image: user.image})

    } catch(err) {
        res.status(500).json({message : err.message})
    }
}

const fetchImage = async (req, res)=>{
    try{
        const {image} = await UserModel.findById(req.user.id)
        if(!image)
            return res.status(404).end()
        const root = process.cwd()
        const file = path.join(root, 'files', image)
        res.sendFile(file, (err)=>{
            if(err){
                res.status(404).end()
            }
        })

    } catch(err) {
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    signUp,
    login,
    uploadImage,
    fetchImage
}