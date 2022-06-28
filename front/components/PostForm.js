import React, {useCallback, useEffect, useRef } from 'react';
import {Button, Form, Input} from "antd";
import {useDispatch, useSelector} from "react-redux";
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from "../reducers/post";
import useInput from '../hooks/useInput';

const PostForm = () => {
    const imageInput = useRef()
    const dispatch = useDispatch()
    const { imagePaths, addPostLoading, addPostDone } = useSelector((state) => state.post);
    const [text, onChangeText, setText] = useInput('')

    const onClickImageUploads = useCallback(() => {
        imageInput.current.click()
    }, [imageInput.current])

    useEffect(() => {
        if (addPostDone) {
            setText('');
        }
    }, [addPostDone]);

    const onChangeImages = useCallback((e) => {
        console.log('images', e.target.files)
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f)
        })
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData
        })
    },[])

    const onSubmitForm = useCallback(() => {
        if (!text || !text.trim()) {
            return alert('게시글을 작성하세요.');
        }
        const formData = new FormData();
        imagePaths.forEach((p) => {
            formData.append('image', p);
        });
        formData.append('content', text);
        dispatch({
            type: ADD_POST_REQUEST,
            data: formData,
        });
    }, [text, imagePaths]);

    const onRemoveImage = useCallback((index) => () => {
        dispatch({
            type: REMOVE_IMAGE,
            data: index
        })
    })

    return (
        <Form style={{ margin: '10px 0 20px' }} name="image" encType="multipart/form-data" onFinish={onSubmitForm}>
        <Input.TextArea
            value={text}
            onChange={onChangeText}
            maxLength={140}
            placeholder="어떤 일이 있나요?"/>
        <div>
            <input type='file' multiple hidden ref={imageInput} onChange={onChangeImages}/>
            <Button onClick={onClickImageUploads}>이미지 업로드</Button>
            <Button type='primary' style={{float: 'right'}} htmlType='submit' loading={addPostLoading}>twit twit</Button>
        </div>
        <div>
            {imagePaths.map((v, i) => (<div key={v} style={{display: 'inline-block'}}>
                <img src={`http://localhost:3065/${v}`} style={{width: '200px'}} alt={v}/>
                <button onClick={onRemoveImage(i)}>제거</button>
            </div>))}
        </div>
    </Form>);
};

export default PostForm;