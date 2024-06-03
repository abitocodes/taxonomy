import { Dispatch, FC, SetStateAction } from "react";
import { BsLink45Deg } from "react-icons/bs";
import Microlink from "@microlink/react";

type LinkInputProps = {
  linkText: string;
  setLinkText: Dispatch<SetStateAction<string>>;
};

const LinkInput: FC<LinkInputProps> = ({ linkText, setLinkText }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {linkText ? (
        <>
          <Microlink style={{ width: "100%" }} url={linkText} />
          <div className="flex flex-row mt-4">
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded" onClick={() => setLinkText("")}>
              Remove
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center">
          <div className="text-gray-500">
            <BsLink45Deg />
          </div>
          <input
            type="text"
            name="link"
            value={linkText}
            onChange={(event) => setLinkText(event.target.value)}
            className="placeholder-gray-500 focus:outline-none focus:bg-white focus:border focus:border-black text-sm rounded p-2 flex-1"
            placeholder="Link"
          />
        </div>
      )}
    </div>
  );
};

export default LinkInput;