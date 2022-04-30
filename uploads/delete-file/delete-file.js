let fs = require("fs")
let path = require("path")


const deleteFile = (files) => {
    let file_name = files ? files : ""

    file_name.images.forEach((image) => {
        let file_path = path.join(__dirname, "../", 'items-img/', image)
        fs.unlink(file_path, (err) => {
            if (err) throw err
            console.log("deleted files")
        })
    })
}

let oneDelete = (array) => {
    let files = array ? array : ""
    files.forEach((image) => {
        let file_path = path.join(__dirname, "../", 'items-img/', image)
        fs.unlink(file_path, (err) => {
            if (err) throw err
            console.log("deleted files")
        })
    })
}

module.exports = {
    deleteFile,
    oneDelete
}