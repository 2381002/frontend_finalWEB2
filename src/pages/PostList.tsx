import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from '../utils/AxiosInstance';
import InfiniteScroll from 'react-infinite-scroll-component';

interface User {
  id: number;
  username: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  created_at: string;
  tags?: Tag[];
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const fetchPosts = async (pageNum = 1, tagId?: number) => {
    setLoading(true);
    try {
      let res;
      if (tagId) {
        res = await AxiosInstance.get(`/api/post/by-tag/${tagId}?page=${pageNum}&limit=10`);
      } else {
        res = await AxiosInstance.get(`/api/post?page=${pageNum}&limit=10`);
      }
      if (pageNum === 1) {
        setPosts(res.data);
      } else {
        setPosts(prev => [...prev, ...res.data]);
      }
      setHasMore(res.data.length > 0);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [selectedTag]);

  useEffect(() => {
    fetchPosts(page, selectedTag?.id);
    // eslint-disable-next-line
  }, [page, selectedTag]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await AxiosInstance.delete(`/api/post/${id}`);
      if (selectedTag) {
        await fetchPosts(selectedTag.id);
      } else {
        await fetchPosts();
      }
    } catch (err) {
      setError('Failed to delete post');
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-lg text-blue-700 font-semibold">Loading blog posts...</span>
    </div>
  );
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-6 px-2 sm:px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg text-left md:text-center w-full md:w-auto">Blog Posts</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
          <Link to="/posts/create" className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 sm:px-5 py-2 rounded-xl shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition text-base sm:text-lg w-full sm:w-auto">
            <span className="material-icons">add_circle</span> Add Post
          </Link>
          <Link to="/tags" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-700 text-white px-4 sm:px-5 py-2 rounded-xl shadow hover:scale-105 hover:from-blue-500 hover:to-blue-800 transition text-base sm:text-lg w-full sm:w-auto">
            <span className="material-icons">local_offer</span> Tags
          </Link>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No posts found.</div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setPage(prev => prev + 1)}
          hasMore={hasMore}
          loader={<div className="text-center py-4">Loading...</div>}
          endMessage={<div className="text-center py-4 text-gray-400">No more posts</div>}
        >
          <div className="flex flex-col gap-10">
            {posts.map(post => (
              <div key={post.id} className="w-full bg-white rounded-3xl shadow-2xl hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.25)] hover:ring-4 hover:ring-purple-200 transition-all duration-300 p-6 sm:p-8 md:p-10 border-2 border-blue-100 hover:border-purple-300 group relative overflow-hidden flex flex-col">
                <Link to={`/posts/${post.id}`} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 group-hover:text-purple-700 transition-colors duration-200 drop-shadow-lg break-words mb-2">
                  {post.title}
                </Link>
                <div className="text-gray-500 text-xs mb-3 mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.305.534 6.121 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="font-semibold">{post.user && post.user.username ? post.user.username : 'Unknown'}</span> &middot; {new Date(post.created_at).toLocaleString()}
                </div>
                {((post.tags && post.tags.length > 0) || selectedTag) && (
                  <React.Fragment>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={tag.id}
                            style={{ cursor: 'pointer', opacity: selectedTag && selectedTag.id !== tag.id ? 0.5 : 1 }}
                            className={`px-4 py-1 rounded-full text-sm font-bold shadow bg-gradient-to-r from-${['blue', 'green', 'yellow', 'red', 'purple', 'pink'][idx % 6]}-200 to-${['blue', 'green', 'yellow', 'red', 'purple', 'pink'][idx % 6]}-400 text-${['blue', 'green', 'yellow', 'red', 'purple', 'pink'][idx % 6]}-900 border-2 border-${['blue', 'green', 'yellow', 'red', 'purple', 'pink'][idx % 6]}-300 hover:ring-2 hover:ring-purple-400 transition-all duration-200 ${selectedTag && selectedTag.id === tag.id ? 'ring-4 ring-blue-400 scale-105' : ''}`}
                            onClick={() => setSelectedTag(tag)}
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {selectedTag && (
                      <div className="mb-6 flex items-center gap-3">
                        <button
                          className="px-4 py-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full hover:from-gray-300 hover:to-gray-400 text-base font-bold shadow"
                          onClick={() => setSelectedTag(null)}
                        >
                          <span className="material-icons align-middle">clear</span> Show All
                        </button>
                        <span className="ml-2 text-purple-700 font-bold text-lg">Filter: <span className="underline">#{selectedTag.name}</span></span>
                      </div>
                    )}
                  </React.Fragment>
                )}
                <div className="text-gray-800 mb-2 line-clamp-3">
                  {post.content.slice(0, 180)}{post.content.length > 180 ? '...' : ''}
                </div>
                <div className="flex gap-2 mt-6">
                  <Link to={`/posts/edit/${post.id}`} className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg shadow transition">
                    <span className="material-icons">edit</span> Edit
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition">
                    <span className="material-icons">delete</span> Delete
                  </button>
                  <Link to={`/posts/${post.id}`} className="flex items-center gap-1 bg-gradient-to-r from-blue-400 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition">
                    <span className="material-icons">visibility</span> Read more
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
      {showScrollToTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-all flex items-center gap-2"
        >
          <span className="material-icons">arrow_upward</span>
          Kembali ke Atas
        </button>
      )}
    </div>
  );
};

export default PostList;
