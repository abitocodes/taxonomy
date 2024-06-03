import { FC, useRef, useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSearchParams } from "next/navigation";

import moment from "moment";
import Link from "next/link";

import { genreState } from "@/atoms/genresAtom";
import { supabase } from "@/utils/supabase/client";
import { Genre } from "@/types/genresState";
import { Session } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";

type AboutProps = {
  genreData: Genre;
  pt?: number;
  onCreatePage?: boolean;
  loading?: boolean;
};

const About: FC<AboutProps> = ({ genreData, pt, onCreatePage, loading }) => {
  const [session, setSession] = useState<Session | null>(null);
  const { user, loading: authLoading, error: authError } = useAuthState(session);
  const searchParam = useSearchParams()
  const selectFileRef = useRef<HTMLInputElement>(null);
  const setGenreStateValue = useSetRecoilState(genreState);

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
      const { data: uploadData, error: uploadError } = await supabase.storage.from('genres').upload(`${genreData.id}/image`, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
      if (uploadError) throw uploadError;
    
      const { data: urlData } = await supabase.storage.from('genres').getPublicUrl(`${genreData.id}/image`);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get the public URL.");
      }
    
      const publicURL = urlData.publicUrl;
    
      const { data: updateData, error: updateError } = await supabase
        .from('genres')
        .update({ imageURL: publicURL })
        .match({ id: genreData.id });
    
      if (updateError) throw updateError;
    
      setGenreStateValue((prev) => ({
        ...prev,
        currentGenre: {
          ...prev.currentGenre,
          imageURL: publicURL,
        },
      }));
    } catch (error) {
      console.error("updateImage error", error.message);
    }

    setImageLoading(false);
  };

  const genreQuery = searchParam?.get('g');

  return (
    <div className={`pt-${pt} sticky top-14`}>
      <div className="flex justify-between items-center p-3 bg-blue-400 rounded-t-md">
        <p className="text-sm font-bold">
          About Genre
        </p>
        <HiOutlineDotsHorizontal className="cursor-pointer" />
      </div>
      <div className="flex flex-col p-3 rounded-b-md">
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
            {user?.id === genreData?.creatorId && (
              <div className="bg-gray-100 w-full p-2 rounded border border-gray-300 cursor-pointer">
                <p className="text-xs font-bold text-blue-500">
                  Add description
                </p>
              </div>
            )}
            <div className="space-y-2">
              <div className="w-full p-2 font-bold text-sm">
                <div className="flex flex-col grow">
                  <p>{genreData?.numberOfMembers?.toLocaleString()}</p>
                  <p>Members</p>
                </div>
                {/* <div className="flex flex-col grow">
                  <p>1</p>
                  <p>Online</p>
                </div> */}
              </div>
              <hr />
              <div className="flex items-center w-full p-1 font-medium text-sm">
                <RiCakeLine className="mr-2 text-xl" />
                {genreData?.createdAt && <p>Created {moment(genreData.createdAt).format("MMM DD, YYYY")}</p>}
              </div>
              {!onCreatePage && (
                <Link href={`/g/${genreQuery}/submit`}>
                  <Button className="mt-3 h-7 w-full rounded">
                    게시글 작성
                  </Button>
                </Link>
              )}
              {user?.id === genreData?.creatorId && (
                <>
                  <hr />
                  <div className="text-sm space-y-1">
                    <p className="font-bold">Admin</p>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-500 cursor-pointer hover:underline" onClick={() => selectFileRef.current?.click()}>
                        Change Image
                      </p>
                      {genreData?.imageURL || selectedFile ? (
                        <img className="rounded-full h-10 w-10" src={selectedFile || genreData?.imageURL} alt="Genre Image" />
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