import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import invoiceRoute from "./routes/invoiceRoute";


const app = express();
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., curl/postman)
            if (!origin) return callback(null, true);

            // Allow both Vite dev ports (5173 default, sometimes other)
            // so local frontend works during development.
            const allowed = ["http://localhost:5173", "http://localhost:5174"];
            if (allowed.includes(origin)) return callback(null, true);

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);
app.use(express.json());

app.use("/api/invoice", invoiceRoute);

// Multer error handling (invalid type/size etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) return next();

  // Multer errors have `code` like LIMIT_FILE_SIZE and message.
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "File too large. Max size is 5MB." });
    }
    return res.status(400).json({ success: false, message: err.message || "Upload failed" });
  }

  // fileFilter throws normal Error
  if (typeof err.message === "string" && /Invalid file type/i.test(err.message)) {
    return res.status(400).json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: err.message || "Server error" });
});

export default app;
