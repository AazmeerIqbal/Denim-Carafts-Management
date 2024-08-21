"use client";
import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  handleFirstPage,
  handlePrevPage,
  handleNextPage,
  handleLastPage,
}) => {
  return (
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
  );
};

export default Pagination;
