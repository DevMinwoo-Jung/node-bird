import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import { ADD_COMMENT_FAILURE, ADD_COMMENT_SUCCESS,
            ADD_POST_FAILURE, ADD_POST_SUCCESS,
            REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
            LOAD_POST_FAILURE, LOAD_POST_SUCCESS,
            LIKE_POST_FAILURE, LIKE_POST_SUCCESS,
            UNLIKE_POST_FAILURE, UNLIKE_POST_SUCCESS,
            ADD_POST_REQUEST, ADD_COMMENT_REQUEST,
            LOAD_POST_REQUEST, LIKE_POST_REQUEST,
            UNLIKE_POST_REQUEST, REMOVE_POST_REQUEST,
            UPLOAD_IMAGES_FAILURE, UPLOAD_IMAGES_REQUEST,
            UPLOAD_IMAGES_SUCCESS
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';
import shortid from 'shortid';

// function addPostAPI(data) {
//     return axios.post('/post', { content: data }) // 이렇게 해 주는게 req.body에 content에 접근 하려고 없으면 접근이 안될껄..?
// }                                                    formData는 이렇게 json으로 하면 안됨

function addPostAPI(data) {
    return axios.post('/post', data) // 이렇게 해 주는게 req.body에 content에 접근 하려고 없으면 접근이 안될껄..?
}

function* addPost(action) {
    try {
        console.log(action)
        const result = yield call(addPostAPI, action.data);
        yield put({
        type: ADD_POST_SUCCESS,
        data: result.data,
        });
        yield put({
        type: ADD_POST_TO_ME,
        data: result.data.id,
        });
    } catch (err) {
        console.error(err);
        yield put({
        type: ADD_POST_FAILURE,
        data: err.response.data,
        });
    }
}

function removePostAPI(data) {
    return axios.delete(`/post/${data}`)
}

function* removePost(action) {
    try {
        const result = yield call(removePostAPI, action.data)
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        });
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data,
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: REMOVE_POST_FAILURE,
            data: err.response.data
        })
    }
}

function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data) //post/commnet x /post/1/commnet 게시글 1번의 댓글이겠구나..!
}

function* addComment(action) {
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
        type: ADD_COMMENT_SUCCESS,
        data: result.data,
        });
    } catch (err) {
        console.log(err)
        yield put({
        type: ADD_COMMENT_FAILURE,
        data: err.response.data,
        });
    }
}

function likePostAPI(data) { // 게시물의 일부 수정이니 patch
    return axios.patch(`/post/${data}/like`) // data가 주소로 들어가니 넣을필요 없음
}

function* likePost(action) {
    console.log(action)
    try {
        const result = yield call(likePostAPI, action.data);
        yield put({
        type: LIKE_POST_SUCCESS,
        data: result.data,
        })
    } catch (err) {
        console.log(err)
        yield put({
        type: LIKE_POST_FAILURE,
        data: err.response.data,
        });
    }
}

function unlikeAPI(data) {
    return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
    try {
        const result = yield call(unlikeAPI, action.data);
        yield put({
        type: UNLIKE_POST_SUCCESS,
        data: result.data,
        })
    } catch (err) {
        console.log(err)
        yield put({
        type: UNLIKE_POST_FAILURE,
        data: err.response.data,
        });
    }
}

function loadPostAPI(data) {
    return axios.get(`/posts`, data)
}

function* loadPost(action) {
    try {
        const result = yield call(loadPostAPI, action.data);
        yield put({
        type: LOAD_POST_SUCCESS,
        data: result.data,
        })
    } catch (err) {
        console.log(err)
        yield put({
        type: LOAD_POST_FAILURE,
        data: err.response.data,
        });
    }
}

function uploadImagesAPI(data) {
    return axios.post(`/post/images`, data)
}

function* uploadImage(action) {
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
        type: UPLOAD_IMAGES_SUCCESS,
        data: result.data,
        })
    } catch (err) {
        console.log(err)
        yield put({
        type: UPLOAD_IMAGES_FAILURE,
        data: err.response.data,
        });
    }
}

function* watchAddPost() {
    yield takeLatest('ADD_POST_REQUEST', addPost)
}

function* watchCommentPost() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment)
}

function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost)
}

function* watchLoadPost() {
    yield takeLatest(LOAD_POST_REQUEST, loadPost)
}

function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost)
}

function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost)
}

function* watchUploadImagesPost() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImage)
}

export default function* rootSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchCommentPost),
        fork(watchRemovePost),
        fork(watchLoadPost),
        fork(watchLikePost),
        fork(watchUnlikePost),
        fork(watchUploadImagesPost),
    ])
}