import { FC } from "react";
import { FaReddit } from "react-icons/fa";

import useGenreData from "@/hooks/useGenreData";
import { Genre } from "@/types/genresState";

type HeaderProps = {
  genreData: Genre;
};

const Header: FC<HeaderProps> = ({ genreData }) => {
  const { genreStateValue, loading, error, onJoinLeaveGenre } = useGenreData(!!genreData);
  const isJoined = !!genreStateValue.mySnippets.find((item) => item.genreId === genreData.id);

  return (
    <div className="flex flex-col w-full h-36">
      <div className="h-1/2 bg-blue-400" />
      <div className="flex justify-center h-1/2">
        <div className="flex w-95% max-w-5xl">
          {genreStateValue.currentGenre.imageURL ? (
            <img
              className="rounded-full h-18 w-18 relative top-[-0.75rem] border-4 border-white"
              src={genreStateValue.currentGenre.imageURL}
              alt="Genre Image"
            />
          ) : (
            <FaReddit className="text-9xl relative top-[-0.75rem] text-blue-500 border-4 border-white rounded-full" />
          )}
          <div className="flex p-2.5">
            <div className="flex flex-col mr-6">
              <span className="font-bold text-2xl">
                {genreData.id}
              </span>
              <span className="font-semibold text-sm text-gray-400">
                r/{genreData.id}
              </span>
            </div>
            <div>
              <button
                className={`h-7 px-6 ${isJoined ? "border" : "bg-blue-500 text-white"} flex items-center justify-center`}
                onClick={() => onJoinLeaveGenre(genreData, isJoined)}
                disabled={loading}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;