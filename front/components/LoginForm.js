/* eslint-disable react/prop-types */
import { Button, Form } from "antd";
import React, { useCallback, useState, useMemo } from "react";
import Link from "next/link";
import styled from "styled-components";
import PropTypes from "prop-types";

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLoggedIn(true);
  }, [id, password]);

  const style = useMemo(() => ({ marginTop: 10 }), []);
  // styled components 쓰기 싫을 때 이렇게!
  // onFinish는 preventdefault 적용되어있음!
  return (
    <FormWrapper onFinish={onSubmitForm}>
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
      <ButtonWrapper style={style}>
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
    </FormWrapper>
  );
};

LoginForm.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
};

export default LoginForm;
