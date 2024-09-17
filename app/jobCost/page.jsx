import React from "react";
import { MdOutlineSummarize } from "react-icons/md";

const page = () => {
  return (
    <div className="m-2 md:m-8 mt-24 p-2 md:p-10 bg-white rounded-3xl drop-shadow-xl">
      <div className="flex items-center gap-4">
        <MdOutlineSummarize className="text-3xl" />
        <p className="text-3xl font-extrabold tracking-tight text-slate-900">
          Job Cost
        </p>
      </div>
      <div className="overflow-x-auto"></div>
    </div>
  );
};

export default page;
