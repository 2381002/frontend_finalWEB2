import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from '../utils/AxiosInstance';

interface User {
  id: number;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  created_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  user: User;
  created_at: string;
  comments: Comment[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await AxiosInstance.get(`/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await AxiosInstance.get(`/api/comments/post/${id}`);
        setComments(Array.isArray(res.data) ? res.data : res.data.comments || []);
      } catch (err) {
        setError('Failed to load comments');
      }
    };
    fetchComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const postId = Number(id);
      if (!userId || isNaN(Number(userId))) {
        alert('You must be logged in to comment');
        return;
      }
      if (isNaN(postId)) {
        setError('Invalid post id');
        return;
      }
      const payload = {
        content: newComment,
        userId: Number(userId),
        postId: postId,
      };
      console.log('POST /api/comments payload:', payload);
      const res = await AxiosInstance.post('/api/comments', payload);
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
      console.error('Failed to add comment:', err);
    }
  };



  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-4 text-lg text-blue-700 font-semibold">Loading post...</span>
    </div>
  );
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!post) return <div className="text-center text-gray-500 py-10">Post not found</div>;

  const userId = Number(localStorage.getItem('userId'));
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 mb-10 border-2 border-blue-200">
        <h1 className="text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 drop-shadow-lg">{post.title}</h1>
        <div className="text-gray-500 text-sm mb-6 flex items-center gap-2">
          <span className="material-icons text-blue-400">person</span>
          <span className="font-semibold">{post.user?.username}</span> &middot; {new Date(post.created_at).toLocaleString()}
        </div>
        <div className="mb-8 text-gray-900 whitespace-pre-line leading-relaxed text-lg">{post.content}</div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Comments</h2>
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700 transition"
          >
            Post Comment
          </button>
        </form>
        {comments.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No comments yet.</div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div
                key={comment.id}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                {editingCommentId === comment.id ? (
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      try {
                        const res = await AxiosInstance.patch(`/api/comments/${comment.id}`, {
                          content: editingContent,
                        });
                        setComments(
                          comments.map(c =>
                            c.id === comment.id ? { ...c, content: res.data.content } : c
                          )
                        );
                        setEditingCommentId(null);
                        setEditingContent('');
                      } catch (err) {
                        setError('Failed to edit comment');
                      }
                    }}
                    className="mb-2"
                  >
                    <textarea
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                      value={editingContent}
                      onChange={e => setEditingContent(e.target.value)}
                      required
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                      <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => { setEditingCommentId(null); setEditingContent(''); }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-gray-800 mb-1">
                    {comment.content}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    By {comment.user?.username ?? 'Unknown'} on {new Date(comment.created_at).toLocaleString()}
                  </div>
                  {comment.user?.id === userId && (
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:underline text-xs"
                        onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }}
                      >Edit</button>
                      <button
                        className="text-red-600 hover:underline text-xs"
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this comment?')) return;
                          try {
                            await AxiosInstance.delete(`/api/comments/${comment.id}`);
                            setComments(comments.filter(c => c.id !== comment.id));
                          } catch (err) {
                            setError('Failed to delete comment');
                          }
                        }}
                      >Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
