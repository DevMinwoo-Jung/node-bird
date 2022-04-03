import React, {useCallback, useState} from 'react';
import {Button, Card, Popover} from "antd";
import PropTypes from "prop-types";
import {HeartOutlined, RetweetOutlined, MessageOutlined, EllipsisOutlined, HeartTwoTone} from "@ant-design/icons";
import {useSelector} from "react-redux";
import PostImages from "./PostImages";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const onToggleLike = useCallback(() => {
        setLiked((prev) => !prev);
    }, [])
    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
    }, [])

//    const { id } = useSelector((state) => state.user.me?.id);
    // 이건 아래와 같다
    const { me } = useSelector((state) => state.user);
    const id = me && me.id;



    return (
        <div stlye={{marginBottom: 50}}>
            <Card
                cover={<PostImages/>}
                actions={[
                    <RetweetOutlined key="retwwet"/>,
                     liked
                        ? <HeartOutlined key="heart" onClick={onToggleComment}/>
                        : <HeartTwoTone key="heart" onClick={onToggleLike}/>,
                    <MessageOutlined key="comment"/>,
                    <Popover key="more" content={(
                        <Button.Group>
                            {
                                id && post.User.id === id
                                    ? (
                                    <>
                                        <Button>수정</Button>
                                        <Button type='danger'>삭제</Button>
                                    </>

                                ): <Button>신고</Button>
                            }
                        </Button.Group>
                    )}>
                    <EllipsisOutlined/>
                    </Popover>
                ]}
                >
                <Card.Meta>
                    avatar
                    title={post.User.nickname}
                    description={post.content}
                </Card.Meta>
            </Card>
            {commentFormOpened && (<div>
                댓글 부분...
            </div>)}
        </div>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number,
        User: PropTypes.object,
        content: PropTypes.string,
        createAt: PropTypes.object,
        Comments: PropTypes.arrayOf(PropTypes.object),
        Images: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
};

export default PostCard;