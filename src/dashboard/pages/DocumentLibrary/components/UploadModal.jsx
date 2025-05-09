import { useState, useRef } from "react";
import PropTypes from "prop-types";

const UploadModal = ({ onClose }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2),
      file,
      progress: 0,
      status: "pending",
    }));
    setFiles([...files, ...newFiles]);
  };

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

  const removeFile = (fileId) => {
    setFiles(files.filter((file) => file.id !== fileId));
  };

  const startUpload = () => {
    if (files.length === 0) return;

    const updatedFiles = [...files];

    updatedFiles.forEach((file) => {
      if (file.status === "pending") {
        file.status = "uploading";

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
        }, 300);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Upload Documents
              </h3>

              {/* File drop area */}
              <div
                className={`mt-4 border-2 border-dashed rounded-lg p-6 ${
                  isDragging
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Drag and drop files here, or click to select files
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, Word, Excel, Images up to 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>

              {/* File list */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Selected files:
                  </h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {files.map((file) => (
                      <li
                        key={file.id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <div>
                            <p
                              className="text-sm font-medium text-gray-900 truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {file.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.file.size / 1024).toFixed(0)} KB
                            </p>
                          </div>
                        </div>

                        {file.status === "pending" && (
                          <button
                            type="button"
                            className="ml-2 text-gray-400 hover:text-gray-500"
                            onClick={() => removeFile(file.id)}
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
                          <div className="w-24">
                            <div className="bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[var(--color-primary)] h-2.5 rounded-full"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 text-right mt-1">
                              {file.progress}%
                            </p>
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

                        {file.status === "error" && (
                          <svg
                            className="h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[var(--color-primary)] text-base font-medium text-white hover:bg-[var(--color-dark-purple)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] sm:ml-3 sm:w-auto sm:text-sm"
              onClick={startUpload}
            >
              Upload {files.length > 0 ? `(${files.length})` : ""}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

UploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UploadModal;
