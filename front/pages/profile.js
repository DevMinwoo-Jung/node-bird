import React, {useEffect} from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import {useSelector} from "react-redux";
import Router from "next/router";

const profile = () => {
  const { isLoggedIn } = useSelector(state => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      Router.replace('/');
    }
  }, [isLoggedIn])

  const follwerList = [
    { nickname: "민우" },
    { nickname: "민우정" },
    { nickname: "정민우" },
  ];
  const follwingList = [
    { nickname: "민우" },
    { nickname: "민우정" },
    { nickname: "정민우" },
  ];

  return (
    <>
      <Head>
        <title>내 프로필 Node Bird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={follwingList} />
        <FollowList header="팔로워 목록" data={follwerList} />
      </AppLayout>
    </>
  );
};

export default profile;
