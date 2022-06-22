import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import {useSelector} from "react-redux";
import Router from 'next/router'

const profile = () => {
  const { me } = useSelector(state => state.user);

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
        <FollowList header="팔로잉 목록" data={me.Follwings} />
        <FollowList header="팔로워 목록" data={me.Follwers} />
      </AppLayout>
    </>
  );
};

export default profile;
