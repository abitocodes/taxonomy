import { FC, useRef, useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";

import { postState } from "@/atoms/postsAtom";
import { supabase } from "@/utils/supabase/client";
import useSelectFile from "@/hooks/useSelectFile";
import { PostTabItem } from "@/types/PostTabItem";
import ImageUpload from "./ImageUpload";
import LinkInput from "./LinkInput";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import { PublicUser } from "@prisma/client";

const formTabs: PostTabItem[] = [
  {
    title: "Post",
    icon: IoDocumentText,
    disabled: false,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
    disabled: false,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
    disabled: false,
  },
  {
    title: "Poll",
    icon: BiPoll,
    disabled: true,
  },
  {
    title: "Talk",
    icon: BsMic,
    disabled: true,
  },
];

type NewPostFormProps = {
  genreId: string;
  genreImageURL?: string;
  user: PublicUser;
};

const NewPostForm: FC<NewPostFormProps> = ({ genreId, genreImageURL, user }) => {
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [titleInput, setTitleInput] = useState("");
  const [textInputs, setTextInputs] = useState("");
  const [linkText, setLinkText] = useState("");
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setPostItems = useSetRecoilState(postState);

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const { data: postDocRef, error: insertError } = await supabase
      .from('posts')
      .insert([{
        genreId,
        genreImageURL: genreImageURL || "",
        creatorId: user.id,
        nickName: user.nickName,
        title: titleInput,
        body: selectedTab === "Post" ? textInputs : "",
        link: selectedTab === "Link" ? linkText : "",
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: new Date(),
        editedAt: new Date(),
      }]).single() as { data: { id: string }, error: any };
    
    if (insertError) throw insertError;

    // check if selectedFile exists, if it does, do image processing
    if (selectedTab === "Images & Video" && selectedFile) {
      const mediaType = selectedFile.includes("video") ? "video" : "image";
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(`media/${postDocRef.id}`, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(`media/${postDocRef.id}`);

      const { error: updateError } = await supabase
        .from('posts')
        .update({ mediaURL: data.publicUrl, mediaType })
        .match({ id: postDocRef.id });

      if (updateError) throw updateError;
    }

    // Clear the cache to cause a refetch of the posts
    setPostItems((prev) => ({
      ...prev,
      postUpdateRequired: true,
    }));
    router.back();
  } catch (error) {
    setError("Error creating post: " + error.message);
  }
  setLoading(false);
};

  const getTabBody = (selectedTab: string) => {
    switch (selectedTab) {
      case "Post":
        return <TextInputs textInputs={textInputs} setTextInputs={setTextInputs} />;

      case "Images & Video":
        return <ImageUpload selectedFile={selectedFile} setSelectedFile={setSelectedFile} selectFileRef={selectFileRef} onSelectImage={onSelectFile} />;

      case "Link":
        return <LinkInput linkText={linkText} setLinkText={setLinkText} />;

      default:
        break;
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg mt-2">
      <div className="w-full">
        {formTabs.map((item, index) => (
          <TabItem key={index} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
        ))}
      </div>

      <div className="p-4 flex flex-col">
        <div className="space-y-3 w-full">
          <input
            name="title"
            value={titleInput}
            onChange={(event) => setTitleInput(event.target.value)}
            className="placeholder-gray-500 focus:outline-none focus:bg-white focus:border focus:border-black text-sm rounded-lg"
            placeholder="Title"
          />
          {getTabBody(selectedTab)}
        </div>
        <div className="flex justify-end">
          <button
            className="h-8 mt-2 px-8 disabled:opacity-50"
            disabled={loading}
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};
export default NewPostForm;