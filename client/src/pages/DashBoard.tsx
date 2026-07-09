import React, {useEffect, useState, useRef} from "react";
import api from "../api/axios";

function DashBoard() {
    
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    interface Invoice {
        _id: string;
        vendor: string;
        amount: number;
        invoiceNumber: string;
    }
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    
    interface InvoiceStats {
        totalInvoices: number;
        totalAmount: number;
        averageAmount: number;
        vendors: number;
    }
    const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }

    const handleUpload = () => {
        if(!file) {
            return;
        }
        uploadFile(file);
    }

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append("invoice", file);

        try {
            const response = await api.post(`/upload`, formData);
            console.log(response);
            alert("File uploaded successfully");
            // refresh stats/invoices after successful upload
            fetchInvoiceStats();
            fetchInvoices();
        }
        catch(error: any) {
            console.error("Error uploading file:", error);

            const backendMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Upload failed";

            alert(`Upload failed: ${backendMessage}`);
        }
    }

    const fetchInvoiceStats = async() => {
        try {
            const response = await api.get('/invoices/stats');
            const data = response.data;
            setInvoiceStats(data.data);

        }
        catch(error) {
            alert("Error fetching invoice stats. Check console for details.");
            console.error("Error fetching invoice stats:", error);
        }
    }

    const fetchInvoices = async() => {
        try {
            setLoading(true);
            const response = await api.get('/invoices');
            const backendInvoices = response.data.data;
            const mappedInvoices: Invoice[] = (backendInvoices ?? []).map((inv: any) => ({
                _id: inv._id,
                vendor: inv.supplier ?? "",
                amount: inv.total ?? 0,
                invoiceNumber: inv.invoice_number ?? "",
            }));
            setInvoices(mappedInvoices);
        }
        catch(error) {
            alert("Error in fetching invoices. Check console for details.");
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchInvoiceStats();
        fetchInvoices();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-8">
                Dashboard
            </h1>
            {invoiceStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                        <p className="text-gray-500">Total Invoices</p>
                        <h2 className="text-3xl font-bold mt-2">
                        {invoiceStats.totalInvoices}
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                        <p className="text-gray-500">Total Amount</p>
                        <h2 className="text-3xl font-bold mt-2 text-green-600">
                        ₹ {invoiceStats.totalAmount}
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                        <p className="text-gray-500">Average Amount</p>
                        <h2 className="text-3xl font-bold mt-2 text-blue-600">
                        ₹ {invoiceStats.averageAmount}
                        </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                        <p className="text-gray-500">Vendors</p>
                        <h2 className="text-3xl font-bold mt-2 text-purple-600">
                        {invoiceStats.vendors}
                        </h2>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-bold">
                        Recent Invoices
                        </h2>
                        <button className="text-blue-600 hover:underline">
                        View All
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : invoices.length === 0 ? (
                        <p className="text-gray-500">
                        No invoices uploaded yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                        {invoices.slice(0, 5).map((invoice) => (
                            <div
                            key={invoice._id}
                            className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50 transition"
                            >
                            <div>
                                <h3 className="font-semibold text-lg">
                                {invoice.invoiceNumber}
                                </h3>

                                <p className="text-gray-500">
                                {invoice.vendor}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xl font-bold text-green-600">
                                ₹ {invoice.amount}
                                </p>
                            </div>
                            </div>
                        ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Upload Invoice
                    </h2>

                    <div
                        onClick={() => inputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-blue-400 rounded-2xl p-10 text-center cursor-pointer hover:bg-blue-50 transition"
                    >
                        <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleChange}
                        />

                        <div className="text-6xl mb-4">
                        📤
                        </div>
                        <p className="text-xl font-semibold">
                        Drag & Drop Invoice
                        </p>
                        <p className="text-gray-500 mt-2">
                        or Click to Browse
                        </p>

                    </div>

                    {file && (
                        <div className="mt-6 border rounded-xl p-4">

                        <h3 className="font-semibold mb-4">
                            Selected File
                        </h3>

                        <div className="flex items-center gap-4">

                            {file.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            ) : (
                            <div className="w-20 h-20 rounded-lg bg-red-100 flex items-center justify-center text-4xl">
                                📄
                            </div>
                            )}

                            <div className="flex-1">

                            <p className="font-medium">
                                {file.name}
                            </p>

                            <p className="text-gray-500 text-sm">
                                {(file.size / 1024).toFixed(2)} KB
                            </p>

                            </div>

                            <button
                            onClick={() => setFile(null)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                            Remove
                            </button>

                        </div>

                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:bg-gray-400"
                    >
                        Upload Invoice
                    </button>
                </div>
            </div>
            </div>
        </div>
    );
}

export default DashBoard;