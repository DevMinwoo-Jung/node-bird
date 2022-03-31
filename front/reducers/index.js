import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";


export const logoutAction = (data) => {
  return {
    type: "LOG_OUT",
    data,
  };
};

// eslint-disable-next-line no-unused-vars
// const changeNickname = {
//   type: "CHNAGE_NICKNAME",
//   data: "minwooJjangJjangman",
// };

// async action creator

// action creator -> 동기적
const changeNickname = (data) => {
  return {
    type: "CHNAGE_NICKNAME",
    data,
  };
};
changeNickname("minwooGood");
// 이전상태, action => 다음 상태
const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log("HYDRATE", action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
