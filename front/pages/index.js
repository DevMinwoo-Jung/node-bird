import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import {useDispatch, useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

const Home = () => {
    const { me } = useSelector((state) => state.user)
    const { mainPosts, hasMorePost, loadPostsLoading, retweetPostError } = useSelector((state) => state.post)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: LOAD_MY_INFO_REQUEST
        })
        dispatch({
            type: LOAD_POST_REQUEST
        })
    }, [])

    useEffect(() => {
        if (retweetPostError) {
            alert(retweetPostError)
        }
    }, [retweetPostError])

    useEffect(() => {
        function onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePost && !loadPostsLoading) {
                    dispatch({
                type: LOAD_POST_REQUEST,
                data: mainPosts[mainPosts.length - 1].id,
                    });
                }
            }
        }
        window.addEventListener('scroll', onScroll);
            return () => {
                window.removeEventListener('scroll', onScroll);
            };
        }, [mainPosts, hasMorePost, loadPostsLoading]);

    return (
        <AppLayout>
            {
                me && <PostForm />
            }
            {
                mainPosts.map((c) => {
                    return (
                        <PostCard key={c.id} post={c} />
                    );
                })
            }
        </AppLayout>
    );
}; 
export default Home;
