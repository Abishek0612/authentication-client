import PropTypes from "prop-types";
import { InvoiceImagePreview } from "./InvoiceImagePreview";
import { InvoiceDataDisplay } from "./InvoiceDataDisplay";

export const InvoiceExtractorUI = ({
  invoiceData,
  previewImageUrl,
  onReset,
  onSave,
}) => {
  return (
    <div className="grid md:grid-cols-12 gap-6">
      {/* Invoice Image Preview */}
      <div className="md:col-span-5">
        <InvoiceImagePreview
          imageUrl={previewImageUrl || invoiceData.imageUrl}
        />
      </div>

      {/* Extracted Data Display */}
      <div className="md:col-span-7">
        <InvoiceDataDisplay invoiceData={invoiceData} />
      </div>

      {/* Action buttons */}
      <div className="md:col-span-12 flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Save Invoice Data
        </button>
      </div>
    </div>
  );
};

InvoiceExtractorUI.propTypes = {
  invoiceData: PropTypes.object.isRequired,
  previewImageUrl: PropTypes.string,
  onReset: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
