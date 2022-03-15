import { Button, Form } from "antd";
import React, { useCallback, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const LoginForm = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  return (
    <Form>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <input
          name="user-id"
          value={id}
          onChange={onChangeId}
          type="text"
          required
        />
      </div>
      <div>
        <label htmlFor="user-id">비밀번호</label>
        <br />
        <input
          name="user-password"
          value={password}
          onChange={onChangePassword}
          type="text"
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
      <div></div>
    </Form>
  );
};

export default LoginForm;
