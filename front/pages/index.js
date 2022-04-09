import React from "react";
import AppLayout from "../components/AppLayout";
import {useSelector} from "react-redux";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home = () => {
    const { isLoggedIn } = useSelector((state) => state.user)
    const { mainPosts } = useSelector((state) => state.post)
    const sibal = useSelector((state) => state)
    console.log(sibal)

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
export default Home;
