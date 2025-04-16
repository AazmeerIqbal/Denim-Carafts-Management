import Loader from "@/components/Loader";
import * as React from "react";
import { Suspense } from "react";

const Home = React.lazy(() => import("@/components/Home"));

const Page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
};

export default Page;
