import React, { useEffect, useState } from 'react';
import AxiosInstance from '../utils/AxiosInstance';

interface Tag {
  id: number;
  name: string;
}

const tagColors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-pink-100 text-pink-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-indigo-100 text-indigo-700',
  'bg-red-100 text-red-700',
  'bg-teal-100 text-teal-700',
];

const TagList: React.FC = () => {
  // Semua hooks di bagian paling atas
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [editingTagId, setEditingTagId] = useState<number|null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [notif, setNotif] = useState<{type:'success'|'error',msg:string}|null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await AxiosInstance.get('/api/tags');
        setTags(Array.isArray(res.data) ? res.data : res.data.tags || []);
      } catch (err) {
        setError('Failed to load tags');
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-lg text-blue-700 font-semibold">Loading tags...</span>
    </div>
  );
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;


  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/tags');
      setTags(Array.isArray(res.data) ? res.data : res.data.tags || []);
    } catch (err) {
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return setNotif({type:'error',msg:'Tag name is required'});
    try {
      await AxiosInstance.post('/api/tags', { name: newTag });
      setNotif({type:'success',msg:'Tag added!'});
      setNewTag('');
      fetchTags();
    } catch (err) {
      setNotif({type:'error',msg:'Failed to add tag'});
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!window.confirm('Delete this tag?')) return;
    try {
      await AxiosInstance.delete(`/api/tags/${id}`);
      setNotif({type:'success',msg:'Tag deleted!'});
      fetchTags();
    } catch {
      setNotif({type:'error',msg:'Failed to delete tag'});
    }
  };

  const handleEditTag = (id: number, name: string) => {
    setEditingTagId(id);
    setEditingTagName(name);
  };

  const handleUpdateTag = async (id: number) => {
    if (!editingTagName.trim()) return setNotif({type:'error',msg:'Tag name is required'});
    try {
      await AxiosInstance.patch(`/api/tags/${id}`, { name: editingTagName });
      setNotif({type:'success',msg:'Tag updated!'});
      setEditingTagId(null);
      setEditingTagName('');
      fetchTags();
    } catch {
      setNotif({type:'error',msg:'Failed to update tag'});
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">Tags</h1>
      {/* Notif */}
      {notif && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${notif.type==='success'?'bg-green-500':'bg-red-500'}`}>{notif.msg}</div>
      )}
      {/* Add Tag */}
      <form onSubmit={handleAddTag} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          placeholder="New tag name..."
          className="flex-1 border border-blue-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded transition">Add</button>
      </form>
      {/* List Tags */}
      {tags.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No tags found.</div>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {tags.map((tag, idx) => (
            <li key={tag.id} className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow ${tagColors[idx % tagColors.length]} transition-all`}> 
              {editingTagId===tag.id ? (
                <>
                  <input
                    value={editingTagName}
                    onChange={e=>setEditingTagName(e.target.value)}
                    className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 mr-2"
                    style={{minWidth:80}}
                  />
                  <button onClick={()=>handleUpdateTag(tag.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded mr-1">Save</button>
                  <button onClick={()=>{setEditingTagId(null);setEditingTagName('')}} className="bg-gray-300 hover:bg-gray-400 text-xs px-2 py-1 rounded">Cancel</button>
                </>
              ) : (
                <>
                  <span>{tag.name}</span>
                  <button onClick={()=>handleEditTag(tag.id, tag.name)} className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-2 py-1 rounded">Edit</button>
                  <button onClick={()=>handleDeleteTag(tag.id)} className="ml-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagList;



