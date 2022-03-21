import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button } from "antd";
import { useState, useCallback } from "react";
import useInput from "../hooks/useInput";
import styled from "styled-components";

const ErrorMessage = styled.div`
  color: red;
`;

const signup = () => {
  const [id, onChangeId] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [nickname, onChangeNickName] = useInput("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

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
    console.log(password, passwordCheck, term);
  }, [password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 Node Bird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nickname}
            required
            onChange={onChangeNickName}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-nick"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호 확인</label>
          <br />
          <Input
            name="user-password"
            value={password}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <ErrorMessage>비밀번호가 일치하지 않습니다</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            민우 말을 잘 들을 것으 동의합니까
          </Checkbox>
          {termError && <ErrorMessage>약관에 동의하세요?</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlFor="submit">
            제출
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default signup;
