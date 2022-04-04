import React from 'react';
import {Form} from "antd";

const CommentForm = ({ post }) => {
    return (
        <Form>
            {post}
        </Form>
    );
};

export default CommentForm;