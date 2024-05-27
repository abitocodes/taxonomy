"use client"

import React from 'react';
import useSoundcloudFeed from '@/hooks/use-soundcloud-feed';

const Tracklist: React.FC = () => {
  const { tracks, loading } = useSoundcloudFeed();

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {tracks.map((track: any) => (
        <div key={track.id} className="m-2 rounded bg-gray-200 p-4">
          <a href={track.permalink_url} target="_blank" rel="noopener noreferrer">
            {track.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default Tracklist;
