// dummy data
// 다른 정보랑 합치는 건 대문자로 시작한다. 근데 이건 취향이긴 함
export const initialState = {
  mainPosts: [{
    id: 1,
    User: {
      id: 1,
      nickname: '정민우',
    },
    content: 'gagagaga',
    Images: [{
      src: 'exex',
    }, {
      src: 'exex1',
    }, {
      src: 'exex2',
    }, {
      src: 'exex3',
    }],
    Comments: [{
      User: {
        nickname: 'minwoo',
      },
      content: 'wow',
    }, {
      User: {
        nickname: 'minw33oo',
      },
      content: 'wow44',
    }],
  }],
  imagePaths: [],
  postAdded: false,
}

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
}

const dummyPost = {
  id: 2,
  content: 'i am dummy',
  User: {
    id: 1,
    nickname: 'hahahoho',
  },
  Images: [],
  Comments: [],
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPost: [dummyPost, ...state.mainPosts], // 앞에다 추가해야 위로 올라가겠지??
        postAdded: true,
      }
    default:
      return state;
  }
};

export default reducer;
