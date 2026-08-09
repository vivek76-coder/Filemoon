const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
mongoose.connect(process.env.DB)

const root  = process.cwd()
const express = require("express")
const path = require("path")
const { v4:uniqueId } = require("uuid")
const cors = require("cors")

const { signUp, login } = require("./controller/user.controller")
const { createFile, fetchFile, deleteFile, downloadFile } = require("./controller/file.controller")
const { fetchDashboard } = require("./controller/dashboard.controller")
const { shareFile, fetchShared } = require("./controller/share.controller")
const AuthMiddleware = require("./middleware/auth.middleware")
const { verifyToken } = require("./controller/token.controller")

const multer = require("multer")
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

const upload = multer({
    storage: storage,
    limits: {fileSize : 200 * 1000 * 1000}
})

const app = express()
app.listen(process.env.PORT || 8080) 

app.use(express.static("view"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
    origin: "http://127.0.0.1:5500"
}))
// --------------UI_ENDPOINT-------------

const RoutePath = (filename)=>{
    return path.join(root, "view", filename)
}

app.get('/signup',(req, res)=>{
    res.sendFile(RoutePath("signup.html"))
})

app.get('/',(req, res)=>{
    res.sendFile(RoutePath("index.html"))
})

app.get('/login',(req, res)=>{
    res.sendFile(RoutePath("index.html"))
})

app.get('/dashboard',(req, res)=>{
    res.sendFile(RoutePath("app/dashboard.html"))
})

app.get('/files',(req, res)=>{
    res.sendFile(RoutePath("app/file.html"))
})

app.get('/history',(req, res)=>{
    res.sendFile(RoutePath("app/history.html"))
})

// -----------API_ENDPOINT--------------
app.post('/api/signup', signUp)
app.post('/api/login', login)
app.post('/api/files', AuthMiddleware, upload.single('file'), createFile)
app.post('/api/token/verify', verifyToken)
app.get('/api/file', AuthMiddleware, fetchFile)
app.delete("/api/file/:id", AuthMiddleware, deleteFile)
app.get('/api/file/download/:id', downloadFile)
app.get('/api/dashboard', AuthMiddleware, fetchDashboard)
app.post('/api/share', AuthMiddleware, shareFile)
app.get('/api/share', AuthMiddleware, fetchShared)



// not found page
app.use((req, res)=>{
    res.status(404).json({message: "Endpoint not found"})
})