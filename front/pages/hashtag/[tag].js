import { LOAD_HASHTAG_POST_REQUEST } from "../../reducers/post";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { useRouter } from 'next/router';
import wrapper from "../../store/configtureStore";
import { END } from "redux-saga";
import axios from "axios";
import PostCard from "../../components/PostCard";
import AppLayout from "../../components/AppLayout";
import { useSelector } from "react-redux";

const Tag = () => {
    const router = useRouter();
    const { tag } = router.query;
    const { mainPosts, hasMorePosts, loadHashtagPostsLoading } = useSelector((state) => state.post);

    useEffect(() => {
        const onScroll = () => {
            if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadHashtagPostsLoading) {
                    dispatch({
                        type: LOAD_HASHTAG_POST_REQUEST,
                        lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
                        data: tag,
                    });
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [mainPosts.length, hasMorePosts, tag]);
        
            return (
                <AppLayout>
                    {mainPosts.map((c) => (
                        <PostCard key={c.id} post={c} />
                    ))}
                </AppLayout>
    );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    console.log(context);
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = ''; 
    if (context.req && cookie) {
        axios.defaults.headers.Cookie = cookie; 
    }
    context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
        type: LOAD_HASHTAG_POST_REQUEST,
        data: context.params.tag,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
});


export default Tag;