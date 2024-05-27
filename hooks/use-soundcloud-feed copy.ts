"use client"

import * as React from "react"

interface Track {
  id: number;
  title: string;
  permalink_url: string;
}

export default function useSoundcloudFeed() {
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      const accessToken = process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID;  // 서버로부터 받은 액세스 토큰
      const response = await fetch('https://api.soundcloud.com/tracks', {
        headers: {
          'Authorization': `OAuth ${accessToken}`
        }
      });
      const data = await response.json();
      console.log("Response data: ", data);  // 데이터 구조 확인
      if (Array.isArray(data)) {
        setTracks(data);
      } else {
        console.error('Received data is not an array', data);
        setTracks([]);  // 에러가 있을 경우 빈 배열로 초기화
      }
      setLoading(false);
    };

    fetchTracks();
  }, []);

  return { tracks, loading };
};
