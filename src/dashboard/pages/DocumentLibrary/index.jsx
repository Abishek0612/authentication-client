import { useState } from "react";
import DocumentList from "./components/DocumentList";

import UploadModal from "./components/UploadModal";
import DocumentFilters from "./components/DocumentFilter";

const DocumentLibrary = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock data for documents
  const documents = [
    {
      id: "inv-20250503-001",
      name: "INV-20250503-001.pdf",
      type: "Invoice",
      date: "May 3, 2025",
      status: "uploading",
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
  ];

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

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          Document Library
        </h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-dark-purple)] text-white px-4 py-2 rounded-lg flex items-center"
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
            className={`py-4 text-sm font-medium border-b-2 ${
              activeTab === "all"
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Docs
          </button>
          <button
            className={`py-4 text-sm font-medium border-b-2 ${
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
      <DocumentList documents={filteredDocuments} />

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default DocumentLibrary;
