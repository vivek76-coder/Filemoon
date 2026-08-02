const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB)

const express = require("express")
const { v4:uniqueId } = require("uuid")
const cors = require("cors")
const { signUp, login } = require("./controller/user.controller")
const { createFile, fetchFile, deleteFile, downloadFile } = require("./controller/file.controller")
const { fetchDashboard } = require("./controller/dashboard.controller")
const multer = require("multer")
const { verifyToken } = require("./controller/token.controller")

const storage = multer.diskStorage({
    destination: (req, file, next)=>{
        next(null, 'files/')
    },
    filename: (req, file, next)=>{
        const nameArr = file.originalname.split(".")
        const ext = nameArr.pop()
        const name = `${uniqueId()}.${ext}`
        next(null, name)
    }
})
const upload = multer({storage: storage})
const app = express()
app.listen(process.env.PORT || 8080) 

app.use(express.static("view"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: "http://127.0.0.1:5500"
}))

app.post('/signup', signUp)
app.post('/login', login)
app.post('/file', upload.single('file'), createFile)
app.post('/token/verify', verifyToken)
app.get('/file', fetchFile)
app.delete("/file/:id", deleteFile)
app.get('/file/download/:id', downloadFile)
app.get('/dashboard', fetchDashboard)
