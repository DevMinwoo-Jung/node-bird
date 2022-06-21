// import { all, fork, put, throttle, delay } from 'redux-saga/effects'
// import { axios } from 'axios'

// function addPostAPI() {
//     return axios.post('/api/post')
// }

// function* addPost() {
//     try {
//         yield delay(1000)
//         // const result = yield call(addPostAPI)
//         yield put({
//             type: 'ADD_POST_SUCCESS',
//         //    data: result.data
//         });
//     } catch (err) {
//         yield put({
//             type: 'ADD_POST_FAILURE',
//         //    data: err.response.data
//         })
//     }
// }

// function* watchAddPost() {
//     yield throttle('ADD_POST_REQUEST', addPost, 2000)
// }

// export default function* rootSaga() {
//     yield all([
//         fork(watchAddPost),
//     ])
// }