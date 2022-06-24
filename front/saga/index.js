import { all, fork } from 'redux-saga/effects'
import acios from 'axios';

import postSaga from './post'
import userSaga from './user'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3065'

export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(postSaga)
    ])
}