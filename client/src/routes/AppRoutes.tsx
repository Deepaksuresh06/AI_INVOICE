import { Navigate, Route, Routes } from "react-router-dom";
import PremiumAppShell from "../components/layout/PremiumAppShell";
import Entrance from "../pages/Entrance";
import DashBoard from "../pages/DashBoard";
import Invoices from "../pages/Invoices";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path = "/" element = {<Entrance />} />
      <Route path = "/dashboard"
        element = {
          <PremiumAppShell>
            <DashBoard />
          </PremiumAppShell>
        }
      />
      <Route path = "/invoices"
        element = {
          <PremiumAppShell>
            <Invoices />
          </PremiumAppShell>
        }
      />
      <Route path = "/app" element = {<Navigate to="/dashboard" replace />} />
      <Route path = "*" element = {<NotFound />} />
    </Routes>
  );
}