import PropTypes from "prop-types";

const DocumentFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
}) => {
  const typeOptions = [
    "All Types",
    "Invoice",
    "Purchase Order",
    "Contract",
    "Report",
  ];

  const statusOptions = [
    "All Statuses",
    "uploading",
    "ocr-running",
    "pending-approval",
    "approved",
    "rejected",
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              placeholder="Search..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Document Type Filter */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm rounded-md"
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value || null)}
          />
        </div>
      </div>
    </div>
  );
};

DocumentFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedType: PropTypes.string.isRequired,
  setSelectedType: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  selectedDate: PropTypes.any,
  setSelectedDate: PropTypes.func.isRequired,
};

export default DocumentFilters;
