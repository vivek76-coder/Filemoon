const FileModel = require("../model/file.model");
const fs = require("fs")
const path = require("path");

const getFileType = (type)=>{
    const ext = type.split("/").pop()
    if(ext === 'x-msdownload')
        return "application/exe"
    return type
} 
const createFile = async (req, res)=>{
    try{
        const { filename } = req.body
        const file = req.file
        const payload = {
            user: req.user.id,
            filename: filename,
            path: (file.destination+file.filename),
            type: getFileType(file.mimetype),
            size: file.size,
        }
        const newFile = await FileModel.create(payload)
        res.status(200).json(newFile)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const fetchFile = async (req, res)=>{
    try{
        const {limit} = req.query
        const file = await FileModel.find({user: req.user.id}).sort({createdAt: -1}).limit(limit)
        res.status(200).json(file)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const deleteFile = async (req, res)=>{
    try{
        const {id} = req.params
        const file = await FileModel.findByIdAndDelete(id)

        if(!file)
            return res.status(200).json({message: "file not found"})

        fs.unlinkSync(file.path)
        res.status(200).json(file)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const downloadFile = async (req, res)=>{
    const {id} = req.params
    const file = await FileModel.findById(id)

    if(!file)
        return res.status(404).json({message: "file not found"})
    const ext = file.type.split("/").pop()
    const root = process.cwd()
    const filePath = path.join(root, file.path)

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}.${ext}"`)

    res.sendFile(filePath, (err)=>{
        if(err)
            res.status(404).json({message: "file not found"})
    })
}
module.exports = {
    createFile,
    fetchFile,
    deleteFile,
    downloadFile
}