import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";

const profile = () => {
  return (
    <>
      <Head>
        <title>내 프로필 Node Bird</title>
      </Head>
      <AppLayout>
        <div>내 프로필</div>;
      </AppLayout>
    </>
  );
};

export default profile;
