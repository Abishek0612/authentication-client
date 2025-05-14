
import PropTypes from "prop-types";

export const InvoiceImagePreview = ({ imageUrl }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden h-full">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-md font-medium text-gray-700">Invoice Image</h3>
      </div>
      <div className="p-2 flex justify-center items-center h-[calc(100%-56px)]">
        <div className="relative w-full h-full rounded-md overflow-hidden border border-gray-200 flex items-center justify-center">
          <img
            src={imageUrl}
            alt="Invoice Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

InvoiceImagePreview.propTypes = {
  imageUrl: PropTypes.string.isRequired,
};
