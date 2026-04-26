import React, { useState } from 'react';
import { Heart, MessageCircle, Users, MapPin, Clock } from 'lucide-react';

/**
 * SocialPost — NGO post in the social feed
 * WHY: Social layer creates transparent communication between NGOs and volunteers.
 * Posts are linked to projects/locations so volunteers can join specific initiatives.
 */
const SocialPost = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="card" id={`post-${post.id}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container text-on-primary font-semibold text-body-base">
          {post.ngo_avatar}
        </div>
        <div className="flex-1">
          <p className="text-body-base font-semibold text-on-surface">{post.ngo_name}</p>
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <Clock className="w-3 h-3" />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-h3 text-on-surface mb-2">{post.title}</h3>
      <p className="text-body-base text-on-surface-variant mb-3 leading-relaxed">{post.content}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.location && (
          <span className="badge-success">
            <MapPin className="w-3 h-3" />
            {post.location}
          </span>
        )}
        {post.project && (
          <span className="badge-neutral">{post.project}</span>
        )}
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-6 pt-3 border-t border-outline-variant">
        <button
          onClick={handleLike}
          className={`btn-ghost ${liked ? 'text-error' : ''}`}
          id={`like-${post.id}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span className="text-tabular">{likes}</span>
        </button>

        <button className="btn-ghost" id={`comment-${post.id}`}>
          <MessageCircle className="w-4 h-4" />
          <span className="text-tabular">{post.comments}</span>
        </button>

        <button className="btn-ghost text-primary" id={`join-${post.id}`}>
          <Users className="w-4 h-4" />
          <span>{post.volunteers_joined} joined</span>
        </button>

        <button className="btn-primary ml-auto text-body-sm" id={`join-initiative-${post.id}`}>
          Join Initiative
        </button>
      </div>
    </div>
  );
};

export default SocialPost;
