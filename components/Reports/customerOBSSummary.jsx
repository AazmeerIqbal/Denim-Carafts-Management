import React, { useState } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { IoSearch } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import ExportService from "@/utils/ExportService";
import Pagination from "@/components/Pagination";

const CustomerOBSSummary = ({ data, setListDisplay, statusOrValue }) => {
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((item) =>
    item.CustomerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract month names dynamically from the first data entry
  const monthNames = Object.keys(data[0]).filter(
    (key) =>
      key !== "CustomerName" && key !== "Total" && !key.startsWith("row_num")
  );

  // Calculate row sums and append to the data
  const dataWithRowSums = filteredData.map((item) => {
    const rowSum = monthNames.reduce((acc, month) => {
      const value = item[month] || 0;
      return acc + value;
    }, 0);
    return { ...item, rowSum };
  });

  // Calculate column sums
  const columnSums = monthNames.reduce((acc, month) => {
    const columnSum = dataWithRowSums.reduce((sum, item) => {
      return sum + (item[month] || 0);
    }, 0);
    acc[month] = columnSum;
    return acc;
  }, {});

  const totalSum = dataWithRowSums.reduce((sum, item) => sum + item.rowSum, 0);

  const handleExportToExcel = () => {
    ExportService.exportToExcel(dataWithRowSums, "CustomerOBSSummary.xlsx");
  };

  const handleExportToPdf = () => {
    const headers = ["Customer Name", ...monthNames, "Total"];
    const exportableData = dataWithRowSums.map((item) => ({
      CustomerName: item.CustomerName,
      ...monthNames.reduce((acc, month) => {
        acc[month] = item[month] || 0;
        return acc;
      }, {}),
      rowSum: item.rowSum,
    }));

    ExportService.exportToPdf(
      exportableData,
      headers,
      "CustomerOBSSummary.pdf"
    );
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = dataWithRowSums.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-150">
      <div
        className="w-[95%] h-[95vh] bg-white rounded-lg px-4 pt-5 pb-10 shadow-md overflow-hidden flex flex-col "
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold inline-block">
            OBS - Order {statusOrValue == "0" ? "Quantity" : "Value In PKR"}
          </h1>
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
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={handleSearch}
            className={`p-2 pl-10 mb-4 border-2 rounded-lg w-full`}
            style={{ borderColor: currentColor }}
          />
        </div>

        {dataWithRowSums.length === 0 ? (
          <p className="text-center text-gray-500">No records to display</p>
        ) : (
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="sticky top-0 bg-gray-100">
                <tr className="text-center text-sm">
                  <th className="px-2 py-1 w-[10%]">Customer Name</th>
                  {monthNames.map((month, index) => (
                    <th key={index} className="px-2 py-1">
                      {month}
                    </th>
                  ))}
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => (
                  <tr key={index} className="text-center text-sm">
                    <td className="px-2 py-1 border border-gray-200 w-[10%]">
                      {item.CustomerName}
                    </td>
                    {monthNames.map((month) => (
                      <td
                        key={month}
                        className="px-2 py-1 border border-gray-200 text-right"
                      >
                        {(item[month] || 0).toLocaleString()}
                      </td>
                    ))}
                    <td className="px-2 py-1 border border-gray-200 text-right font-bold">
                      {item.rowSum.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-200 text-center text-sm">
                  <td className="px-2 py-1 border border-gray-200"></td>
                  {monthNames.map((month, index) => (
                    <td
                      key={index}
                      className="px-2 py-1 border border-gray-200 text-right"
                    >
                      {columnSums[month].toLocaleString()}
                    </td>
                  ))}
                  <td className="px-2 py-1 border border-gray-200 text-right">
                    {totalSum.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOBSSummary;
