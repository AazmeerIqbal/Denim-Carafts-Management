import { Loader, ChevronDown, ChevronUp, Search } from "lucide-react";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExchangeAlt } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";

const PayableAndLoan = ({ isLoading, tradersPayable, loansPayable }) => {
  const [tradersCollapsed, setTradersCollapsed] = useState(true);
  const [loansCollapsed, setLoansCollapsed] = useState(true);
  const [tradersSearchTerm, setTradersSearchTerm] = useState("");
  const [loansSearchTerm, setLoansSearchTerm] = useState("");

  const calculateTotal = (data) =>
    data?.reduce((total, item) => total + Number(item.BalanceAmount || 0), 0) ||
    0;

  const totalTraders = calculateTotal(tradersPayable);
  const totalLoans = calculateTotal(loansPayable);

  // Group data by ParentAccountTitle
  const groupedTradersPayable = useMemo(() => {
    if (!tradersPayable) return {};

    const grouped = {};
    tradersPayable.forEach((item) => {
      const parentTitle = item.ParentAccountTitle || "Other";
      if (!grouped[parentTitle]) {
        grouped[parentTitle] = [];
      }
      grouped[parentTitle].push(item);
    });
    return grouped;
  }, [tradersPayable]);

  const groupedLoansPayable = useMemo(() => {
    if (!loansPayable) return {};

    const grouped = {};
    loansPayable.forEach((item) => {
      const parentTitle = item.ParentAccountTitle || "Other";
      if (!grouped[parentTitle]) {
        grouped[parentTitle] = [];
      }
      grouped[parentTitle].push(item);
    });
    return grouped;
  }, [loansPayable]);

  // Filter traders based on search term
  const filteredTradersPayable = useMemo(() => {
    if (!tradersPayable) return {};

    const filtered = tradersPayable.filter((item) =>
      item.AccountTitle.toLowerCase().includes(tradersSearchTerm.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((item) => {
      const parentTitle = item.ParentAccountTitle || "Other";
      if (!grouped[parentTitle]) {
        grouped[parentTitle] = [];
      }
      grouped[parentTitle].push(item);
    });
    return grouped;
  }, [tradersPayable, tradersSearchTerm]);

  // Filter loans based on search term
  const filteredLoansPayable = useMemo(() => {
    if (!loansPayable) return {};

    const filtered = loansPayable.filter((item) =>
      item.AccountTitle.toLowerCase().includes(loansSearchTerm.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((item) => {
      const parentTitle = item.ParentAccountTitle || "Other";
      if (!grouped[parentTitle]) {
        grouped[parentTitle] = [];
      }
      grouped[parentTitle].push(item);
    });
    return grouped;
  }, [loansPayable, loansSearchTerm]);

  // Calculate subtotals for each parent group
  const calculateSubtotal = (items) => {
    return (
      items?.reduce(
        (total, item) => total + Number(item.BalanceAmount || 0),
        0
      ) || 0
    );
  };

  return (
    <>
      {/* <!-- Traders Payable --> */}
      <div className="col-span-1 sm:col-span-1 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex gap-2">
              <FaExchangeAlt />
              Traders Payable
            </h5>
            <button
              onClick={() => setTradersCollapsed(!tradersCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              {tradersCollapsed ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {!tradersCollapsed && (
              <motion.div
                className="flow-root"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader rotate={true} className="dark:text-white" />
                  </div>
                ) : tradersPayable?.length > 0 ? (
                  <div className="relative overflow-x-auto mt-4">
                    <div className="max-w-full overflow-x-auto">
                      <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 " />
                        </div>
                        <input
                          type="search"
                          className="w-full p-2 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Search account title..."
                          value={tradersSearchTerm}
                          onChange={(e) => setTradersSearchTerm(e.target.value)}
                        />
                      </div>
                      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr className="text-gray-600 dark:text-gray-300 font-semibold">
                            <th className="px-2 py-1 text-left w-[50%] sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                              Account Title
                            </th>
                            <th className="px-2 py-1 text-right w-[40%]">
                              Balance
                            </th>
                            <th className="px-2 py-1 text-center w-[10%]">
                              Tag
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {Object.keys(filteredTradersPayable).map(
                            (parentTitle, groupIndex) => {
                              const items = filteredTradersPayable[parentTitle];
                              const subtotal = calculateSubtotal(items);

                              return (
                                <React.Fragment key={`group-${groupIndex}`}>
                                  {/* Parent Title Row */}
                                  <tr className="bg-gray-100 dark:bg-gray-600 font-semibold">
                                    <td
                                      colSpan="3"
                                      className="px-2 py-1 text-left sticky left-0 bg-gray-100 dark:bg-gray-600 z-10"
                                    >
                                      {parentTitle}
                                    </td>
                                  </tr>

                                  {/* Child Items */}
                                  {items.map((item, itemIndex) => (
                                    <tr
                                      key={`item-${groupIndex}-${itemIndex}`}
                                      className={`${
                                        item.Tag === "Dr"
                                          ? "text-red-400"
                                          : "text-gray-900 dark:text-white"
                                      }`}
                                    >
                                      <td className="px-2 py-1 break-words sticky left-0 bg-white dark:bg-gray-800 z-10 pl-4">
                                        {item.AccountTitle}
                                      </td>
                                      <td className="px-2 py-1 text-right">
                                        {Number(
                                          item.BalanceAmount
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                        })}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {item.Tag}
                                      </td>
                                    </tr>
                                  ))}

                                  {/* Subtotal Row */}
                                  <tr className="bg-gray-50 dark:bg-gray-700 italic text-sm">
                                    <td className="px-2 py-1 text-right sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                                      Subtotal
                                    </td>
                                    <td className="px-2 py-1 text-right font-medium">
                                      {subtotal.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                      {subtotal >= 0 ? "Cr" : "Dr"}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700">
                          <tr
                            className={`font-bold ${
                              totalTraders >= 0
                                ? "text-gray-900 dark:text-white"
                                : "text-red-400"
                            }`}
                          >
                            <td className="px-2 py-1 sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                              Total
                            </td>
                            <td className="px-2 py-1 text-right">
                              {totalTraders.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-center">
                              {totalTraders <= 0 ? "Dr" : "Cr"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No records found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* <!-- Loans Payable --> */}
      <div className="col-span-1 sm:col-span-1 md:col-start-3 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white flex gap-2">
              <GiPayMoney />
              Loans Payable
            </h5>
            <button
              onClick={() => setLoansCollapsed(!loansCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              {loansCollapsed ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {!loansCollapsed && (
              <motion.div
                className="flow-root"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader rotate={true} className="dark:text-white" />
                  </div>
                ) : loansPayable?.length > 0 ? (
                  <div className="relative overflow-x-auto mt-4">
                    <div className="max-w-full overflow-x-auto">
                      <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          type="search"
                          className="w-full p-2 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Search account title..."
                          value={loansSearchTerm}
                          onChange={(e) => setLoansSearchTerm(e.target.value)}
                        />
                      </div>
                      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs table-fixed">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr className="text-gray-600 dark:text-gray-300 font-semibold">
                            <th className="px-2 py-1 text-left w-[50%] sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                              Account Title
                            </th>
                            <th className="px-2 py-1 text-right w-[40%]">
                              Balance
                            </th>
                            <th className="px-2 py-1 text-center w-[10%]">
                              Tag
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {Object.keys(filteredLoansPayable).map(
                            (parentTitle, groupIndex) => {
                              const items = filteredLoansPayable[parentTitle];
                              const subtotal = calculateSubtotal(items);

                              return (
                                <React.Fragment key={`group-${groupIndex}`}>
                                  {/* Parent Title Row */}
                                  <tr className="bg-gray-100 dark:bg-gray-600 font-semibold">
                                    <td
                                      colSpan="3"
                                      className="px-2 py-1 text-left sticky left-0 bg-gray-100 dark:bg-gray-600 z-10"
                                    >
                                      {parentTitle}
                                    </td>
                                  </tr>

                                  {/* Child Items */}
                                  {items.map((item, itemIndex) => (
                                    <tr
                                      key={`item-${groupIndex}-${itemIndex}`}
                                      className={`${
                                        item.Tag === "Dr"
                                          ? "text-red-400"
                                          : "text-gray-900 dark:text-white"
                                      }`}
                                    >
                                      <td className="px-2 py-1 break-words sticky left-0 bg-white dark:bg-gray-800 z-10 pl-4">
                                        {item.AccountTitle}
                                      </td>
                                      <td className="px-2 py-1 text-right">
                                        {Number(
                                          item.BalanceAmount
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                        })}
                                      </td>
                                      <td className="px-2 py-1 text-center">
                                        {item.Tag}
                                      </td>
                                    </tr>
                                  ))}

                                  {/* Subtotal Row */}
                                  <tr className="bg-gray-50 dark:bg-gray-700 italic text-sm">
                                    <td className="px-2 py-1 text-right sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                                      Subtotal
                                    </td>
                                    <td className="px-2 py-1 text-right font-medium">
                                      {subtotal.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                      })}
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                      {subtotal >= 0 ? "Cr" : "Dr"}
                                    </td>
                                  </tr>
                                </React.Fragment>
                              );
                            }
                          )}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700">
                          <tr
                            className={`font-bold  ${
                              totalLoans >= 0
                                ? "text-gray-900 dark:text-white"
                                : "text-red-400"
                            }`}
                          >
                            <td className="px-2 py-1 sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                              Total
                            </td>
                            <td className="px-2 py-1 text-right">
                              {totalLoans.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-center">
                              {totalLoans <= 0 ? "Dr" : "Cr"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No records found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PayableAndLoan;
