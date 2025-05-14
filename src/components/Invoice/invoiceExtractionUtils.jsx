// src/components/Invoice/invoiceExtractionUtils.js

/**
 * Extracts data from an invoice file
 * @param {File} file - The invoice file to extract data from
 * @returns {Promise<Object>} The extracted invoice data
 */
const extractInvoiceData = async (file) => {
  // This is where you would integrate with Gemini API
  // For now, we'll simulate extraction with mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock data based on the invoice image
      resolve({
        imageUrl: file ? URL.createObjectURL(file) : null,
        date: "20-03-2025",
        invoiceNumber: "SAL00489/24-25",
        totalAmount: "₹2,00,757.18",
        items: [
          {
            description: "ELCAL160 SHANK INFINA A.COPPER",
            hsn: "84149030",
            quantity: "1,065.00",
            rate: "18.04",
            amount: "20,064.60",
          },
          {
            description: "ELCAL0304 AL TOP COVER INFINA A.COPPER",
            hsn: "841-49030",
            quantity: "40.00",
            rate: "106.73",
            amount: "4,289.20",
          },
          {
            description: "ELCAL162 BOTTOM COVER INFINA A.COPPER",
            hsn: "84149030",
            quantity: "168.00",
            rate: "80.24",
            amount: "13,480.32",
          },
          {
            description: "ELCAL168 SHANK INFINA A.BRASS",
            hsn: "84149030",
            quantity: "187.00",
            rate: "18.84",
            amount: "3,523.08",
          },
          {
            description: "ELCAL170 BOTTOM COVER INFINA A.BRASS",
            hsn: "84149030",
            quantity: "140.00",
            rate: "80.24",
            amount: "11,233.60",
          },
          {
            description: "ELCAL181 TOP COVER INFINA A.BRASS",
            hsn: "84149030",
            quantity: "125.00",
            rate: "106.73",
            amount: "13,341.25",
          },
          {
            description: "ELCAL171 TOP COVER INFINA A.BRASS MATT",
            hsn: "84149030",
            quantity: "120.00",
            rate: "106.73",
            amount: "12,807.60",
          },
          {
            description: "ELCAL172 TOP COVER CARDO A.BRASS MATT",
            hsn: "84149030",
            quantity: "110.00",
            rate: "85.00",
            amount: "9,350.00",
          },
          {
            description: "ELCAL173 TOP COVER CARDO A.BRASS MATT",
            hsn: "84149030",
            quantity: "100.00",
            rate: "85.00",
            amount: "8,500.00",
          },
          {
            description: "ELCAL174 TOP COVER CARDO A.COPPER MATT",
            hsn: "84149030",
            quantity: "90.00",
            rate: "85.00",
            amount: "7,650.00",
          },
          {
            description: "ELCAL188 EXPORT SET CAP COVER A.COPPER",
            hsn: "84149030",
            quantity: "110.00",
            rate: "32.00",
            amount: "3,520.00",
          },
        ],
      });
    }, 1500);
  });
};

export { extractInvoiceData };
