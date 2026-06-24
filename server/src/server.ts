import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

if (Number.isNaN(PORT)) {
  throw new Error("Invalid PORT value in .env");
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});