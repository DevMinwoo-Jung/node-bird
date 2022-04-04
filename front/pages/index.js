import React from "react";
import AppLayout from "../components/AppLayout";
import {useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
    const { isLoggedIn } = useSelector((state) => state.user)
    const { mainPosts } = useSelector((state) => state.post)

  return (
    <AppLayout>
        {
            isLoggedIn && <PostForm />
        }
        {
            mainPosts.map((post) => {
                return (
                    <PostCard key={post.id} post={post} />
                );
            })
        }
    </AppLayout>
  );
};
// applayout 안에 있는 애들이 children이다
export default Home;
