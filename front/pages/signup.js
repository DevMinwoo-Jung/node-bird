import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";

const signup = () => {
  return (
    <>
      <Head>
        <title>회원가입 Node Bird</title>
      </Head>
      <AppLayout>
        <div>회원가입</div>
      </AppLayout>
    </>
  );
};

export default signup;
