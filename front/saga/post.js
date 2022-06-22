import { all, fork, put, delay, takeLatest } from 'redux-saga/effects'
import { axios } from 'axios'
import { ADD_COMMENT_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS,
            ADD_POST_FAILURE, ADD_POST_REQUEST, ADD_POST_SUCCESS,
            REMOVE_POST_SUCCESS, REMOVE_POST_FAILURE,
            LOAD_POST_FAILURE, LOAD_POST_SUCCESS, LOAD_POST_REQUEST, generateDummyPost
} from '../reducers/post'
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user'
import shortid from 'shortid'

function addPostAPI() {
    return axios.post('/api/post')
}

function* addPost(action) {
    try {
      // const result = yield call(addPostAPI, action.data);
        yield delay(1000);
        const id = shortid.generate();
        yield put({
        type: ADD_POST_SUCCESS,
        data: {
            id,
            content: action.data,
        },
        });
        yield put({
        type: ADD_POST_TO_ME,
        data: id,
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
    return axios.delete('/api/post', data)
}

function* removePost(action) {
    try {
        yield delay(1000)
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: action.data,
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
    return axios.post(`/api/post/${data.postId}/comment`, data)
}

function* addComment(action) {
    try {
      // const result = yield call(addCommentAPI, action.data);
        yield delay(1000);
        yield put({
        type: ADD_COMMENT_SUCCESS,
        data: action.data,
        });
    } catch (err) {
        yield put({
        type: ADD_COMMENT_FAILURE,
        data: err.response.data,
        });
    }
}

function loadPostAPI(data) {
    return axios.post(`/api/post/${data.postId}/comment`, data)
}

function* loadPost(action) {
    try {
        const id = shortid.generate();
      // const result = yield call(loadPostAPI, action.data);
        yield delay(1000);
        yield put({
        type: LOAD_POST_SUCCESS,
        data: generateDummyPost(10),
        })
    } catch (err) {
        console.log(err)
        yield put({
        type: LOAD_POST_FAILURE,
        data: err.response.data,
        });
    }
}

function* watchAddPost() {
    yield takeLatest('ADD_POST_REQUEST', addPost)
}

function* watchCommentPost() {
    yield takeLatest('ADD_COMMENT_REQUEST', addComment)
}

function* watchRemovePost() {
    yield takeLatest('REMOVE_POST_REQUEST', removePost)
}

function* watchLoadPost() {
    yield takeLatest('LOAD_POST_REQUEST', loadPost)
}

export default function* rootSaga() {
    yield all([
        fork(watchAddPost),
        fork(watchCommentPost),
        fork(watchRemovePost),
        fork(watchLoadPost),
    ])
}