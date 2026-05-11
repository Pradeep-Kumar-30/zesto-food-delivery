import express from "express";
import dotenv from "dotenv";

dotenv.config({ override: true });

import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import itemRouter from "./routes/item.routes.js";
import shopRouter from "./routes/shop.routes.js";
import orderRouter from "./routes/order.routes.js";

import { socketHandler } from "./socket.js";
import { parseAllowedOrigins } from "./utils/corsOrigins.js";

const app = express();
const server = http.createServer(app);

// ======================
// CORS CONFIG
// ======================

const allowedOrigins = parseAllowedOrigins();

const corsOriginCallback = (origin, callback) => {
  // Allow requests without origin (Postman/mobile apps)
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error("Not allowed by CORS"));
};

// ======================
// SOCKET.IO
// ======================

const io = new Server(server, {
  cors: {
    origin:
      allowedOrigins.length === 1
        ? allowedOrigins[0]
        : allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

// ======================
// MIDDLEWARES
// ======================

app.use(
  cors({
    origin: corsOriginCallback,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ======================
// HEALTH & ROOT ROUTES
// ======================

app.get("/", (req, res) => {
  res.status(200).send("Zesto Backend Running 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy ✅",
  });
});

// ======================
// API ROUTES
// ======================

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// ======================
// SOCKET HANDLER
// ======================

socketHandler(io);

// ======================
// DATABASE + SERVER START
// ======================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `🌍 Allowed Origins: ${allowedOrigins.join(", ")}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();