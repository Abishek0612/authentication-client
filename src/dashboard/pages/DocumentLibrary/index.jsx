import { useState, useEffect } from "react";
import DocumentList from "./components/DocumentList";
import UploadModal from "./components/UploadModal";
import DocumentFilters from "./components/DocumentFilter";
import InvoiceDataDisplay from "../../../components/Invoice/InvoiceDataDisplay";
import Toast from "../../../components/Toast";
import invoiceService from "../../../api/invoiceService";

const DocumentLibrary = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [showInvoiceDisplay, setShowInvoiceDisplay] = useState(false);
  const [extractedInvoiceData, setExtractedInvoiceData] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await invoiceService.getInvoices();
      if (response.success) {
        const transformedDocuments = response.data.map((invoice) => ({
          id: invoice._id,
          name: invoice.file_name,
          type: invoice.document_type,
          date: new Date(invoice.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          status: invoice.status.toLowerCase(),
          s3Url: invoice.s3_url,
          extractedData: invoice.invoice_data,
        }));

        setDocuments(transformedDocuments);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      showToast("Failed to load documents. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

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

    let matchesDate = true;
    if (selectedDate) {
      const docDate = new Date(doc.date);
      const filterDate = new Date(selectedDate);
      matchesDate = docDate.toDateString() === filterDate.toDateString();
    }

    return (
      matchesSearch && matchesTab && matchesType && matchesStatus && matchesDate
    );
  });

  const handleUploadComplete = () => {
    setShowUploadModal(false);

    showToast(
      "Documents uploaded successfully. Processing will continue in the background.",
      "success"
    );

    fetchInvoices();
  };

  const handleDocumentClick = async (document) => {
    setActiveDocumentId(document.id);

    try {
      const response = await invoiceService.getInvoiceById(document.id);

      if (response.success) {
        const invoice = response.data;

        if (
          invoice.invoice_data &&
          Object.keys(invoice.invoice_data).length > 0 &&
          !invoice.invoice_data.error
        ) {
          setExtractedInvoiceData({
            imageUrl: invoice.s3_url,
            date: invoice.invoice_data?.date || "",
            invoiceNumber: invoice.invoice_data?.invoiceNumber || "",
            totalAmount: invoice.invoice_data?.totalAmount || "",
            items: invoice.invoice_data?.items || [],
          });

          setShowInvoiceDisplay(true);
        } else if (invoice.status === "ocr-running") {
          showToast(
            "This invoice is still being processed. Please try again later.",
            "info"
          );
        } else {
          showToast(
            "No extracted data available for this invoice yet.",
            "info"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      showToast("Failed to load document details. Please try again.", "error");
    }
  };
  const handleDeleteDocument = async (documentId, e) => {
    e.stopPropagation();

    try {
      await invoiceService.deleteInvoice(documentId);
      showToast("Document deleted successfully.", "success");
      fetchInvoices();
    } catch (error) {
      console.error("Error deleting document:", error);
      showToast("Failed to delete document. Please try again.", "error");
    }
  };

  const handleSaveInvoiceData = async (data) => {
    try {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === activeDocumentId ? { ...doc, status: "approved" } : doc
        )
      );

      showToast("Invoice data saved successfully!", "success");
      setShowInvoiceDisplay(false);

      fetchInvoices();
    } catch (error) {
      console.error("Error saving invoice data:", error);
      showToast("Failed to save invoice data. Please try again.", "error");
    }
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

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
          <span className="ml-3 text-gray-600">Loading documents...</span>
        </div>
      ) : (
        /* Document List */
        <DocumentList
          documents={filteredDocuments}
          onDocumentClick={handleDocumentClick}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

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
          invoiceId={activeDocumentId}
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
