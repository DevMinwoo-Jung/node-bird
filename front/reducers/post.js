import shortid from 'shortid'
import produce from 'immer'
import faker from 'faker'

export const initialState = {
  mainPosts: [],
  imagePaths: [],
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unLikePostLoading: false,
  unLikePostDone: false,
  unLikePostError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  hasMorePost: true,
};

const dummy = {
  id: 1,
  User: {
    id: 1,
    nickname: '제로초',
  },
  content: '첫 번째 게시글 #되니',
  Images: [{
    id: shortid.generate(),
    src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
  }, {
    id: shortid.generate(),
    src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
  }, {
    id: shortid.generate(),
    src: 'https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg',
  }],
  Comments: [{
    id: shortid.generate(),
    User: {
      id: shortid.generate(),
      nickname: 'nero',
    },
    content: '우와 개정판이 나왔군요~',
  }, {
    id: shortid.generate(),
    User: {
      id: shortid.generate(),
      nickname: 'hero',
    },
    content: '얼른 사고싶어요~',
  }]
}

export const generateDummyPost = (number) => Array(number).fill().map(() => ({
  id: shortid.generate(),
  User: {
    id: shortid.generate(),
    nickname: faker.name.findName(),
  },
  content: faker.lorem.paragraph(),
  Images: [{
    src: faker.image.image(),
  }],
  Comments: [{
    User: {
      id: shortid.generate(),
      nickname: faker.name.findName(),
    },
    content: faker.lorem.sentence(),
  }],
}));

// initialState.mainPosts = initialState.mainPosts.concat(
//   Array(20).fill().map(() => ({
//     id: shortid.generate(),
//     User: {
//       id: shortid.generate(),
//       nickname: faker.name.findName(),
//     },
//     content: faker.lorem.paragraph(),
//     Images: [{
//       src: faker.image.image(),
//     }],
//     Comments: [{
//       User: {
//         id: shortid.generate(),
//         nickname: faker.name.findName(),
//       },
//       content: faker.lorem.sentence(),
//     }],
//   }))  
// )

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST'
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS'
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE'

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST'
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS'
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE'

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST'
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS'
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE'

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST'
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS'
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE'

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST'
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS'
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE'

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST'
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS'
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE'

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data: data
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data
});

const dummyPost = (data) => ({
  id: data.id,
  content: data.content,
  User: {
    id: 1,
    nickname: '제로초',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortid.generate(),
  content: data,
  User: {
    id: 1,
    nickname: '제로초',
  },
})
// reducer 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성을 지키면서)
// 근데 immer를 사용하면 알아서 불변성을 지키면서 만들어준다. state는 건들면 안되고 draft를 건들어야한다.
export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LIKE_POST_REQUEST:
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
        break;
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      }
      case LIKE_POST_FAILURE:
        draft.likePostLoading = false;
        draft.likePostError = action.error;
        break;
      case UNLIKE_POST_REQUEST:
        draft.unLikePostLoading = true;
        draft.unLikePostDone = false;
        draft.unLikePostError = null;
        break;
      case UNLIKE_POST_SUCCESS:{
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unLikePostLoading = false;
        draft.unLikePostDone = true;
        break;
      }
      case UNLIKE_POST_FAILURE:
        draft.unLikePostLoading = false;
        draft.unLikePostError = action.error;
        break;   
      case LOAD_POST_REQUEST:
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
        break;
      case LOAD_POST_SUCCESS:
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.data);
        draft.hasMorePost = action.data.length === 10;
        break;
      case LOAD_POST_FAILURE:
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
        break;
      case ADD_POST_REQUEST: 
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS: 
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = [];
        break;
      case ADD_POST_FAILURE: 
        draft.addPostLoading = false;
        draft.addPostError = action.error
        break;
      case REMOVE_POST_REQUEST: 
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS: 
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data)
        break;
      case REMOVE_POST_FAILURE: 
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      case ADD_COMMENT_REQUEST: 
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: 
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data)
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
        // const postIndex = state.mainPosts.findIndex((v) => v.id  === action.data.postId)
        // const post = state.mainPosts[postIndex]
        // post.Comments = [dummyComment(action.data.content), ...post.Comments]
        // const mainPosts = [...state.mainPosts]
        // mainPosts[postIndex] = post
        // return 
        //   ...state,
        //   addCommentLoading: false,
        //   addCommentDone: true
        //;
      case ADD_COMMENT_FAILURE: 
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default: {
        break;
      }
    }
  }) 
};