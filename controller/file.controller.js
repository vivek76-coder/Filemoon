const FileModel = require("../model/file.model");
const fs = require("fs")

const createFile = async (req, res)=>{
    try{
        const file = req.file
        const payload = {
            filename: file.filename,
            path: (file.destination+file.filename),
            type: file.mimetype.split("/")[0],
            size: file.size
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
        const file = await FileModel.find()
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

module.exports = {
    createFile,
    fetchFile,
    deleteFile
}