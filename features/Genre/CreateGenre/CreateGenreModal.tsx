import { FC, useState } from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client"; // Supabase 클라이언트 가져오기

import { genreState } from "@/atoms/genresAtom";
import { genreModalState } from "@/atoms/genreModalAtom";
import ModalWrapper from "@/components/reddit/Dialog/DialogWrapper";
import useGenreModal from "@/hooks/useGenreModal";

type CreateGenreModalProps = {
  userId: string;
};

const CreateGenreModal: FC<CreateGenreModalProps> = ({ userId }) => {
  const setSnippetState = useSetRecoilState(genreState);
  const isOpen = useRecoilValue(genreModalState).open;
  const { closeModal } = useGenreModal();
  const [name, setName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [nameError, setNameError] = useState("");
  const [genreType, setGenreType] = useState("public");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const resetValues = () => {
    setName("");
    setCharsRemaining(21);
    setNameError("");
    setGenreType("public");
  };

  const handleModalClose = () => {
    resetValues();
    closeModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const handleCreateGenre = async () => {
    if (nameError) setNameError("");
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(name) || name.length < 3) {
      return setNameError("Genre names must be between 3–21 characters, and can only contain letters, numbers, or underscores.");
    }

    setLoading(true);
    try {
      const { data: genreDoc, error } = await supabase
        .from('genres')
        .select('*')
        .eq('name', name)
        .single();

      if (error) throw new Error(error.message);
      if (genreDoc) throw new Error(`Sorry, /r${name} is taken. Try another.`);

      const { error: insertError } = await supabase
        .from('genres')
        .insert([
          {
            name: name,
            creatorId: userId,
            createdAt: new Date(),
            numberOfMembers: 1,
            privacyType: genreType,
          },
        ]);

      if (insertError) throw new Error(insertError.message);

      const { error: snippetError } = await supabase
        .from('genreSnippets')
        .insert([
          {
            genreId: name,
            userId: userId,
            isModerator: true,
          },
        ]);

      if (snippetError) throw new Error(snippetError.message);
    } catch (error: any) {
      setNameError(error.message);
    } finally {
      setLoading(false);
    }

    setSnippetState((prev) => ({
      ...prev,
      mySnippets: [],
    }));
    handleModalClose();
    router.push(`/r/${name}`);
  };

  const onGenreTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name },
    } = event;
    if (name === genreType) return;
    setGenreType(name);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={handleModalClose}>
      <div className="flex flex-col p-3 text-sm">
        Create a genre
      </div>
      <div className="pr-3 pl-3">
        <hr />
        <button onClick={handleModalClose} className="absolute top-3 right-3">X</button>
        <div className="flex flex-col p-2.5">
          <span className="font-semibold text-sm">
            Name
          </span>
          <span className="text-xs text-gray-500">
            Genre names including capitalization cannot be changed
          </span>
          <div className="flex items-center mt-1">
            <span className="text-gray-400 text-xs absolute ml-2">
              r/
            </span>
            <input className="pl-8 text-sm" name="name" value={name} onChange={handleChange} type="text" />
          </div>
          <span className={`text-xs pt-2 ${charsRemaining === 0 ? "text-red-500" : "text-gray-500"}`}>
            {charsRemaining} Characters remaining
          </span>
          <span className="text-xs text-red-500 pt-1">
            {nameError}
          </span>
          <div className="mt-4 mb-4">
            <span className="font-semibold text-sm">
              Genre Type
            </span>
            <div className="space-y-2 pt-1">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="public" checked={genreType === "public"} onChange={onGenreTypeChange} className="text-blue-500" />
                <span className="text-sm font-bold mr-1">
                  Public
                </span>
                <span className="text-xs text-gray-500">
                  Anyone can view, post, and comment to this genre
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="restricted" checked={genreType === "restricted"} onChange={onGenreTypeChange} className="text-blue-500" />
                <span className="text-sm font-bold mr-1">
                  Restricted
                </span>
                <span className="text-xs text-gray-500">
                  Anyone can view this genre, but only approved users can post
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="private" checked={genreType === "private"} onChange={onGenreTypeChange} className="text-blue-500" />
                <span className="text-sm font-bold mr-1">
                  Private
                </span>
                <span className="text-xs text-gray-500">
                  Only approved users can view and submit to this genre
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-b-lg p-3 flex justify-end space-x-2">
        <button className="border border-gray-300 text-sm p-1 er border-gray-300 text-sm p-1.5" onClick={handleModalClose}>
        Cancel
      </button>
      <button className="bg-blue-500 text-white text-sm p-1.5" onClick={handleCreateGenre} disabled={loading}>
        Create Genre
      </button>
    </div>
    </ModalWrapper>
  );
};

export default CreateGenreModal;
