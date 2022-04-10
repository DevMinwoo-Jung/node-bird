import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Form, Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {addPost} from "../reducers/post";

const PostForm = () => {
    const imageInput = useRef()
    const dispatch = useDispatch()
    const {imagePaths, postAdded} = useSelector(state => state.post)
    const [text, setText] = useState('')

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click()
    }, [imageInput.current])

    const onChangeText = useCallback((e) => {
        setText(e.target.value)
    }, [])

    useEffect(() => {
        if (postAdded) {
            setText('');
        }
    }, [postAdded]);

    const onSubmit = useCallback(() => {
        dispatch(addPost)
    }, [])


    return (
        <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
        <Input.TextArea
            value={text}
            onChange={onChangeText}
            maxLength={140}
            placeholder="어떤 일이 있나요?"/>
        <div>
            <input type='file' multiple hidden ref={imageInput}/>
            <Button onClick={onClickImageUpload}>이미지 업로드</Button>
            <Button type='primary' style={{float: 'right'}} htmlType='submit'>twit twit</Button>
        </div>
        <div>
            {imagePaths.map((v) => (<div key={v} style={{display: 'inline-block'}}>
                <img src={v} style={{width: '200px'}} alt={v}/>
                <div>제거</div>
            </div>))}
        </div>
    </Form>);
};

export default PostForm;