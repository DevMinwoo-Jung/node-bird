import React, { useCallback } from 'react';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import useInput from '../hooks/useInput';
import { loginAction } from '../reducers/user';
import {Button, Form, Input} from "antd";

const LoginForm = () => {
    const dispatch = useDispatch();
    const [id, onChangeId] = useInput(null);
    const [password, onChangePassword] = useInput(null);




    const onSubmitForm = useCallback(() => {
        dispatch(loginAction({
            id,
            password,
        }));
    }, []);

    return (
        <Form onFinish={onSubmitForm} style={{ padding: '10px' }}>
            <div>
                <label htmlFor="user-id">아이디</label>
                <br />
                <Input value={id} onChange={onChangeId} required />
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input value={password} onChange={onChangePassword} type="password" required />
            </div>
            <div style={{ marginTop: '10px' }}>
                <Button type="primary" htmlType="submit" loading={false}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </div>
        </Form>
    );
};

export default LoginForm;