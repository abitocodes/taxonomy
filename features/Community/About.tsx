import { FC, useRef, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSearchParams } from "next/navigation";

import moment from "moment";
import Link from "next/link";

import { communityState } from "@/atoms/communitiesAtom";
import { supabase } from "@/utils/supabase/client";
import { Community } from "@/types/CommunityState";
import { Session } from '@supabase/supabase-js';

type AboutProps = {
  communityData: Community;
  pt?: number;
  onCreatePage?: boolean;
  loading?: boolean;
};

const About: FC<AboutProps> = ({ communityData, pt, onCreatePage, loading }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const searchParams = useSearchParams()
  const selectFileRef = useRef<HTMLInputElement>(null);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const [selectedFile, setSelectedFile] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      if (event.target.files?.[0].size < 1048576 * 20) {
        reader.readAsDataURL(event.target.files[0]);
      } else {
        alert("File is too big!");
      }
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const updateImage = async () => {
    if (!selectedFile) return;
    setImageLoading(true);
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage.from('communities').upload(`${communityData.id}/image`, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
      if (uploadError) throw uploadError;
    
      const { data: urlData } = await supabase.storage.from('communities').getPublicUrl(`${communityData.id}/image`);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get the public URL.");
      }
    
      const publicURL = urlData.publicUrl;
    
      const { data: updateData, error: updateError } = await supabase
        .from('communities')
        .update({ imageURL: publicURL })
        .match({ id: communityData.id });
    
      if (updateError) throw updateError;
    
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: publicURL,
        },
      }));
    } catch (error) {
      console.error("updateImage error", error.message);
    }

    setImageLoading(false);
  };

  const communityQuery = searchParams?.get('community');

  return (
    <div className={`pt-${pt} sticky top-14`}>
      <div className="flex justify-between items-center p-3 text-white bg-blue-400 rounded-t-md">
        <p className="text-sm font-bold">
          About Community
        </p>
        <HiOutlineDotsHorizontal className="cursor-pointer" />
      </div>
      <div className="flex flex-col p-3 bg-white rounded-b-md">
        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-2.5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            {user?.id === communityData?.creatorId && (
              <div className="bg-gray-100 w-full p-2 rounded border border-gray-300 cursor-pointer">
                <p className="text-xs font-bold text-blue-500">
                  Add description
                </p>
              </div>
            )}
            <div className="space-y-2">
              <div className="w-full p-2 font-bold text-sm">
                <div className="flex flex-col grow">
                  <p>{communityData?.numberOfMembers?.toLocaleString()}</p>
                  <p>Members</p>
                </div>
                <div className="flex flex-col grow">
                  <p>1</p>
                  <p>Online</p>
                </div>
              </div>
              <hr />
              <div className="flex items-center w-full p-1 font-medium text-sm">
                <RiCakeLine className="mr-2 text-xl" />
                {communityData?.createdAt && <p>Created {moment(communityData.createdAt).format("MMM DD, YYYY")}</p>}
              </div>
              {!onCreatePage && (
                <Link href={`/r/${communityQuery}/submit`}>
                  <button className="mt-3 h-7 w-full bg-blue-500 text-white rounded">
                    Create Post
                  </button>
                </Link>
              )}
              {user?.id === communityData?.creatorId && (
                <>
                  <hr />
                  <div className="text-sm space-y-1">
                    <p className="font-bold">Admin</p>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-500 cursor-pointer hover:underline" onClick={() => selectFileRef.current?.click()}>
                        Change Image
                      </p>
                      {communityData?.imageURL || selectedFile ? (
                        <img className="rounded-full h-10 w-10" src={selectedFile || communityData?.imageURL} alt="Community Image" />
                      ) : (
                        <FaReddit className="text-brand-100 text-10 mr-2" />
                      )}
                    </div>
                    {selectedFile && (
                      imageLoading ? (
                        <svg className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full" viewBox="0 0 24 24"></svg>
                      ) : (
                        <p className="cursor-pointer" onClick={updateImage}>
                          Save Changes
                        </p>
                      )
                    )}
                  <input id="file-upload" type="file" accept="image/x-png,image/gif,image/jpeg" hidden ref={selectFileRef} onChange={onSelectImage} />
                </div>
              </>
            )}
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default About;