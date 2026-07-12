import Header from "../components/dashboard/Header";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentInvoices from "../components/dashboard/RecentInvoices";
import UploadCard from "../components/dashboard/UploadCard";

function DashBoard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-8">
        <Header />        
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent invoices */}
          <RecentInvoices />

          {/* Upload */}
          <UploadCard />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;

