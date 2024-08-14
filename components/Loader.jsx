import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500"></div>
      <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
    </div>
  );
};

export default Loader;
