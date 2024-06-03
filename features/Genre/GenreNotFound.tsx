import { FC } from "react";
import Link from "next/link";

const GenreNotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      Sorry, that genre does not exist or has been banned
      <Link className="mt-4" href="/">
          <button className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded">
            GO HOME
          </button>
      </Link>
    </div>
  );
};
export default GenreNotFound;