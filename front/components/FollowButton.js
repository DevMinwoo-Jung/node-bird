import React, { useCallback } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
    const { me, followLoading, unfollowLoading } = useSelector((state) => state.user);
    const isFollow = me?.Followings.find((v) => v.id === post.User.id) 
    const dispatch = useDispatch()

    const onClickButton = useCallback(() => {
        if (isFollow) {
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id
            })
        } else {
            dispatch({
                type: FOLLOW_REQUEST,
                data: post.User.id,
            })
        }
    }, [isFollow])

    if (post.User.id === me.id) {
        return null
    }

    return <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>{ isFollow ? 'unFollow' : 'follow' }</Button>;
};

FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
};

export default FollowButton;