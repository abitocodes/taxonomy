import { FC } from "react";
import { GiCheckedShield } from "react-icons/gi";

const Premium: FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-md cursor-pointer p-3 border border-gray-300">
      <div className="flex mb-2">
        <GiCheckedShield className="text-[#FF4500] text-6.5 mt-2" />
        <div className="flex flex-col space-y-1 text-xs pl-2">
          <span className="font-semibold">Reddit Premium</span>
          <span>The best Reddit experience, with monthly Coins</span>
        </div>
      </div>
      <button className="h-7.5 bg-[#FF4500] rounded-md text-white">
        Try Now
      </button>
    </div>
  );
};
export default Premium;