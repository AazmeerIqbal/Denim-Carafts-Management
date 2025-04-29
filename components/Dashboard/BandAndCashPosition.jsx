import { Loader, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BandAndCashPosition = ({ isLoading, bankPositions, cashPositions }) => {
  const [bankCollapsed, setBankCollapsed] = useState(true);
  const [cashCollapsed, setCashCollapsed] = useState(true);

  const calculateTotal = (data) =>
    data.reduce((total, item) => total + Number(item.BalanceAmount || 0), 0);

  const totalBank = calculateTotal(bankPositions);
  const totalCash = calculateTotal(cashPositions);
  return (
    <>
      {/* <!-- Bank Status --> */}
      <div className="col-span-1 sm:col-span-1 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
              Bank Status
            </h5>
            <button
              onClick={() => setBankCollapsed(!bankCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              {bankCollapsed ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {!bankCollapsed && (
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
                ) : bankPositions.length > 0 ? (
                  <div className="relative overflow-x-auto mt-4">
                    <div className="max-w-full overflow-x-auto">
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
                          {bankPositions.map((bank, index) => (
                            <tr
                              key={index}
                              className={`${
                                bank.Tag === "Cr"
                                  ? "text-red-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              <td className="px-2 py-1 break-words sticky left-0 bg-white dark:bg-gray-800 z-10">
                                {bank.AccountTitle}
                              </td>
                              <td className="px-2 py-1 text-right">
                                {Number(bank.BalanceAmount).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="px-2 py-1 text-center">
                                {bank.Tag}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700">
                          <tr
                            className={`font-bold  ${
                              totalBank >= 0
                                ? "text-gray-900 dark:text-white"
                                : "text-red-400"
                            }`}
                          >
                            <td className="px-2 py-1 sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                              Total
                            </td>
                            <td className="px-2 py-1 text-right">
                              {totalBank.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-center">
                              {totalBank >= 0 ? "Dr" : "Cr"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No bank records found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* <!-- Cash In Hands --> */}
      <div className="col-span-1 sm:col-span-1 md:col-start-3 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
              Cash In Hands
            </h5>
            <button
              onClick={() => setCashCollapsed(!cashCollapsed)}
              className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              {cashCollapsed ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronUp size={20} />
              )}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {!cashCollapsed && (
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
                ) : cashPositions.length > 0 ? (
                  <div className="relative overflow-x-auto mt-4">
                    <div className="max-w-full overflow-x-auto">
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
                          {cashPositions.map((cash, index) => (
                            <tr
                              key={index}
                              className={`${
                                cash.Tag === "Cr"
                                  ? "text-red-400"
                                  : "text-gray-900 dark:text-white"
                              }`}
                            >
                              <td className="px-2 py-1 break-words sticky left-0 bg-white dark:bg-gray-800 z-10">
                                {cash.AccountTitle}
                              </td>
                              <td className="px-2 py-1 text-right">
                                {Number(cash.BalanceAmount).toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="px-2 py-1 text-center">
                                {cash.Tag}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-100 dark:bg-gray-700">
                          <tr
                            className={`font-bold  ${
                              totalCash >= 0
                                ? "text-gray-900 dark:text-white"
                                : "text-red-400"
                            }`}
                          >
                            <td className="px-2 py-1 sticky left-0 bg-gray-100 dark:bg-gray-700 z-10">
                              Total
                            </td>
                            <td className="px-2 py-1 text-right">
                              {totalCash.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="text-center">
                              {totalCash >= 0 ? "Dr" : "Cr"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No cash records found.
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

export default BandAndCashPosition;
