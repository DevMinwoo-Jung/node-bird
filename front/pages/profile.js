import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { END } from 'redux-saga';
import axios from 'axios';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import wrapper from '../store/configtureStore';
import { LOAD_POST_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const profile = () => {
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followersError } = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingsError } = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  const { me } = useSelector((state) => state.user);
  // 이 방법은 비효율적이다 계속해서 앞선 것 까지 불려오기 때문, 그래서 useSWRInfiniScroll? 아니면 offset과 limit을 사용해서 useEffect사용해서 concat으로

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  })

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  })

  if (followersError || followingsError) {
    console.error(followersError, followingsError);
    return <div>팔로잉/팔로워 로딩 중 에러가 발생했습니다.</div>;
  }

  if (!me) {
    return '내 정보 로딩 중....';
  }

  return (
    <>
      <Head>
        <title>내 프로필 | Node Bird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" onClickMore={loadMoreFollowings} data={followingsData} loading={!followingsData && !followingsError}/>
        <FollowList header="팔로워" onClickMore={loadMoreFollowers} data={followersData} loading={!followersData && !followersError}/>
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
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_POST_REQUEST
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
// 이게 있으면 이 먼저 실행 됨!
// 그리고 이게 HYDRATE로 감

export default profile;
