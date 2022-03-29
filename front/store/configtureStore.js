import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import reducer from "../reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const configtureStore = () => {
  const middlewares = [];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));

  const stroe = createStore(reducer, enhancer);
  stroe.dispatch({
    type: "CHANGE_NICKNAME",
    data: "is it working??",
  });
  return stroe;
};

const wrapper = createWrapper(configtureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
