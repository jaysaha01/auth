require('dotenv').config()
const express = require('express')
var cors = require('cors')
const dbConnection = require("./app/config/db")
const app = express()
const port = process.env.PORT || 4001
const blogRouter = require("./app/routes/blog.route")
const adminRouter = require("./app/routes/admin.route")
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,               
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.send('Welcome to RBAC Auth Project...')
})

app.use("/api",blogRouter)
app.use("/api",adminRouter)

dbConnection().then(() => {
    app.listen(port, () => {
        console.log(`Server is running -  http://localhost:${port}`)
    })
}).catch((err) => {
    console.log(err)
})

