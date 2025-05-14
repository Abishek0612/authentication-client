// src/components/Invoice/InvoiceExtractor.jsx
import { useEffect } from "react";
import PropTypes from "prop-types";
import { extractInvoiceData } from "./invoiceExtractionUtils";

const InvoiceExtractor = ({ file, onExtractionComplete, onError }) => {
  // Added useEffect to automatically call extractData when the component mounts
  useEffect(() => {
    const extractData = async () => {
      try {
        const data = await extractInvoiceData(file);
        onExtractionComplete(data);
      } catch (error) {
        console.error("Error extracting invoice data:", error);
        onError("Failed to extract data from invoice. Please try again.");
      }
    };

    extractData();
  }, [file, onExtractionComplete, onError]);

  return null; // This is a utility component, no rendering needed
};

InvoiceExtractor.propTypes = {
  file: PropTypes.object.isRequired,
  onExtractionComplete: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default InvoiceExtractor;
