import  { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import bgHero from "../assets/bgHero.png";
import { IComment } from "../types";
import { IoMdArrowRoundBack } from "react-icons/io";

interface Post {
  id: string;
  title: string;
  description: string;
  codeSnippet: string;
  jsCodeSnippet: string;
  author: {
    id: string;
    username: string;
    email: string;
    totalFollowers:number
  };
  tags: string[];
  reactions: object[];
  comments: IComment[];
  favoritePosts: [];
  userReaction: 'Like' | 'Celebrate' | 'Support' | 'Love' | 'Insightful' | 'Funny' | null; 
}

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/posts/trending`);
        const allPosts = response.data.trendingPosts;
        // Sort posts by reaction count in descending order
        const sortedPosts = allPosts.sort((a: Post, b: Post) => b.reactions.length - a.reactions.length);
        // Get the top 6 posts
        const topPosts = sortedPosts.slice(0, 6);

        setPosts(topPosts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch posts");
      }
    };

    document.title="Style Share | What's trending 🎉"

    fetchPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-lg w-full text-center mt-5">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center text-[#000435] bg-white dark:text-white dark:bg-[#000435]" style={{ backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="p-6 max-w-screen-xl w-full bg-white dark:bg-[#000435] rounded-lg shadow-lg">
      <button
          onClick={() => window.history.back()}
          className="mb-2 mt-2 px-2 py-1 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded"
        >
          <IoMdArrowRoundBack size={20} />
        </button>
        <h1 className="text-3xl font-bold mb-4 text-[#c050f8]  dark:text-white text-center">
          Trending Posts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={null} onDelete={function (): void {
              throw new Error("Function not implemented.");
            } } />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPosts;