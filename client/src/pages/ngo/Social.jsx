import React from 'react';
import SocialPost from '../../components/SocialPost';
import { mockPosts } from '../../data/mockData';

const NGOSocial = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface mb-2">Social Feed</h1>
          <p className="text-body-base text-on-surface-variant">
            Communicate updates and mobilize volunteers.
          </p>
        </div>
        <button className="btn-primary">Create Post</button>
      </header>

      <div className="space-y-6">
        {mockPosts.map(post => (
          <SocialPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default NGOSocial;
