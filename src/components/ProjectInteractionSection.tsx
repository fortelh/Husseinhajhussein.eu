"use client";

import { useState } from "react";
import { Heart, MessageSquare, Trash2, Edit2, Check, X, Send, ChevronDown, ChevronUp, Flag } from "lucide-react";
import VisitorAuthModal from "./VisitorAuthModal";
import ReportCommentModal from "@/components/modals/ReportCommentModal";

// --- Recursive Comment Item Component for Tree Structure & Color Coding ---
function CommentItem({
  comment,
  projectId,
  currentVisitorId,
  currentVisitorRole,
  isLoggedIn,
  onUpdateComments,
  depth = 0,
}: {
  comment: any;
  projectId: string;
  currentVisitorId?: string;
  currentVisitorRole?: string;
  isLoggedIn: boolean;
  onUpdateComments: (updater: (list: any[]) => any[]) => void;
  depth?: number;
}) {
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const commentVisitorId = comment.visitorId || comment.visitor?.id;
  const isOwner = Boolean(isLoggedIn && currentVisitorId && commentVisitorId && currentVisitorId === commentVisitorId);
  const isAdmin = Boolean(isLoggedIn && currentVisitorRole && currentVisitorRole.toUpperCase() === "ADMIN");
  const canModify = Boolean(isLoggedIn && (isOwner || isAdmin));
  const isCommentLiked = comment.likes?.some((l: any) => l.visitorId === currentVisitorId);

  // Define dynamic color accents based on tree depth level
  const depthStyles = [
    "bg-slate-950/70 border-slate-900 border-l-cyan-500",
    "bg-slate-900/50 border-slate-800/80 border-l-violet-500",
    "bg-slate-900/30 border-slate-800/60 border-l-emerald-500",
  ];
  const currentStyle = depthStyles[Math.min(depth, depthStyles.length - 1)];

  // Handle Post Reply (Deep Recursive Injection)
  const handlePostReply = async (targetId: string) => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentId: targetId }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          const addReplyRecursive = (list: any[]): any[] => {
            return list.map((c) => {
              if (c.id === targetId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), { ...data.comment, replies: [] }],
                };
              }
              if (c.replies && c.replies.length > 0) {
                return { ...c, replies: addReplyRecursive(c.replies) };
              }
              return c;
            });
          };
          onUpdateComments(addReplyRecursive);
          setReplyContent("");
          setReplyingToId(null);
          setShowReplies(true);
        }
      }
    } catch (error) {
      console.error("Failed to post reply", error);
    }
  };

  // Handle Like Comment
  const handleLike = async () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const updateLikesRecursive = (list: any[]): any[] => {
          return list.map((c) => {
            if (c.id === comment.id) {
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
        onUpdateComments(updateLikesRecursive);
      }
    } catch (error) {
      console.error("Failed to like comment", error);
    }
  };

  // Handle Delete (Fully Recursive Filtering)
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) {
        const deleteRecursive = (list: any[]): any[] => {
          return list
            .filter((c) => c.id !== comment.id)
            .map((c) => ({
              ...c,
              replies: c.replies ? deleteRecursive(c.replies) : [],
            }));
        };
        onUpdateComments(deleteRecursive);
      }
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  // Handle Edit Update
  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          const updateRecursive = (list: any[]): any[] => {
            return list.map((c) => {
              if (c.id === comment.id) return { ...c, content: data.comment.content };
              if (c.replies) return { ...c, replies: updateRecursive(c.replies) };
              return c;
            });
          };
          onUpdateComments(updateRecursive);
          setEditingCommentId(null);
          setEditContent("");
        }
      }
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };

  return (
    <div className={`border border-l-4 rounded-xl p-3 space-y-2 relative group ${currentStyle}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs pr-6">
        <span className="font-bold text-cyan-400">
          {comment.visitor?.firstName} {comment.visitor?.lastName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>

          {canModify && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              {editingCommentId === comment.id ? (
                <>
                  <button onClick={handleUpdate} className="text-cyan-400">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditingCommentId(null)} className="text-slate-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  {isOwner && (
                    <button
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-slate-400 hover:text-cyan-400"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={handleDelete} className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Flag / Report Button (Appears on comment hover) */}
      <button
        onClick={() => setIsReportOpen(true)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-amber-400"
        title="Report comment"
      >
        <Flag className="w-3.5 h-3.5" />
      </button>

      {/* Content / Hidden Notice */}
      {comment.isHidden ? (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs italic flex items-center gap-2">
          <span>⚠️ Hidden comment, waiting admin decision</span>
        </div>
      ) : editingCommentId === comment.id ? (
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
        />
      ) : (
        <p className="text-slate-300 text-xs leading-relaxed">{comment.content}</p>
      )}

      {/* Actions Bar */}
      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 hover:text-cyan-400 transition-colors ${
            isCommentLiked ? "text-cyan-400 font-bold" : ""
          }`}
        >
          <Heart className={`w-3 h-3 ${isCommentLiked ? "fill-cyan-400 text-cyan-400" : ""}`} />
          <span>{comment.likes?.length || 0} Likes</span>
        </button>

        <button
          onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Reply</span>
        </button>

        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-[10px] font-mono text-cyan-400/80 hover:text-cyan-300 ml-auto flex items-center gap-1"
          >
            {showReplies ? `Hide Replies (${comment.replies.length})` : `Show Replies (${comment.replies.length})`}
          </button>
        )}
      </div>

      {/* Inline Reply Input */}
      {replyingToId === comment.id && (
        <div className="mt-2 pl-3 border-l-2 border-cyan-500/40 flex gap-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`Reply to ${comment.visitor?.firstName || "user"}...`}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handlePostReply(comment.id)}
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1"
          >
            <Send className="w-3 h-3" /> Reply
          </button>
        </div>
      )}

      {/* Nested Sub-Replies Tree Container */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l border-slate-800/80 space-y-2.5">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              projectId={projectId}
              currentVisitorId={currentVisitorId}
              currentVisitorRole={currentVisitorRole}
              isLoggedIn={isLoggedIn}
              onUpdateComments={onUpdateComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <VisitorAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      <ReportCommentModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        commentId={comment.id}
        visitorId={currentVisitorId}
      />
    </div>
  );
}

// --- Main Interaction Section Export ---
export default function ProjectInteractionSection({
  projectId,
  initialLikesCount,
  initialHasLiked,
  initialComments,
  isLoggedIn,
  currentVisitorId,
  currentVisitorRole,
}: {
  projectId: string;
  initialLikesCount: number;
  initialHasLiked: boolean;
  initialComments: any[];
  isLoggedIn: boolean;
  currentVisitorId?: string;
  currentVisitorRole?: string;
}) {
  // Helper to correctly build a nested tree hierarchy from flat backend arrays or nested data
  const buildCommentTree = (flatComments: any[]) => {
    const commentMap = new Map();
    const roots: any[] = [];

    // First pass: create a map of all items with cloned replies arrays
    flatComments.forEach((c) => {
      commentMap.set(c.id, { 
        ...c, 
        replies: c.replies ? [...c.replies] : [] 
      });
    });

    // Second pass: nest children under their respective parents
    flatComments.forEach((c) => {
      if (c.parentId) {
        const parent = commentMap.get(c.parentId);
        const currentItem = commentMap.get(c.id);
        if (parent && currentItem) {
          if (!parent.replies.some((r: any) => r.id === c.id)) {
            parent.replies.push(currentItem);
          }
        }
      } else {
        const rootItem = commentMap.get(c.id);
        if (rootItem && !roots.some((r: any) => r.id === c.id)) {
          roots.push(rootItem);
        }
      }
    });

    return roots;
  };

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [comments, setComments] = useState(() => buildCommentTree(initialComments));
  const [newComment, setNewComment] = useState("");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  // Handle Project Like
  const handleLike = async () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setHasLiked(data.liked);
        setLikesCount(data.liked ? likesCount + 1 : likesCount - 1);
      }
    } catch (error) {
      console.error("Failed to like project", error);
    }
  };

  // Handle Posting Root Comment
  const handlePostRoot = async () => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/projects/${projectId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, parentId: null }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.comment) {
          setComments([{ ...data.comment, replies: [] }, ...comments]);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="p-4 pt-0 space-y-4">
      {/* Project Likes & Comments count header */}
      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-900">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors ${
            hasLiked ? "text-cyan-400 font-bold" : "hover:text-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? "fill-cyan-400 text-cyan-400" : ""}`} />
          <span>{likesCount} Likes</span>
        </button>
        <div className="flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <span>{comments.length} Comments</span>
        </div>
      </div>

      {/* Main Comment Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isLoggedIn ? "Write a comment..." : "Sign in to comment..."}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handlePostRoot}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" /> Post
        </button>
      </div>

      {/* Comments Tree List */}
      {comments.length > 0 && (
        <div className="space-y-3 pt-2">
          {displayedComments.map((comment: any) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              projectId={projectId}
              currentVisitorId={currentVisitorId}
              currentVisitorRole={currentVisitorRole}
              isLoggedIn={isLoggedIn}
              onUpdateComments={(updater) => setComments(updater)}
              depth={0}
            />
          ))}

          {/* See More / See Less Toggle */}
          {comments.length > 2 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="w-full py-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-slate-950/40 hover:bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-center gap-1 transition-colors mt-2"
            >
              {showAllComments ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>See More Comments ({comments.length - 2} more)</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <VisitorAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}