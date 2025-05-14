// src/dashboard/pages/DocumentLibrary/components/UploadModal.jsx
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { extractInvoiceData } from "../../../../components/Invoice/invoiceExtractionUtils";
import InvoiceDataDisplay from "../../../../components/Invoice/InvoiceDataDisplay";

const UploadModal = ({ onClose, onUploadComplete, onShowToast }) => {
  // State for document handling
  const [documentType, setDocumentType] = useState("Invoice");
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // UI state management
  const [showUploadedFiles, setShowUploadedFiles] = useState(false);
  const [activeTab, setActiveTab] = useState("new"); // "new" or "uploaded"
  const [isExtracting, setIsExtracting] = useState(false);

  // Current extraction state
  const [currentExtractionFile, setCurrentExtractionFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [showInvoiceDisplay, setShowInvoiceDisplay] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Close on ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  // File selection handler
  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2),
      file,
      name: file.name,
      progress: 0,
      status: "pending", // pending, uploading, error, success
      type: documentType,
    }));
    setFiles([...files, ...newFiles]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // File management functions
  const removeFile = (fileId, e) => {
    e.stopPropagation();
    setFiles(files.filter((file) => file.id !== fileId));
  };

  const removeUploadedFile = (fileId, e) => {
    e.stopPropagation();
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  // Upload function
  const startUpload = () => {
    if (files.length === 0) return;

    const updatedFiles = [...files];

    updatedFiles.forEach((file) => {
      if (file.status === "pending") {
        file.status = "uploading";

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 10);

          if (progress >= 100) {
            clearInterval(interval);
            progress = 100;
            file.status = "success";
            setFiles([...updatedFiles]);
          } else {
            file.progress = progress;
            setFiles([...updatedFiles]);
          }
        }, 200);
      }
    });

    // After upload is complete, add to uploaded files
    setTimeout(() => {
      const processedFiles = updatedFiles.map((file) => ({
        id: file.id,
        name: file.file.name,
        type: documentType,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: "ocr-ready",
        file: file.file,
      }));

      setUploadedFiles([...uploadedFiles, ...processedFiles]);
      setFiles([]);
      setActiveTab("uploaded");
      setShowUploadedFiles(true);
      onShowToast(
        "Files uploaded successfully! Click on a file to extract data.",
        "success"
      );

      // Also send these to the parent component
      onUploadComplete(processedFiles);
    }, 1500);
  };

  // Invoice extraction handling
  const handleExtractInvoice = async (file) => {
    if (!file || !file.file) return;

    setCurrentExtractionFile(file);
    setIsExtracting(true);
    onShowToast(`Extracting data from ${file.name}...`, "info");

    try {
      const data = await extractInvoiceData(file.file);
      setExtractedData(data);
      setShowInvoiceDisplay(true);

      // Update file status to indicate extraction is complete
      const updatedFiles = uploadedFiles.map((f) =>
        f.id === file.id ? { ...f, status: "extracted" } : f
      );
      setUploadedFiles(updatedFiles);

      onShowToast(`Data extracted successfully from ${file.name}!`, "success");
    } catch (error) {
      console.error("Error extracting invoice data:", error);
      onShowToast(
        `Failed to extract data from ${file.name}. Please try again.`,
        "error"
      );
    } finally {
      setIsExtracting(false);
    }
  };

  // Save extracted data
  const handleSaveInvoiceData = (data) => {
    console.log("Saving invoice data:", data);
    setShowInvoiceDisplay(false);
    onShowToast("Invoice data saved successfully!", "success");

    // Update file status
    const updatedFiles = uploadedFiles.map((f) =>
      f.id === currentExtractionFile.id ? { ...f, status: "approved" } : f
    );
    setUploadedFiles(updatedFiles);
  };

  // Navigate back to the file list
  const handleBackToFiles = () => {
    setShowInvoiceDisplay(false);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: 9999 }}>
      {/* Semi-transparent overlay */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={showInvoiceDisplay ? null : onClose}
      ></div>

      {/* Modal content */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl mx-auto ${
            showInvoiceDisplay ? "w-full max-w-6xl" : "w-full max-w-md"
          }`}
          style={{ zIndex: 9999 }}
        >
          {/* When showing invoice data extraction */}
          {showInvoiceDisplay && extractedData ? (
            <InvoiceDataDisplay
              invoiceData={extractedData}
              onClose={() => setShowInvoiceDisplay(false)}
              onSave={handleSaveInvoiceData}
              modalMode={true}
              goBackCallback={handleBackToFiles}
            />
          ) : (
            <>
              {/* Modal header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium">Upload Documents</h2>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {/* Document Type */}
                <div className="mb-6">
                  <label
                    htmlFor="documentType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Document Type
                  </label>
                  <div className="relative">
                    <select
                      id="documentType"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value)}
                    >
                      <option value="Invoice">Invoice</option>
                      <option value="Purchase Order">Purchase Order</option>
                      <option value="Contract">Contract</option>
                      <option value="Report">Report</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Tab navigation between New Files and Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px space-x-8">
                      <button
                        className={`py-2 text-sm font-medium border-b-2 cursor-pointer ${
                          activeTab === "new"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setActiveTab("new");
                          setShowUploadedFiles(false);
                        }}
                      >
                        New Files
                      </button>
                      <button
                        className={`py-2 text-sm font-medium border-b-2 cursor-pointer ${
                          activeTab === "uploaded"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setActiveTab("uploaded");
                          setShowUploadedFiles(true);
                        }}
                      >
                        Uploaded Files ({uploadedFiles.length})
                      </button>
                    </div>
                  </div>
                )}

                {showUploadedFiles ? (
                  /* Uploaded Files List */
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Click on a file to extract data
                    </label>
                    <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                      {uploadedFiles.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {uploadedFiles.map((file) => (
                            <li
                              key={file.id}
                              className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleExtractInvoice(file)}
                            >
                              <div className="flex items-center">
                                <svg
                                  className="h-5 w-5 text-gray-400 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm text-gray-900">
                                  {file.name}
                                </span>
                              </div>

                              <div className="flex items-center">
                                {file.status === "extracted" && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                                    Extracted
                                  </span>
                                )}
                                {file.status === "approved" && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                                    Approved
                                  </span>
                                )}
                                <button
                                  type="button"
                                  className="ml-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                                  onClick={(e) =>
                                    removeUploadedFile(file.id, e)
                                  }
                                >
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="py-4 text-center text-sm text-gray-500">
                          No files uploaded yet
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={() => {
                          setActiveTab("new");
                          setShowUploadedFiles(false);
                        }}
                      >
                        Add More Files
                      </button>
                    </div>
                  </div>
                ) : (
                  /* New Files Section */
                  <>
                    {/* Selected Files */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Files ({files.length})
                      </label>
                      <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                        {files.length > 0 ? (
                          <ul className="divide-y divide-gray-200">
                            {files.map((file) => (
                              <li
                                key={file.id}
                                className="flex items-center justify-between py-2 px-3"
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="h-5 w-5 text-gray-400 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-900 truncate max-w-[200px]">
                                    {file.file.name}
                                  </span>
                                </div>

                                {file.status === "pending" && (
                                  <button
                                    type="button"
                                    className="ml-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                                    onClick={(e) => removeFile(file.id, e)}
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                )}

                                {file.status === "uploading" && (
                                  <div className="w-20">
                                    <div className="bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${file.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}

                                {file.status === "success" && (
                                  <svg
                                    className="h-5 w-5 text-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="py-4 text-center text-sm text-gray-500">
                            No files selected
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload options */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={triggerFileInput}
                        className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <svg
                          className="mr-2 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        Upload from computer
                      </button>
                      <button className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                        <svg
                          className="mr-2 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                          />
                        </svg>
                        Import from Google Drive
                      </button>
                    </div>

                    {/* File drop area */}
                    <div
                      className={`mb-6 border-2 border-dashed rounded-md p-8 transition-colors cursor-pointer ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          Drag and drop files here, or click to select files
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Supported formats: PDF, Word, Excel, Images
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        onClick={startUpload}
                        disabled={files.length === 0}
                      >
                        Upload
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Loading indicator for extraction - Small spinner inside modal */}
          {isExtracting && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-700 text-sm">Extracting data...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUploadComplete: PropTypes.func.isRequired,
  onShowToast: PropTypes.func.isRequired,
};

export default UploadModal;
