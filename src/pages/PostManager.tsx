import React, { useEffect, useState } from 'react';
import AxiosInstance from '../utils/AxiosInstance';

interface User {
  id: number;
  username: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  created_at: string;
}

const PostManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/post');
      setPosts(res.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await AxiosInstance.delete(`/api/post/${id}`);
      fetchPosts();
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setForm({ title: post.title, content: post.content });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPost(null);
    setForm({ title: '', content: '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await AxiosInstance.put(`/api/post/${editingPost.id}`, form);
      } else {
        await AxiosInstance.post('/api/post', form);
      }
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      setError('Failed to save post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">Manage Posts</h1>
      {error && <div className="mb-4 px-4 py-2 rounded text-white bg-red-500 font-semibold text-center shadow">{error}</div>}
      <button onClick={handleAdd} className="mb-6 flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold px-6 py-3 rounded-xl shadow hover:scale-105 transition"><span className="material-icons">add_circle</span> Add Post</button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow space-y-2">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="w-full border px-3 py-2 rounded min-h-[100px]"
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingPost ? 'Update' : 'Create'}</button>
            <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <div className="font-bold">{post.title}</div>
                <div className="text-xs text-gray-500">By {post.user && post.user.username ? post.user.username : 'Unknown'} · {new Date(post.created_at).toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(post)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostManager;
