import { Route, Routes, Navigate } from "react-router-dom";
import CollapsibleSidebar from "./components/CollapsibleSidebar";
import DocumentLibrary from "./pages/DocumentLibrary";
import { useState } from "react";

const DashboardRoutes = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-full">
      <CollapsibleSidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-0 sm:ml-64"
        }`}
      >
        <div className="p-4 sm:p-6">
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard/documents" replace />}
            />
            <Route path="/documents" element={<DocumentLibrary />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardRoutes;
