// components/DynamicHead.jsx
"use client";

import Head from "next/head";
import { useSession } from "next-auth/react";

const DynamicHead = () => {
  const { data: session } = useSession();
  const companyName = session?.user?.companyName;

  const imagePath =
    companyName === "AHDenim"
      ? "assets/AHDenimLogo.png"
      : "assets/DC_logo_noBg.png";

  return (
    <Head>
      <title>{companyName}</title>
      <link rel="icon" type="image/x-icon" href={imagePath} />
    </Head>
  );
};

export default DynamicHead;
