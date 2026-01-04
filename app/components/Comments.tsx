import { useState, useEffect, useSyncExternalStore, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useSession } from '~/lib/auth.client';
import { Send, Edit2, Trash2, X, Check } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  } | null;
}

interface CommentsProps {
  postSlug: string;
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function Comments({ postSlug }: CommentsProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <CommentsSkeleton />;
  }

  return <CommentsClient postSlug={postSlug} />;
}

function CommentsSkeleton() {
  return (
    <section className="mt-16 pt-8 border-t border-default">
      <h2 className="text-heading-3 text-primary mb-6">Comments</h2>
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-tertiary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-tertiary rounded" />
              <div className="h-16 bg-tertiary rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommentsClient({ postSlug }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${postSlug}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postSlug, content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content: editContent }),
      });

      if (res.ok) {
        setEditingId(null);
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <CommentsSkeleton />;
  }

  return (
    <section className="mt-16 pt-8 border-t border-default">
      <h2 className="text-heading-3 text-primary mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <img
              src={session.user.image || ''}
              alt={session.user.name || ''}
              className="w-10 h-10 rounded-full border border-default"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="w-full px-4 py-3 bg-secondary border border-default rounded-lg text-body text-primary placeholder:text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  {isSubmitting ? '작성 중...' : '작성'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-secondary rounded-lg text-center">
          <p className="text-secondary">
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-secondary text-center py-8">
            아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.user?.image || ''}
                alt={comment.user?.name || ''}
                className="w-10 h-10 rounded-full border border-default"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-label text-primary">
                    {comment.user?.name || 'Unknown'}
                  </span>
                  <span className="text-caption text-tertiary">
                    {formatDate(comment.createdAt)}
                  </span>
                  {comment.createdAt !== comment.updatedAt && (
                    <span className="text-caption text-tertiary">(수정됨)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-4 py-3 bg-secondary border border-default rounded-lg text-body text-primary resize-none focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)]"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded text-caption hover:opacity-90"
                      >
                        <Check size={14} />
                        저장
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-1 px-3 py-1.5 bg-tertiary text-secondary rounded text-caption hover:opacity-90"
                      >
                        <X size={14} />
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-body text-primary whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {session?.user?.id === comment.user?.id && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => startEditing(comment)}
                          className="flex items-center gap-1 text-caption text-tertiary hover:text-primary transition-colors"
                        >
                          <Edit2 size={14} />
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="flex items-center gap-1 text-caption text-tertiary hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
