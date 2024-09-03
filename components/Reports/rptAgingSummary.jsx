"use client";
import React, { useState } from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { IoSearch } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import ExportService from "@/utils/ExportService";
import { FaFileInvoiceDollar } from "react-icons/fa";
import dayjs from "dayjs";
import Loader from "@/components/Loader";
import { IoMdArrowDropdown } from "react-icons/io";

// Notification Toaster
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgingSummaryReport = ({ data, setListDisplay, details }) => {
  const { currentColor } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");

  // State to track the expanded rows
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const exportableData = filteredUsers.map((item) => ({
    AccountID: item.AccountID,
    AccountTitle: item.AccountTitle,
    OpeningBalance: item.OpeningBalance,
    TotalCredit: item.TotalCredit,
    TotalDebit: item.TotalDebit,
    NetBalance: item.NetBalance,
    Between0To30: item.Between0To30,
    Between31To60: item.Between31To60,
    Between61To90: item.Between61To90,
    Above90: item.Above90,
  }));

  const handleExportToExcel = () => {
    ExportService.exportToExcel(exportableData, "AgingSummaryReport.xlsx");
  };

  const handleExportToPdf = () => {
    const headers = [
      "Account ID",
      "Account Title",
      "Opening Balance",
      "Purchases",
      "Payments",
      "Net Balance",
      "0 To 30",
      "31 To 60",
      "61 To 90",
      "Above 90",
    ];
    ExportService.exportToPdf(
      exportableData,
      headers,
      "AgingSummaryReport.pdf"
    );
  };

  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

  const [loading, setLoading] = useState(false);
  const [Details, setDetails] = useState([]);

  const handleGetReport = async (SupplierId) => {
    console.log(SupplierId);
    // Prepare the payload with formatted date values
    const payload = {
      companyId: details.companyId || null,
      supplierId: SupplierId,
      invoiceType: details.LIT || null,
      gstNonGst: details.GstType || null,
      currencyCode: details.Currency || null,
      dateFrom: dayjs(details.startDate).format("YYYY-MM-DD 00:00:00"),
      dateTo: dayjs(details.endDate).format("YYYY-MM-DD 00:00:00"),
    };

    try {
      const response = await fetch(
        `/api/agingSummary/${details.companyId}/getSupplierDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        toast.error(`Error: ${response.statusText}`, {
          position: "top-right",
        });
        throw new Error(`Error: ${response.statusText}`);
      }

      const record = await response.json();
      setDetails(record);
      setLoading(false);

      console.log("Details data:", Details);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      setLoading(false);
    }
  };

  const toggleRow = (id, SupplierId) => {
    setLoading(true);
    // If the clicked row is already expanded, collapse it
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      // Otherwise, expand the clicked row
      setExpandedRow(id);
      handleGetReport(SupplierId); // Fetch the report for the clicked row
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div
          className="w-[95%] h-[95vh] md:mt-0 mt-7 bg-white rounded-lg px-4 py-5 shadow-md overflow-hidden flex flex-col"
          style={{
            borderTop: `10px solid ${currentColor}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold inline-block">
              Supplier - Payable Summary
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
                  <tr className="text-center text-sm">
                    <th className="px-2 py-1"></th>
                    <th className="px-2 py-1">Account Title</th>
                    <th className="px-2 py-1">Opening Balance</th>
                    <th className="px-2 py-1">Purchases</th>
                    <th className="px-2 py-1">Payments</th>
                    <th className="px-2 py-1">Net Balance</th>
                    <th className="px-2 py-1">0 To 30</th>
                    <th className="px-2 py-1">31 To 60</th>
                    <th className="px-2 py-1">61 To 90</th>
                    <th className="px-2 py-1">Above 90</th>
                    {/* <th className="px-2 py-1">Reg</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item, index) => (
                    <React.Fragment key={item.AccountID || index}>
                      {/* Main row */}
                      <tr className="text-center text-sm">
                        <td className="px-2 py-1 border border-gray-200 text-blue-500 underline">
                          {/* {item.AccountID} */}
                          <IoMdArrowDropdown
                            className="cursor-pointer text-lg text-black"
                            onClick={() =>
                              toggleRow(item.AccountID, item.SupplierId)
                            }
                          />
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-left">
                          {item.AccountTitle}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.OpeningBalance.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.TotalCredit.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.TotalDebit.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.NetBalance.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.Between0To30.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.Between31To60.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.Between61To90.toLocaleString()}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          {item.Above90.toLocaleString()}
                        </td>
                        {/* <td className="px-2 py-1 border border-gray-200">
                          <FaFileInvoiceDollar className="text-green-500 cursor-pointer inline-block" />
                        </td> */}
                      </tr>

                      {/* Collapsible row */}
                      {expandedRow === item.AccountID && (
                        <tr>
                          <td colSpan={14} className="px-4 py-2 bg-gray-400">
                            <div className="text-left">
                              <table className="w-full border-collapse border border-gray-200">
                                <thead className="sticky top-0 bg-gray-100">
                                  <tr className="text-center text-sm">
                                    <th className="px-2 py-1">Invoice Date</th>
                                    <th className="px-2 py-1">Invoice #</th>
                                    <th className="px-2 py-1">Voucher Id</th>
                                    <th className="px-2 py-1">
                                      Opening Balance
                                    </th>
                                    <th className="px-2 py-1">Purchase</th>
                                    <th className="px-2 py-1">Payments</th>
                                    <th className="px-2 py-1">
                                      Closing Balance
                                    </th>
                                    <th className="px-2 py-1">Actual Days</th>
                                    <th className="px-2 py-1">0 To 30</th>
                                    <th className="px-2 py-1">31 To 60</th>
                                    <th className="px-2 py-1">31 To 60</th>
                                    <th className="px-2 py-1">Above-90</th>
                                    <th className="px-2 py-1">Total1</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {loading ? (
                                    <tr>
                                      <td colSpan="14" className="text-center">
                                        <Loader />
                                      </td>
                                    </tr>
                                  ) : (
                                    Details.map((detail, index) => (
                                      <tr
                                        key={index}
                                        className="text-center text-sm bg-white border-2 border-black"
                                      >
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {dayjs(detail.TransactionDate).format(
                                            "DD-MMM-YY"
                                          )}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-left">
                                          {detail.InvoiceNo}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.VoucherID}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.OBCredit.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.InvoiceAmount.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.OBCredit.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Credit.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Dayss}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Between0To30.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Between31To60.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Between61To90.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Above90.toLocaleString()}
                                        </td>
                                        <td className="px-2 py-1 border border-gray-200 text-right">
                                          {detail.Total1.toLocaleString()}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                {/* Footer Row */}
                <tfoot>
                  <tr className="text-center font-bold bg-gray-100 text-sm">
                    <td className="px-2 py-1 border border-gray-200"></td>
                    <td className="px-2 py-1 border border-gray-200"></td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.OpeningBalance, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.TotalCredit, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.TotalDebit, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.NetBalance, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.Between0To30, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.Between31To60, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.Between61To90, 0)
                        .toLocaleString()}
                    </td>
                    <td className="px-2 py-1 border border-gray-200 text-right">
                      {filteredUsers
                        .reduce((sum, row) => sum + row.Above90, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AgingSummaryReport;
