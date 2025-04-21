import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../utils/AxiosInstance';

interface Tag { id: number; name: string; }

const PostCreate: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await AxiosInstance.get('/api/tags');
        setTags(Array.isArray(res.data) ? res.data : res.data.tags || []);
      } catch (err) {
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  const handleTagChange = (id: number) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AxiosInstance.post('/api/post', { title, content, tags: selectedTags });
      navigate('/posts');
    } catch (err) {
      setError('Failed to create post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">Add New Post</h1>
      {error && <div className="mb-4 px-4 py-2 rounded text-white bg-red-500 font-semibold text-center shadow">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-2xl p-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default PostCreate;
