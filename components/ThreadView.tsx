'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Clock, MessageSquare, Send } from 'lucide-react';
import { ForumThread, ForumPost } from '@/lib/forums';
import { formatDistanceToNow } from 'date-fns';

interface ThreadViewProps {
  thread: ForumThread;
  onClose: () => void;
}

export default function ThreadView({ thread, onClose }: ThreadViewProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [thread.id]);

  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await fetch(`/api/forums/posts?thread_id=${thread.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReply(e: React.FormEvent) {
    e.preventDefault();

    if (!replyContent.trim() || !replyAuthor.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('/api/forums/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: thread.id,
          content: replyContent,
          author_name: replyAuthor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      setReplyContent('');
      await fetchPosts();
    } catch (err) {
      console.error('Error posting reply:', err);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'housing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'jobs':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'schools':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'lifestyle':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Forums
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-3 ${getCategoryColor(
              thread.category
            )}`}
          >
            {thread.category.charAt(0).toUpperCase() + thread.category.slice(1)}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{thread.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{thread.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.reply_count} replies</span>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {posts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Replies</h2>
              {posts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{post.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>
              ))}
            </div>
          )}

          {!thread.is_locked && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Post a Reply</h3>
              <form onSubmit={handleSubmitReply} className="space-y-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="author"
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reply" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply
                  </label>
                  <textarea
                    id="reply"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim() || !replyAuthor.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            </div>
          )}

          {thread.is_locked && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p className="text-gray-600">This thread is locked and no longer accepting replies.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
