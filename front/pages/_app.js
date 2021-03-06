import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React from "React";
import Head from "next/head";
import wrapper from "../store/configtureStore";

const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Node Bird!</title>
      </Head>
      <Component />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
