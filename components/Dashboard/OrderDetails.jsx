import React, { useState } from "react";
import { Loader, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetails = ({ isLoading, orderDetails }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="w-full p-4 sm:p-5 drop-shadow-2xl bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-bold leading-none text-gray-900 dark:text-white">
          Order Details
        </h5>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
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
            ) : orderDetails && orderDetails.length > 0 ? (
              <div className="relative overflow-x-auto mt-4">
                <div className="max-w-full overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 md:text-xs text-[0.50rem] table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr className="text-gray-600 dark:text-gray-300 font-semibold">
                        <th className="px-2 py-1 text-left sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">
                          Month
                        </th>
                        <th className="px-2 py-1 text-right">Order Qty</th>
                        <th className="px-2 py-1 text-right">Cutting Qty</th>
                        <th className="px-2 py-1 text-right">Shipped Qty</th>
                        <th className="px-2 py-1 text-right">Excess/Short</th>
                        <th className="px-2 py-1 text-right">Short/Access %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {orderDetails.map((item, index) => (
                        <tr
                          key={index}
                          className="text-gray-900 dark:text-white"
                        >
                          <td className="px-2 py-1 sticky left-0 bg-white dark:bg-gray-800 z-10">
                            {item.Month}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(item.OrderQty).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(item.CuttingQty).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(item.ShippedQty).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(item.ExcessOrShort).toLocaleString()}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {item.ShortOrAccessInPercentage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                No order details found.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetails;
