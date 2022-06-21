import { all, fork, put, takeLatest, delay } from 'redux-saga/effects'
import { axios } from 'axios'
import { LOG_IN_SUCCESS, LOG_IN_FAILURE } from '../reducers/user' 


function loginAPI() {
    return axios.post('/api/login')
}


// 특이하다 loginAPI(action.data, a, b, c) 이 형식이 call쓰면 아래처럼 됨
function* login(action) {
    try {
        console.log('saga')
        yield delay(1000) // 비동기적 효과 주려공
        // const result = yield call(loginAPI, action.data)
        yield put({
            type: LOG_IN_SUCCESS,
            data: action.data
        });
    } catch (err) {
        yield put({
            type: LOG_IN_FAILURE,
            data: err.response.data
        })
    }
}

function logoutAPI() {
    return axios.post('/api/logout')
}

function* logout() {
    try {
        yield delay(1000)
        // const result = yield call(logoutAPI)
        yield put({
            type: 'LOG_OUT_SUCCESS',
        });
    } catch (err) {
        yield put({
            type: 'LOG_OUT_FAILURE',
            data: err.response.data
        })
    }
}

function* watchLogin() {
    yield takeLatest('LOG_IN_REQUEST', login)
}

function* watchLogout() {
    yield takeLatest('LOG_OUT_REQUEST', logout)
}

export default function* userSaga() {
    yield all([
        fork(watchLogin),
        fork(watchLogout),
    ])
}