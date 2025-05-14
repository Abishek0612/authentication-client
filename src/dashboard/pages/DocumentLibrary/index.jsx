// src/dashboard/pages/DocumentLibrary/index.jsx
import { useState, useEffect } from "react";
import DocumentList from "./components/DocumentList";
import UploadModal from "./components/UploadModal";
import DocumentFilters from "./components/DocumentFilter";
import InvoiceDataDisplay from "../../../components/Invoice/InvoiceDataDisplay";
import { extractInvoiceData } from "../../../components/Invoice/invoiceExtractionUtils";
import Toast from "../../../components/Toast";

const DocumentLibrary = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(null);
  const [documents, setDocuments] = useState([
    {
      id: "inv-20250503-001",
      name: "INV-20250503-001.pdf",
      type: "Invoice",
      date: "May 3, 2025",
      status: "ocr-running",
    },
    {
      id: "po-2025-0042",
      name: "PO-2025-0042.pdf",
      type: "Purchase Order",
      date: "May 2, 2025",
      status: "ocr-running",
    },
    {
      id: "inv-acme-20250430",
      name: "INV-ACME-20250430.pdf",
      type: "Invoice",
      date: "Apr 30, 2025",
      status: "pending-approval",
    },
    {
      id: "inv-20250425-003",
      name: "INV-20250425-003.pdf",
      type: "Invoice",
      date: "Apr 25, 2025",
      status: "approved",
    },
    {
      id: "po-2025-0041",
      name: "PO-2025-0041.pdf",
      type: "Purchase Order",
      date: "Apr 22, 2025",
      status: "rejected",
    },
    {
      id: "po-2025-0040",
      name: "PO-2025-0040.pdf",
      type: "Purchase Order",
      date: "Apr 20, 2025",
      status: "approved",
    },
  ]);

  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [showInvoiceDisplay, setShowInvoiceDisplay] = useState(false);
  const [extractedInvoiceData, setExtractedInvoiceData] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter documents based on search, tab, and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "approved" && doc.status === "approved");
    const matchesType =
      selectedType === "All Types" || doc.type === selectedType;
    const matchesStatus =
      selectedStatus === "All Statuses" || doc.status === selectedStatus;

    return matchesSearch && matchesTab && matchesType && matchesStatus;
  });

  const handleUploadComplete = (uploadedFiles) => {
    // Add the new files to the document list
    const newDocuments = [...uploadedFiles, ...documents];
    setDocuments(newDocuments);
  };

  const handleDocumentClick = async (document) => {
    // Set the active document regardless of type
    setActiveDocumentId(document.id);

    // Only process invoices
    if (document.type.toLowerCase() !== "invoice") {
      showToast("This document type doesn't support extraction.", "info");
      return;
    }

    // If it's an invoice, extract data
    await processInvoiceExtraction(document);
  };

  // Extract data from an invoice file
  const processInvoiceExtraction = async (document) => {
    if (!document) return;

    showToast(`Extracting data from ${document.name}...`, "info");

    // Update status to OCR running
    updateDocumentStatus(document.id, "ocr-running");

    try {
      // If we have a real file, use it; otherwise use mock data
      const data = document.file
        ? await extractInvoiceData(document.file)
        : await extractInvoiceData();

      setExtractedInvoiceData(data);

      // Update document status to approved
      updateDocumentStatus(document.id, "approved");
      showToast(`Data extracted successfully from ${document.name}!`);

      // Show the invoice display
      setShowInvoiceDisplay(true);
    } catch (error) {
      console.error("Error extracting invoice data:", error);
      updateDocumentStatus(document.id, "pending-approval");
      showToast(
        `Failed to extract data from ${document.name}. Please try again.`,
        "error"
      );
    }
  };

  const updateDocumentStatus = (id, status) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status } : doc))
    );
  };

  const handleSaveInvoiceData = (data) => {
    // Here you would normally save the data to your backend
    console.log("Saving invoice data:", data);
    setShowInvoiceDisplay(false);
    showToast("Invoice data saved successfully!");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Document Library
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-dark-purple)] text-white px-4 py-2 rounded-lg flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Documents
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px space-x-8">
          <button
            className={`py-4 text-sm font-medium border-b-2 cursor-pointer ${
              activeTab === "all"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Docs
          </button>
          <button
            className={`py-4 text-sm font-medium border-b-2 cursor-pointer ${
              activeTab === "approved"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Filters */}
      <DocumentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Document List */}
      <DocumentList
        documents={filteredDocuments}
        onDocumentClick={handleDocumentClick}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
          onShowToast={showToast}
        />
      )}

      {/* Invoice Data Display */}
      {showInvoiceDisplay && extractedInvoiceData && (
        <InvoiceDataDisplay
          invoiceData={extractedInvoiceData}
          onClose={() => setShowInvoiceDisplay(false)}
          onSave={handleSaveInvoiceData}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default DocumentLibrary;
