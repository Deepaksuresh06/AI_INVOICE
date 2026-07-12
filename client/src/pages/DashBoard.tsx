import Header from "../components/dashboard/Header";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentInvoices from "../components/dashboard/RecentInvoices";
import UploadCard from "../components/dashboard/UploadCard";
import api from "../../src/api/axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type InvoiceStats = {
  totalInvoices: number;
  totalAmount: number;
  averageAmount: number;
  vendors: number;
};
type Invoice = {
  _id: string;
  vendor: string;
  amount: number;
  invoiceNumber: string;
};

function DashBoard() {
  const [loadingStats, setLoadingStats] = useState(false);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);


  const fetchInvoiceStats = async () => {
        setLoadingStats(true);
        try {
            const response = await api.get("/invoices/stats");
            const data = response.data;
            setInvoiceStats(data.data);
        } 
        catch (error) {
            toast.error("Failed to load dashboard statistics.");
            console.error("Error fetching invoice stats:", error);
        } 
        finally {
            setLoadingStats(false);
        }
    };

    const fetchInvoices = async () => {
        setLoadingInvoices(true);
        try {
          const response = await api.get("/invoices");
          const backendInvoices = response.data.data;
          const mappedInvoices: Invoice[] = (backendInvoices ?? []).map((inv: any) => ({
              _id: inv._id,
              vendor: inv.supplier ?? "",
              amount: inv.total ?? 0,
              invoiceNumber: inv.invoice_number ?? "",
          }));
          setInvoices(mappedInvoices);
        } 
        catch (error) {
          toast.error("Failed to load recent invoices.");
          console.error("Error fetching invoices:", error);
        } 
        finally {
          setLoadingInvoices(false);
        }
    };

    const refreshDashboard = async () => {
        await Promise.all([
            fetchInvoiceStats(),
            fetchInvoices(),
        ]);
    };

    useEffect(() => {
        void fetchInvoiceStats();
        void fetchInvoices();
    }, []);

    return (
      <div className="min-h-screen bg-surface transition-colors duration-500">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10 space-y-8">
          <Header />        
          <DashboardStats loadingStats={loadingStats} invoiceStats={invoiceStats} />

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

            <motion.div
              initial={{opacity:0,x:-15}}
              animate={{opacity:1,x:0}}
              transition={{delay:0.25}}
              className="xl:col-span-3"
            >
              <RecentInvoices invoices = {invoices} loading = {loadingInvoices}/>
            </motion.div>

            <motion.div
              initial={{opacity:0,x:15}}
              animate={{opacity:1,x:0}}
              transition={{delay:0.25}}
              className="xl:col-span-2"
            >
              <UploadCard onUploadSuccess={refreshDashboard}/>
            </motion.div>

          </div>  
        </div>
      </div>
    );
}

export default DashBoard;

