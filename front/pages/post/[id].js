import { LOAD_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { useRouter } from 'next/router'
import wrapper from "../../store/configtureStore"
import { END } from "redux-saga";
import axios from "axios";
import PostCard from "../../components/PostCard";
import AppLayout from "../../components/AppLayout";
import { useSelector } from "react-redux";
import Head from 'next/head';

const Post = () => {
    const router = useRouter();
    const { id } = router.query;
    const { singlePost } = useSelector((state) => state.post)

    return (
        <AppLayout>
            <Head>
                <title>
                    {singlePost.User.nickname}
                    님의 글
                </title>
                <meta name="description" content={singlePost.content} />
                <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
                <meta property="og:description" content={singlePost.content} />
                <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
                <meta property="og:url" content={`https://nodebird.com/post/${id}`} /> 
                {/* 검색엔진에 잘 뜨게 하려고 */}
            </Head>
            <PostCard post={singlePost}/>
        </AppLayout>
    )
}

// export async function getStaticPaths() {
//     return {
//         paths: [
//             { params: { id: '1' } },
//             { params: { id: '2' } },
//             { params: { id: '3' } },
//             { params: { id: '4' } },
//         ],
//         fallback: true,
//     };
// }
// // 1,2,3이 미리 만들어진다


export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    console.log(context);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; 
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie; 
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST
    })
    context.store.dispatch({
        type: LOAD_POST_REQUEST,
        data: context.params.id
    })
    context.store.dispatch(END);
    console.log('getdddState', context.store.getState().post.mainPosts);
    await context.store.sagaTask.toPromise();
});


export default Post;