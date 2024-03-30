import express from "express"
import colors from "colors"
import dotenv from "dotenv"
import morgan from "morgan"
import authRoute from "./routes/authRoute.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import connectDB from "./config/db.js"
import path from "path"
import cors from "cors"

const app=express()

const PORT=process.env.PORT || 8080

dotenv.config()

connectDB()

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,"./client/build")))
app.use(express.json());
app.use(cors())

app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoutes)
console.log("Shs")
app.use("/api/v1/product", productRoutes);


app.use("*",function(req,res) {
    res.sendFile(path.join(__dirname),"./client/build/index.html")
})

app.get("/", (req,res) => {
    res.send(`<h1>Welcome to ecommerce App</h1>`)
})
app.listen(PORT,() => {
    console.log(`SERVER RUNNING ON PORT12 ${PORT}`.bgCyan.white)
})