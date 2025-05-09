import PropTypes from "prop-types";
import DocumentItem from "./DocumentItem";

const DocumentList = ({ documents }) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-md">
      {/* Table Headers */}
      <div className="hidden md:flex bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="w-10"></div> {/* Icon column */}
        <div className="flex-1">Document Name</div>
        <div className="w-32 text-center">Type</div>
        <div className="w-32 text-center">Date</div>
        <div className="w-40 text-center">Status</div>
        <div className="w-32 text-center">Actions</div>
      </div>

      {/* Document List */}
      {documents.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {documents.map((document) => (
            <DocumentItem key={document.id} document={document} />
          ))}
        </ul>
      ) : (
        <div className="p-6 text-center text-gray-500">No documents found</div>
      )}
    </div>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DocumentList;
