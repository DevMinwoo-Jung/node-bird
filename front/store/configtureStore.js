import { createWrapper } from "next-redux-wrapper";

const configtureStore = () => {};

const wrapper = createWrapper(configtureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
