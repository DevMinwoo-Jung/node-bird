import { all, fork, put, takeLatest, delay, call } from 'redux-saga/effects'
import axios from 'axios'
import { LOG_IN_REQUEST , LOG_IN_SUCCESS, LOG_IN_FAILURE, 
    LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, 
    SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, FOLLOW_REQUEST,
    UNFOLLOW_FAILURE, UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS,
    FOLLOW_FAILURE, FOLLOW_SUCCESS, LOAD_MY_INFO_REQUEST,
    LOAD_MY_INFO_FAILURE, LOAD_MY_INFO_SUCCESS, CHANGE_NICKNAME_FAILURE,
    CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_REQUEST, LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE,  LOAD_FOLLOWINGS_REQUEST,
    LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWINGS_SUCCESS, REMOVE_FOLLOWER_REQUEST,
    REMOVE_FOLLOWER_FAILURE, REMOVE_FOLLOWER_SUCCESS, LOAD_USER_FAILURE, 
    LOAD_USER_REQUEST, LOAD_USER_SUCCESS

} from '../reducers/user' 

function loginAPI(data) {
    return axios.post('/user/login', data)
    // indexjs 에서 baseURL을 설정해줘서 앞으로는 주소를 안써줘도 된다
}

// 특이하다 loginAPI(action.data, a, b, c) 이 형식이 call쓰면 아래처럼 됨
function* login(action) {
    try {
        console.log(action.data)
        const result = yield call(loginAPI, action.data)
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LOG_IN_FAILURE,
            data: err.response.data,
        })
    }
}

function followAPI(data) {
    return axios.patch(`user/${data}/follow`)
}

// 특이하다 loginAPI(action.data, a, b, c) 이 형식이 call쓰면 아래처럼 됨
function* follow(action) {
    try {
//        yield delay(1000) // 비동기적 효과 주려공 
        const result = yield call(followAPI, action.data);
        yield put({
            type: FOLLOW_SUCCESS,
            data: result.data
        });
    } catch (err) {
        yield put({
            type: FOLLOW_FAILURE,
            data: err.response.data
        })
    }
}

function unFollowAPI(data) {
    return axios.delete(`/user/${data}/follow`)
}

// 특이하다 loginAPI(action.data, a, b, c) 이 형식이 call쓰면 아래처럼 됨
function* unFollow(action) {
    try {
        const result = yield call(unFollowAPI, action.data);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data
        });
    } catch (err) {
        yield put({
            type: UNFOLLOW_FAILURE,
            data: err.response.data
        })
    }
}

function logoutAPI() {
    return axios.post('/user/logout')
}

function* logout() {
    try {
        yield call(logoutAPI);
        yield put({
            type: LOG_OUT_SUCCESS,
        });
    } catch (err) {
        console.log(err);
        yield put({
            type: LOG_OUT_FAILURE,
            error: err.response.data
        })
    }
}

function signUpAPI(data) {
    console.log(data)
    return axios.post(`/user`, data) // signUp에서 시작한 것이 email, password, nickname이 들어가있다!!
}

function* signUp(action) {
    try {
        const result = yield call(signUpAPI, action.data);
        yield put({
            type: SIGN_UP_SUCCESS,
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data
        })
    }
}

function loadUserAPI(data) {
    return axios.get(`/user/${data}`) // 쿠키라 데이터가 없데..
}

function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type: LOAD_USER_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: LOAD_USER_FAILURE,
            error: err.response.data
        })
    }
}

function loadMyInfoAPI() {
    return axios.get('/user') // 쿠키라 데이터가 없데..
}

function* loadMyInfo() {
    try {
        const result = yield call(loadMyInfoAPI);
        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: err.response.data
        })
    }
}

function changeNickNameAPI(data) {
    return axios.patch(`/user/nickname`, { nickname: data }) // 쿠키라 데이터가 없데..
}

function* changeNickName(action) {
    try {
        const result = yield call(changeNickNameAPI, action.data);
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error: err.response.data
        })
    }
}

function loadFollowersAPI(data) {
    return axios.get(`/user/followers`, { nickname: data }) // 쿠키라 데이터가 없데..
}

function* loadFollowers(action) {
    try {
        const result = yield call(loadFollowersAPI, action.data);
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: err.response.data
        })
    }
}

function loadFollwingsAPI(data) {
    return axios.get(`/user/followings`, { nickname: data }) // 쿠키라 데이터가 없데..
}

function* loadFollwings(action) {
    try {
        const result = yield call(loadFollwingsAPI, action.data);
        yield put({
            type: LOAD_FOLLOWINGS_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: err.response.data
        })
    }
}


function removeFollowersAPI(data) {
    return axios.delete(`/user/follower/${data}`, data) // 쿠키라 데이터가 없데..
}

function* removeFollowers(action) {
    try {
        const result = yield call(removeFollowersAPI, action.data);
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data
        });
    } catch (err) {
        console.log(err)
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: err.response.data
        })
    }
}

function* watchLogin() {
    yield takeLatest(LOG_IN_REQUEST, login)
}

function* watchLogout() {
    yield takeLatest(LOG_OUT_REQUEST, logout)
}

function* watchSigUp() {
    yield takeLatest(SIGN_UP_REQUEST, signUp)
}

function* watchFollow() {
    yield takeLatest(FOLLOW_REQUEST, follow)
}

function* watchUnFollow() {
    yield takeLatest(UNFOLLOW_REQUEST, unFollow)
}

function* watchMyInfo() {
    yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo)
}

function* watchChangeNicknamePost() {
    yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickName)
}

function* watchLoadFollowingsPost() {
    yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollwings)
}

function* watchLoadFollowersPost() {
    yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers)
}

function* watchRemoveFollower() {
    yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollowers)
}

function* watchLoadUser() {
    yield takeLatest(LOAD_USER_REQUEST, loadUser)
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
        fork(watchFollow),
        fork(watchUnFollow),
        fork(watchSigUp),
        fork(watchMyInfo),
        fork(watchLoadUser),
        fork(watchChangeNicknamePost),
        fork(watchLoadFollowingsPost),
        fork(watchLoadFollowersPost),
        fork(watchRemoveFollower),
    ])
}