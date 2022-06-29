import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import {useDispatch, useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { LOAD_POSTS_REQUEST } from "../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configtureStore";
import { END } from "redux-saga";
import axios from "axios";

const Home = () => {
    const { me } = useSelector((state) => state.user)
    const { mainPosts, hasMorePost, loadPostsLoading, retweetPostError } = useSelector((state) => state.post)

    const dispatch = useDispatch()

    useEffect(() => {
        if (retweetPostError) {
            alert(retweetPostError)
        }
    }, [retweetPostError])

    useEffect(() => {
        function onScroll() {
            if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePost && !loadPostsLoading) {
                    const lastId = mainPosts[mainPosts.length - 1]?.id;
                    dispatch({
                type: LOAD_POSTS_REQUEST,
                lastId,
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

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    console.log(context);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; // 쿠키 공유 방지
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie; /// 서버에 쿠키 전달! 
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    })
    context.store.dispatch({
        type: LOAD_POSTS_REQUEST
    })
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});
// 이게 있으면 이 먼저 실행 됨!
// 그리고 이게 HYDRATE로 감

export default Home;
