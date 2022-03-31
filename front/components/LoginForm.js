import { Button, Form } from "antd";
import React, {useCallback, useMemo} from "react";
import Link from "next/link";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import useInput from "../hooks/useInput";

import { loginAction } from "../reducers/user";


const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {


  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();

  const onSubmitForm = useCallback(() => {
    dispatch(loginAction({
      id,
      password,
    }));
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
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <input
          name="user-password"
          value={password}
          onChange={onChangePassword}
          type="password"
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
    </FormWrapper>
  );
};

export default LoginForm;
