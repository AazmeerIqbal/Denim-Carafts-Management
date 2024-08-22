"use client";
import React, { useState } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { IoSearch } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import ExportService from "@/utils/ExportService";
import Link from "next/link";
import Pagination from "@/components/Pagination";

const FabricReport = ({ data, setListDisplay, cc, bi, df, dt, ghn }) => {
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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

  // Calculate the total stock outside of JSX
  const totalStock = filteredUsers.reduce(
    (acc, item) => (item.BalanceQty1 > 0 ? acc + item.BalanceQty1 : acc),
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div
        className="w-[90%] h-[90vh] bg-white rounded-lg px-4 py-5 shadow-md overflow-hidden flex flex-col"
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold inline-block">
            Fabric Stock Quantity
          </h1>
          <p>Stock Qty: {totalStock.toLocaleString()}</p>
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
              onClick={() => setListDisplay(false)}
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
            className={`p-2 pl-10 mb-4 border-2 rounded-lg w-full`}
            style={{ borderColor: currentColor }}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500">No records to display</p>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-center">
                  <th className="px-4 py-2 ">S. #</th>
                  <th className="px-4 py-2 ">Artical #</th>
                  <th className="px-4 py-2 ">Stock</th>
                  <th className="px-4 py-2 ">Fabric Value</th>
                  <th className="px-4 py-2 ">Order In Mills</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => (
                  <tr
                    key={item.row_num || index}
                    className={
                      item.BalanceQty1 < 0
                        ? "bg-red-400 text-white text-center"
                        : "text-center"
                    }
                  >
                    <td className="px-4 py-2 border border-gray-200">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-200">
                      <Link
                        href={`http://161.97.145.87:8066/admin/FabricArticalWiseHistory.aspx?id=${item.ItemID}&cc=${cc}&bi=${bi}&df=${df}&dt=${dt}&ghn=${ghn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.ArticalNo}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-gray-200 text-right">
                      {item.BalanceQty1.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border border-gray-200"></td>
                    <td className="px-4 py-2 border border-gray-200"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handleFirstPage={handleFirstPage}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handleLastPage={handleLastPage}
          />
        )}
      </div>
    </div>
  );
};

export default FabricReport;
