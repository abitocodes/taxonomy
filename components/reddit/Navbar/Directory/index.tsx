import { FC } from "react";
import { useDirectory } from "@/hooks/useDirectory";
import Communities from "@/components/reddit/Navbar/Directory/Genres";

export const Directory: FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <div className={`relative ${directoryState.isOpen ? "block" : "hidden"}`}>
      <button
        className="cursor-pointer px-1.5 py-0 rounded-md hover:outline hover:outline-1 hover:outline-gray-200 mr-2 ml-0 md:ml-2"
        onClick={toggleMenuOpen}
      >
        <div className="flex items-center justify-between w-auto lg:w-50">
          <div className="flex items-center">
            {directoryState.selectedMenuItem.imageURL ? (
              <img className="rounded-full w-6 h-6 mr-2" src={directoryState.selectedMenuItem.imageURL} alt="directory image" />
            ) : (
              <svg className={`h-6 w-6 mr-1 md:mr-2 text-${directoryState.selectedMenuItem.iconColor}`} fill="currentColor">
                {/* SVG content should be replaced with actual icon SVG path */}
              </svg>
            )}
            <div className="hidden lg:flex flex-col text-sm font-semibold">
              <span>{directoryState.selectedMenuItem.displayText}</span>
            </div>
          </div>
          <svg className="h-5 w-5 text-gray-500" fill="currentColor">
            {/* Chevron down icon SVG path */}
          </svg>
        </div>
      </button>
      <div className="absolute max-h-75 overflow-y-scroll overflow-x-hidden">
        <Communities />
      </div>
    </div>
  );
};