import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Avatar, Popover, List, Comment } from 'antd';
import PropTypes from 'prop-types';
import { RetweetOutlined, HeartTwoTone, HeartOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import PostImages from './PostImages';
import FollowButton from './FollowButton';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_POST_REQUEST } from '../reducers/post';

const CardWrapper = styled.div`
    margin-bottom: 20px;
`;

moment.locale('ko');

const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me && state.user.me.id);
    const dispatch = useDispatch();
    const { removePostLoading, retweetError } = useSelector((state) => state.post);
    console.log(post)

    const onLike = useCallback(() => {
        dispatch({
            type: LIKE_POST_REQUEST,
            data: post.id,
        })
    }, []);

    const onUnlike = useCallback(() => {
        dispatch({
            type: UNLIKE_POST_REQUEST,
            data: post.id
        })
    }, []);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, []);

    const onRemovePost = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요해요')
        }
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: post.id,
        })
    }, [id]) 

    const liked = post.Likers.find((v) => v.id === id);
    
    const onRetweet = useCallback(() => {
        dispatch({
            type: RETWEET_POST_REQUEST,
            data: post.id,
        })
    }, [])

    return (
        <CardWrapper key={post.id}>
            <Card
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <RetweetOutlined key="retweet" onClick={onRetweet}/>,
                    liked
                        ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} />
                        : <HeartOutlined key="heart" onClick={onLike} />,
                    <MessageOutlined key="message" onClick={onToggleComment} />,
                    <Popover
                        key="ellipsis"
                        content={(
                            <Button.Group>
                                {id && post.User.id === id
                                    ? (
                                        <>
                                            <Button>수정</Button>
                                            <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>삭제</Button>
                                        </>
                                    )
                                    : <Button>신고</Button>}
                            </Button.Group>
                        )}
                    >
                        <EllipsisOutlined />
                    </Popover>,
                ]}
                title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
                extra={id && <FollowButton post={post} />}
            >
                {
                    post.RetweetId && post.Retweet
                    ? (
                        <Card
                        cover={post.Retweet[0] && <PostImages images={post.Retweet.Images} />}
                        >
                        <div style={{ float: 'right'}}>
                            {moment(post.createdAt).format('YYYY.MM.DD')}
                            <br/>
                            {moment(post.createdAt).endOf('day').fromNow()} 
                            {/* new Date().getFullYear() + new Date().getMonth() ..... 를 안해줘도 된다*/}
                        </div>
                        <Card.Meta
                        avatar={
                        <Link href={`/user/${post.Retweet.User.id}`}>
                            <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                        </Link>}
                        title={post.Retweet.User.nickname}
                        description={<PostCardContent postData={post.Retweet.content} />}
                        />
                        </Card>
                    )
                        : (
                        <>
                        <div style={{ float: 'right'}}>
                            {moment(post.createdAt).format('YYYY.MM.DD')}
                            <br/>
                            {moment(post.createdAt).endOf('day').fromNow()} 
                            {/* new Date().getFullYear() + new Date().getMonth() ..... 를 안해줘도 된다*/}
                        </div>
                        <Card.Meta
                        avatar={
                            <Link href={`/user/${post.User.id}`}>
                                <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                            </Link>}
                        title={post.User.nickname}
                        description={<PostCardContent postData={post.content} />}
                        />
                        </>    
                    )
                }
            </Card>
            {commentFormOpened && (
                <>
                    <CommentForm post={post} />
                    <List 
                        header={`${post.Comments.length} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={
                                        <Link href={`/user/${item.User.id}`}>
                                            <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                                        </Link>
                                        }
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </>
            )}
        </CardWrapper>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        UserId: PropTypes.number,
        content: PropTypes.string,
        createdAt: PropTypes.string,
        Comments: PropTypes.arrayOf(PropTypes.any),
        Images: PropTypes.arrayOf(PropTypes.any),
        Likers: PropTypes.arrayOf(PropTypes.any),
        RetweetId: PropTypes.number,
        Retweet: PropTypes.objectOf(PropTypes.any)
        }).isRequired,
    };
    

export default PostCard;