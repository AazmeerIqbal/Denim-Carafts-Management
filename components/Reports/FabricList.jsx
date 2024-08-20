"use client";
import React, { useState } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { IoSearch } from "react-icons/io5";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import ExportService from "@/utils/ExportService"; // Import the utility class

const FabricReport = ({ data, setListDisplay }) => {
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Adjust this value to show more or fewer rows per page

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter data by search query
  const filteredUsers = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Map filtered data to export only selected columns
  const exportableData = filteredUsers.map((item) => ({
    row_num: item.row_num,
    ArticalNo: item.ArticalNo,
    BalanceQty1: item.BalanceQty1,
  }));

  const handleExportToExcel = () => {
    ExportService.exportToExcel(exportableData, "FabricReport.xlsx");
  };

  const handleExportToPdf = () => {
    const headers = ["S. #", "Artical #", "Stock"];
    ExportService.exportToPdf(exportableData, headers, "FabricReport.pdf");
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="w-[90%] h-[90vh] bg-white rounded-lg px-4 py-5 shadow-md overflow-hidden flex flex-col"
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Fabric List</h1>
          <div className="flex space-x-2">
            <button
              className="text-blue-500 hover:text-blue-700 transition duration-300"
              onClick={handleExportToExcel}
            >
              Export to Excel
            </button>
            <button
              className="text-red-500 hover:text-red-700 transition duration-300"
              onClick={handleExportToPdf}
            >
              Export to PDF
            </button>
            <button
              className="text-gray-500 hover:text-gray-900 transition duration-300"
              onClick={() => {
                setListDisplay(false);
              }}
            >
              <ImCross />
            </button>
          </div>
        </div>

        <div className="relative">
          <span className="absolute top-2.5 left-0 flex items-center pl-3">
            <IoSearch className="text-gray-400 text-xl" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 pl-10 mb-4 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Scrollable table container */}
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">S. #</th>
                <th className="px-4 py-2 text-left">Artical #</th>
                <th className="px-4 py-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item, index) => (
                <tr
                  key={item.row_num || index}
                  className={
                    item.BalanceQty1 < 0 ? "bg-red-400 text-white" : ""
                  }
                >
                  <td className="px-4 py-2 border border-gray-200">
                    {item.row_num}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {item.ArticalNo}
                  </td>
                  <td className="px-4 py-2 border border-gray-200">
                    {item.BalanceQty1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4 items-center">
          <div className="flex items-center space-x-2 mx-auto">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
            >
              <FaStepBackward className="text-gray-600" />
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight className="text-gray-600" />
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              <FaStepForward className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricReport;
