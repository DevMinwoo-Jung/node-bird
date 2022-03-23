/* eslint-disable no-unused-vars */
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  post: {
    mainPosts: [],
  },
};

export const loginAction = (data) => {
  return {
    type: "LOG_IN",
    data,
  };
};

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
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log(HYDRATE);
      return { ...state, ...action.payload };
    case "LOG_IN":
      return {
        ...state, // 이건 initialstate 객체 복사
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case "LOG_OUT":
      return {
        ...state, // 이건 initialstate 객체 복사
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
