import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Pick<Post, 'title' | 'content'>>({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await AxiosInstance.get(`/api/post/${id}`);
        setForm({ title: res.data.title, content: res.data.content });
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(`/api/post/${id}`, form);
      navigate('/posts');
    } catch (err) {
      setError('Failed to update post');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full border px-3 py-2 rounded min-h-[120px]"
          required
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => navigate('/posts')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;
