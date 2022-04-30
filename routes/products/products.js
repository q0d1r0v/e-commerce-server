const express = require('express')
const database = require('../../database/database')
const multer = require('multer')
const { deleteFile, oneDelete } = require("../../uploads/delete-file/delete-file")

const router = express()

const storage = multer.diskStorage({
    destination: (req, files, cb) => {
        if (req.files.length <= 10) {
            cb(null, './uploads/items-img')
        }
    },
    filename: (req, files, cb) => {
        cb(null, Date.now() + '-' + files.originalname)
    }
})

const upload = multer({ storage: storage })

router.post("/create", upload.array('images', 10), (req, res) => {
    let { product_name, product_type, product_additional, product_price } = req.body
    if (!req.files.length || product_name === "" || product_type === "" || product_additional === "" || product_price === "") {
        res.send(400, {
            message: "Iltimos ma'lumotlarni to'liq kiriting!"
        })
    } else {
        let file_name = []
        req.files.forEach(el => file_name.push(el.filename))
        database.query(`INSERT INTO products (product_name, product_price, product_type, product_additional , product_image_url ) VALUES ('${product_name}', '${product_price}',  '${product_type}', '${product_additional}', '${file_name}')`, (err, result) => {
            if (err) throw err
            res.send({ message: "Yangi tovar qo'shildi!" })
        })
    }
})

router.get('/get-all', (req, res) => {
    database.query('SELECT * from products', (err, result) => {
        if (err) {
            res.send(400, {
                message: "Ma'lumotlarni yuklab olishda xatolik yuz berdi!"
            })
        }
        let items = result.rows
        items.forEach(el => el.images = el.product_image_url.split(","))
        items.forEach(el => delete el.product_image_url)
        res.send(200, items)
    })
})

router.get("/search", (req, res) => {
    let msg = req.query.item
    if (msg) {
        database.query(`SELECT * FROM products WHERE product_name LIKE '%${msg}%'`, (err, result) => {
            if (err) throw err
            let items = result.rows
            items.forEach(el => el.images = el.product_image_url.split(","))
            items.forEach(el => delete el.product_image_url)
            res.send(200, items)
        })
    } else {
        database.query('SELECT * from products', (err, result) => {
            if (err) throw err
            let items = result.rows
            items.forEach(el => el.images = el.product_image_url.split(","))
            items.forEach(el => delete el.product_image_url)
            res.send(200, items)
        })
    }
})

router.put("/update", upload.array('images', 10), (req, res) => {
    let { item_id, product_price, product_name, product_type, product_additional } = req.body
    if (product_name === "" || product_type === "" || product_price === "" || product_additional === "") {
        res.send(400, {
            message: "Iltimos ma'lumotlarni to'liq kiriting!"
        })
    } else {
        database.query(`UPDATE products SET (product_name, product_price, product_type, product_additional) = ('${product_name}', '${product_price}', '${product_type}', '${product_additional}') WHERE id = ${item_id}`, (err, result) => {
            if (err) throw err
            res.send({ message: "Ushbu tovar yangilandi!" })
        })
    }
})


router.delete("/delete-one", (req, res) => {
    let item_id = req.query.item_id
    let files = req.query.images ? req.query.images : ''

    oneDelete(files)
    database.query(`DELETE FROM products WHERE id = ${item_id}`, (err, result) => {
        if (err) throw err
        res.send({ message: "Ushbu tovar muvoffaqiyatli o'chirildi!" })
    })
})

router.delete("/delete-many", (req, res) => {
    let items_id = req.query.items_id
    let items = req.query.items ? req.query.items : ""
    let images = []
    items.forEach(el => images = JSON.parse(el))

    deleteFile(images)

    database.query(`DELETE FROM products WHERE id IN (${items_id})`, (err, result) => {
        if (err) throw err
        res.send({ message: "Ushbu tovar muvoffaqiyatli o'chirildi!" })
    })
})

module.exports = router