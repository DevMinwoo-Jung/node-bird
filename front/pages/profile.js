import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST } from '../reducers/user';
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import Router from 'next/router'
import wrapper from "../store/configtureStore";
import { END } from "redux-saga";
import axios from "axios";

const profile = () => {
  const { me } = useSelector(state => state.user);
  console.log(me)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    })
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    })
  }, [])

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/')
    }
  },[me && me.id])

  if(!me) {
    return null;
  }



  return (
    <>
      <Head>
        <title>내 프로필 Node Bird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={me.Followings} />
        <FollowList header="팔로워" data={me.Followers} />
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log(context);
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // 쿠키 공유 방지
  if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie; /// 서버에 쿠키 전달! 
  }
  context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST
  })
  context.store.dispatch({
      type: LOAD_POST_REQUEST
  })
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
// 이게 있으면 이 먼저 실행 됨!
// 그리고 이게 HYDRATE로 감

export default profile;
