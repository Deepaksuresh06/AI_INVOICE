import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./theme";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>

      <Toaster
        toastOptions={{
          className:
            "bg-surface-elevated text-content border border-border shadow-md",
          style: {
            background: "var(--color-surface-elevated)",
            color: "var(--color-content)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </BrowserRouter>
  );
}