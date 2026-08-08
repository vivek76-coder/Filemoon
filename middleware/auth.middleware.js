const jwt = require("jsonwebtoken")

const AuthMiddleware = async (req, res, next)=>{
    try{
        const { authorization } = req.headers
        if(!authorization)
            return res.status(401).json({message: "invalid credential"})

        const [type, token] = authorization.split(' ')

        if(type !== "Bearer")
            return res.status(401).json({message: "invalid credential"})

        const user = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    } catch(err) {
        res.status(401).json({message: err.message})
    }

}
module.exports = AuthMiddleware