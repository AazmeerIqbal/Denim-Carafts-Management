"use client";
import React from "react";
import { useStateContext } from "@/components/contexts/ContextProvider";
import { ImCross } from "react-icons/im";
import dayjs from "dayjs";

const JobCostReport = ({ setListDisplay, data, jobCostData, ReciptStatus }) => {
  const { currentColor } = useStateContext();

  const groupBySupplierName = (data) => {
    return data.reduce((result, item) => {
      const supplier = item.SupplierName || "Unknown Supplier"; // Default to handle cases where SupplierName is undefined
      if (!result[supplier]) {
        result[supplier] = [];
      }
      result[supplier].push(item);
      return result;
    }, {});
  };

  const groupedData = groupBySupplierName(ReciptStatus);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-150 md:mt-0 mt-24">
      <div
        className="w-[95%] h-[95vh] bg-white rounded-lg px-4 pt-5 pb-10 shadow-md overflow-scroll"
        style={{
          borderTop: `10px solid ${currentColor}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold inline-block">Job Cost Detail</h1>
          <div className="flex space-x-2">
            <button
              className="text-gray-500 hover:text-gray-900 transition duration-300"
              onClick={() => setListDisplay(false)}
            >
              <ImCross />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto mt-3 md:drop-shadow-xl">
          <table className="w-full border-collapse border-4 border-gray-500 text-left text-sm rounded-lg overflow-hidden">
            <tbody>
              <tr>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Job #
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].JobNo[0]}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  ID
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].CusOrderId}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Customer Name
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].CustomerName}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  PO Date
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {dayjs(data[0].PODate).format("DD-MM-YYYY")}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Customer PO #
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].CustomerPONo}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Other Detail
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].OtherDetail}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  PO Quantity
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].OrderQty}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Shipment Date
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {dayjs(data[0].ShipmentDate).format("DD-MM-YYYY")}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Main Category
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].Category}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Sub Category
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].CategoryDetHead}
                </td>
                <td className="px-6 py-3 font-bold text-white bg-gray-700 border border-gray-500">
                  Currency Code
                </td>
                <td className="px-6 py-3 font-semibold text-gray-100 bg-gray-600 border border-gray-500">
                  {data[0].CurrencyCode}
                </td>
                <td className="px-6 py-3 bg-gray-600 border border-gray-500"></td>
                <td className="px-6 py-3 bg-gray-600 border border-gray-500"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-auto mt-4">
          <table className="w-full border-collapse border border-gray-300 text-left text-xs">
            <tbody>
              <tr
                style={{
                  backgroundColor: `${currentColor}`,
                }}
              >
                <td className="px-2 py-1 text-white border border-gray-200">
                  #
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Style No
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Color
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Size From-To
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Rate
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Order Qty
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Assumed Con. CM
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Fabric Cutting Qty
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  F Actual Con. CM
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Lining Cutting Qty
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  L Actual Con. CM
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Shipped Qty
                </td>
                <td className="px-2 py-1 text-white border border-gray-200">
                  Shipped Qty %
                </td>
              </tr>
              {jobCostData.map((item, index) => (
                <tr key={index} className="">
                  <td className="px-2 py-1  border border-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.StyleNo}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.OrderColor}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.SizeFromTo}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.Rate}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.OrderQty}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.AsumedConsumption}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.FabricCuttingQty}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.FabricActualConsumptionInCM}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.LiningCuttingQty}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.LiningActualConsumptionInCM}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.ShippedQty}
                  </td>
                  <td className="px-2 py-1  border border-gray-300">
                    {item.ShippedPercentage}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                style={{
                  backgroundColor: `${currentColor}`,
                }}
              >
                <td
                  colSpan="5"
                  className="px-2 py-1 text-white border border-gray-300"
                >
                  Total
                </td>
                <td className="px-2 py-1 text-white border border-gray-300">
                  {jobCostData.reduce((acc, item) => acc + item.OrderQty, 0)}
                </td>
                <td className="px-2 py-1 text-white border border-gray-300"></td>
                <td className="px-2 py-1 text-white border border-gray-300">
                  {jobCostData.reduce(
                    (acc, item) => acc + item.FabricCuttingQty,
                    0
                  )}
                </td>
                <td className="px-2 py-1 text-white border border-gray-300"></td>
                <td className="px-2 py-1 text-white border border-gray-300">
                  {jobCostData.reduce(
                    (acc, item) => acc + item.LiningCuttingQty,
                    0
                  )}
                </td>
                <td className="px-2 py-1 text-white border border-gray-300"></td>
                <td className="px-2 py-1 text-white border border-gray-300">
                  {jobCostData.reduce((acc, item) => acc + item.ShippedQty, 0)}
                </td>
                <td className="px-2 py-1 text-white border border-gray-300"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="overflow-x-auto overflow-y-auto mt-4 max-h-[100%]">
          <table className="w-full table-auto border-collapse border border-gray-300 text-xs">
            <thead className=" sticky top-0 z-10">
              <tr
                style={{
                  backgroundColor: `${currentColor}`,
                }}
                className="text-white"
              >
                <th className="border border-gray-300 px-2 py-1">PO #</th>
                <th className="border border-gray-300 px-2 py-1">Item</th>
                <th className="border border-gray-300 px-2 py-1">Quantity</th>
                <th className="border border-gray-300 px-2 py-1">Rate</th>
                <th className="border border-gray-300 px-2 py-1">Amount</th>
                <th className="border border-gray-300 px-2 py-1">
                  Received Qty
                </th>
                <th className="border border-gray-300 px-2 py-1">
                  Received Amt
                </th>
                <th className="border border-gray-300 px-2 py-1">
                  Balance Qty
                </th>
                <th className="border border-gray-300 px-2 py-1">
                  Balance Amt
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedData).map((supplier, index) => {
                // Calculate the totals for the supplier
                const totals = groupedData[supplier].reduce(
                  (acc, item) => {
                    acc.Quantity += item.Qty || 0;
                    acc.Amount += item.Amount || 0;
                    acc.ReceivedQty += item.Received || 0;
                    acc.ReceivedAmt += item.ReceivedAmt || 0;
                    acc.BalanceQty += item.Balance || 0;
                    acc.BalanceAmt += item.BalanceAmt || 0;
                    return acc;
                  },
                  {
                    Quantity: 0,
                    Amount: 0,
                    ReceivedQty: 0,
                    ReceivedAmt: 0,
                    BalanceQty: 0,
                    BalanceAmt: 0,
                  }
                );

                return (
                  <React.Fragment key={index}>
                    {/* Supplier subheading */}
                    <tr>
                      <td
                        colSpan="9"
                        className="bg-blue-100 text-center font-bold border border-gray-300 py-2"
                      >
                        {supplier}
                      </td>
                    </tr>
                    {/* Rows for the supplier */}
                    {groupedData[supplier].map((item, itemIndex) => (
                      <tr key={itemIndex} className="border border-gray-300">
                        <td className="border border-gray-300 px-2 py-1">
                          {item.PONo}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.MerragedItem}/ {item.Description}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.Qty?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.Rate?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.Amount?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.Received?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.ReceivedAmt?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.Balance?.toLocaleString() ?? 0}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right">
                          {item.BalanceAmt?.toLocaleString() ?? 0}
                        </td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className=" bg-gray-200">
                      <td
                        colSpan="2"
                        className="border border-gray-300 px-2 py-1 text-center"
                      >
                        Total:
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.Quantity.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {/* You may choose to keep this blank or show the average rate */}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.Amount.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.ReceivedQty.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.ReceivedAmt.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.BalanceQty.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right">
                        {totals.BalanceAmt.toLocaleString()}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobCostReport;
