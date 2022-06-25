import React, { useEffect } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button } from "antd";
import { useState, useCallback } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducers/user";
import Router from 'next/router'

const ErrorMessage = styled.div`
  color: red;
`;

const signup = () => {
  const dispatch = useDispatch()
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user)

  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [nickname, onChangeNickName] = useInput("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/') // 뒤로가기 했을 때 그 페이지 안나오기 하려면
    }
  },[me && me.id])

  useEffect(() => {
    if (signUpDone) {
      Router.push('/')
    }
  }, [signUpDone])

  useEffect(() => {
    if (signUpError) {
      alert(signUpError)
    }
  }, [signUpError])

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const [term, setTerm] = useState("");

  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  });

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log('여긴 됨!');
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname }
    });
  }, [email, password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-email">아이디</label>
          <br />
          <Input name="user-email" value={email} required onChange={onChangeEmail} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input name="user-nick" value={nickname} required onChange={onChangeNickName} />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && <div style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</div>}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>민우 말을 잘 들을 것을 동의합니다.</Checkbox>
          {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default signup;
