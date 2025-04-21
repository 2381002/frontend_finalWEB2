import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../utils/AxiosInstance';

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

const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Pick<Post, 'title' | 'content'>>({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all tags
        const tagsRes = await AxiosInstance.get('/api/tags');
        const allTags = Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data.tags || [];
        setTags(allTags);
        // Fetch post data
        const postRes = await AxiosInstance.get(`/api/post/${id}`);
        setForm({ title: postRes.data.title, content: postRes.data.content });
        setSelectedTags(postRes.data.tags ? postRes.data.tags.map((t: Tag) => t.id) : []);
      } catch (err) {
        setError('Failed to fetch post or tags');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleTagChange = (tagId: number) => {
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(tid => tid !== tagId) : [...prev, tagId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(`/api/post/${id}`, { ...form, tags: selectedTags });
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
        <div>
          <label className="block text-sm font-semibold mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <label key={tag.id} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="accent-blue-600"
                />
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => navigate('/posts')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;
