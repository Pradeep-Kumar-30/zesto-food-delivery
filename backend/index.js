import express from "express"
import dotenv from "dotenv"

dotenv.config({ override: true })

import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"

import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"
import { parseAllowedOrigins } from "./utils/corsOrigins.js"

const app=express()
const server=http.createServer(app)

const allowedOrigins = parseAllowedOrigins()

const corsOriginCallback = (origin, callback) => {
  if (!origin) return callback(null, true)
  if (allowedOrigins.includes(origin)) return callback(null, true)
  return callback(null, false)
}

const io=new Server(server,{
   cors:{
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials:true,
    methods:['POST','GET']
}
})

app.set("io",io)



const port=process.env.PORT || 5000
app.use(cors({
    origin: corsOriginCallback,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)

socketHandler(io)
server.listen(port, async () => {
  try {
    await connectDb()
    console.log(`server started at ${port}`)
    console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`)
  } catch (err) {
    console.error("Failed to start:", err.message || err)
    process.exit(1)
  }
})
