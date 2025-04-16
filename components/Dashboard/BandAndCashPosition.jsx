import { Loader } from "lucide-react";
import React from "react";

const BandAndCashPosition = ({ isLoading, bankPositions, cashPositions }) => {
  const calculateTotal = (data) =>
    data.reduce((total, item) => total + Number(item.Balance || 0), 0);

  const totalBank = calculateTotal(bankPositions);
  const totalCash = calculateTotal(cashPositions);
  return (
    <>
      {/* <!-- Bank Status --> */}
      <div class="col-span-1 sm:col-span-1 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
              Bank Status
            </h5>
          </div>
          <div className="flow-root">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader rotate={true} />
              </div>
            ) : bankPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 md:text-sm text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-2 py-1 text-left text-gray-600 dark:text-gray-300 font-semibold">
                        Account Title
                      </th>
                      <th className="px-2 py-1 text-right text-gray-600 dark:text-gray-300 font-semibold">
                        Balance
                      </th>
                      <th className="px-2 py-1 text-center text-gray-600 dark:text-gray-300 font-semibold">
                        Tag
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bankPositions.map((bank, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1 text-gray-900 dark:text-white truncate max-w-xs">
                          {bank.AccountTitle}
                        </td>
                        <td className="px-2 py-1 text-right text-gray-900 dark:text-white">
                          {Number(bank.Balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-2 py-1 text-center text-gray-900 dark:text-white">
                          {bank.Tag}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <td
                        className="px-2 py-1 text-right font-bold text-gray-900 dark:text-white"
                        colSpan="2"
                      >
                        {totalBank.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                No bank records found.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <!-- Cash In Hands --> */}
      <div className="col-span-1 sm:col-span-1 md:col-start-3 md:col-span-2 md:row-span-2">
        <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
              Cash In Hands
            </h5>
          </div>
          <div className="flow-root">
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader rotate={true} />
              </div>
            ) : cashPositions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 md:text-sm text-xs">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-2 py-1 text-left text-gray-600 dark:text-gray-300 font-semibold">
                        Account Title
                      </th>
                      <th className="px-2 py-1 text-right text-gray-600 dark:text-gray-300 font-semibold">
                        Balance
                      </th>
                      <th className="px-2 py-1 text-center text-gray-600 dark:text-gray-300 font-semibold">
                        Tag
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cashPositions.map((cash, index) => (
                      <tr key={index}>
                        <td className="px-2 py-1 text-gray-900 dark:text-white truncate max-w-xs">
                          {cash.AccountTitle}
                        </td>
                        <td className="px-2 py-1 text-right text-gray-900 dark:text-white">
                          {Number(cash.Balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-2 py-1 text-center text-gray-900 dark:text-white">
                          {cash.Tag}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <td
                        className="px-2 py-1 text-right font-bold text-gray-900 dark:text-white"
                        colSpan="2"
                      >
                        {totalCash.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                No cash records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BandAndCashPosition;
