import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import {useDispatch, useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POST_REQUEST } from "../reducers/post";

const Home = () => {
    const { me } = useSelector((state) => state.user)
    const { mainPosts, hasMorePost, loadPostsLoading } = useSelector((state) => state.post)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type: LOAD_POST_REQUEST
        })
    }, [])

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
