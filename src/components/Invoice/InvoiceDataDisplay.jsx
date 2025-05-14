// src/components/Invoice/InvoiceDataDisplay.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const InvoiceDataDisplay = ({
  invoiceData,
  onClose,
  onSave,
  modalMode = false,
  goBackCallback = null,
}) => {
  const [editedData, setEditedData] = useState(invoiceData);

  return (
    <div
      className={modalMode ? "w-full" : "fixed inset-0 overflow-y-auto"}
      style={{ zIndex: modalMode ? "inherit" : 9999 }}
    >
      {/* Overlay - only show if not in modal mode */}
      {!modalMode && (
        <div
          className="fixed inset-0 transition-opacity"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        ></div>
      )}

      {/* Modal content */}
      <div
        className={
          modalMode
            ? "w-full h-full"
            : "flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0"
        }
      >
        <div
          className={`relative bg-white rounded-lg shadow-xl ${
            modalMode ? "w-full" : "w-full max-w-6xl mx-auto"
          } overflow-hidden`}
        >
          {/* Header with title and back/close buttons */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            {goBackCallback ? (
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center"
                onClick={goBackCallback}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Files
              </button>
            ) : (
              <h2 className="text-xl font-bold">Invoice Data Extraction</h2>
            )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Invoice Image */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">
                  Invoice Image
                </h3>
                <div
                  className="border border-gray-300 rounded-lg p-2 overflow-auto"
                  style={{ height: modalMode ? "500px" : "600px" }}
                >
                  {invoiceData.imageUrl ? (
                    <img
                      src={invoiceData.imageUrl}
                      alt="Invoice"
                      className="w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {/* Right column - Extracted Data */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">
                  Extracted Invoice Data
                </h3>
                <div
                  className="border border-gray-300 rounded-lg p-4 overflow-auto"
                  style={{ height: modalMode ? "500px" : "600px" }}
                >
                  <div className="space-y-6">
                    {/* Invoice Header Fields - Grid Layout */}
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Date
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={editedData.date || ""}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                date: e.target.value,
                              })
                            }
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={editedData.invoiceNumber || ""}
                            onChange={(e) =>
                              setEditedData({
                                ...editedData,
                                invoiceNumber: e.target.value,
                              })
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Amount
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={editedData.totalAmount || ""}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              totalAmount: e.target.value,
                            })
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Line Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-center">
                        Items
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ITEM
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HSN/SAC
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                QTY
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RATE
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                AMOUNT
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {editedData.items &&
                              editedData.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 text-sm text-gray-900">
                                    {item.description}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900">
                                    {item.hsn}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900">
                                    {item.quantity}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900">
                                    {item.rate}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-900">
                                    {item.amount}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                onClick={() => onSave(editedData)}
              >
                Save Invoice Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InvoiceDataDisplay.propTypes = {
  invoiceData: PropTypes.shape({
    imageUrl: PropTypes.string,
    date: PropTypes.string,
    invoiceNumber: PropTypes.string,
    totalAmount: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        hsn: PropTypes.string,
        quantity: PropTypes.string,
        rate: PropTypes.string,
        amount: PropTypes.string,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  modalMode: PropTypes.bool,
  goBackCallback: PropTypes.func,
};

export default InvoiceDataDisplay;
