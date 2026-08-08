"use client";

import { useState } from "react";
import { Heart, MessageSquare, Trash2, Edit2, Check, X, Send } from "lucide-react";

export default function CommentsSection({
  projectId,
  comments: initialComments,
  currentVisitorId,
  currentVisitorRole,
  isLoggedIn,
  onAuthRequired,
}: {
  projectId: string;
  comments: any[];
  currentVisitorId?: string;
  currentVisitorRole?: string;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Post top-level comment or threaded reply
  const handlePost = async (parentId: string | null = null) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    const content = parentId ? replyContent : newComment;
    if (!content.trim()) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          if (parentId) {
            // Add reply under the correct parent comment
            setComments(comments.map((c) => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), data.comment],
                };
              }
              return c;
            }));
            setReplyContent("");
            setReplyingToId(null);
          } else {
            setComments([data.comment, ...comments]);
            setNewComment("");
          }
        }
      }
    } catch (error) {
      console.error("Failed to post comment/reply", error);
    }
  };

  // Like or Unlike a comment/reply
  const handleLikeComment = async (commentId: string) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        
        // Update likes state recursively for comments and nested replies
        const updateLikesRecursive = (list: any[]): any[] => {
          return list.map((c) => {
            if (c.id === commentId) {
              const likes = data.liked
                ? [...(c.likes || []), { visitorId: currentVisitorId }]
                : (c.likes || []).filter((l: any) => l.visitorId !== currentVisitorId);
              return { ...c, likes };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateLikesRecursive(c.replies) };
            }
            return c;
          });
        };

        setComments(updateLikesRecursive(comments));
      }
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  // Delete comment or reply
  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        const deleteRecursive = (list: any[]): any[] => {
          return list
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: c.replies ? deleteRecursive(c.replies) : [],
            }));
        };
        setComments(deleteRecursive(comments));
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Top-level comment input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isLoggedIn ? "Write a comment..." : "Sign in to comment..."}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => handlePost(null)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" /> Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment: any) => {
          const isLiked = comment.likes?.some((l: any) => l.visitorId === currentVisitorId);
          const isOwner = currentVisitorId === comment.visitorId;
          const isAdmin = currentVisitorRole === "ADMIN";
          const canModify = isOwner || isAdmin;

          return (
            <div key={comment.id} className="bg-slate-950/60 border border-slate-900 rounded-xl p-3 space-y-2">
              {/* Comment Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400">
                  {comment.visitor?.firstName} {comment.visitor?.lastName}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {canModify && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-slate-300 text-xs">{comment.content}</p>

              {/* Like & Reply Action Bar */}
              <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1 hover:text-cyan-400 transition-colors ${
                    isLiked ? "text-cyan-400 font-bold" : ""
                  }`}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? "fill-cyan-400 text-cyan-400" : ""}`} />
                  <span>{comment.likes?.length || 0} Likes</span>
                </button>

                <button
                  onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Inline Reply Input Box */}
              {replyingToId === comment.id && (
                <div className="mt-2 pl-4 border-l-2 border-cyan-500/30 flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to ${comment.visitor?.firstName}...`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handlePost(comment.id)}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Reply
                  </button>
                </div>
              )}

              {/* Nested Replies Rendering */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l border-slate-800 space-y-2">
                  {comment.replies.map((reply: any) => {
                    const isReplyLiked = reply.likes?.some((l: any) => l.visitorId === currentVisitorId);
                    const isReplyOwner = currentVisitorId === reply.visitorId;
                    const canModifyReply = isReplyOwner || isAdmin;

                    return (
                      <div key={reply.id} className="bg-slate-900/40 p-2.5 rounded-lg space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-cyan-400">
                            {reply.visitor?.firstName} {reply.visitor?.lastName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                            {canModifyReply && (
                              <button
                                onClick={() => handleDelete(reply.id)}
                                className="text-slate-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs">{reply.content}</p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <button
                            onClick={() => handleLikeComment(reply.id)}
                            className={`flex items-center gap-1 hover:text-cyan-400 transition-colors ${
                              isReplyLiked ? "text-cyan-400 font-bold" : ""
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${isReplyLiked ? "fill-cyan-400 text-cyan-400" : ""}`} />
                            <span>{reply.likes?.length || 0} Likes</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}