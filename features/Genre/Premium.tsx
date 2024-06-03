import { FC } from "react";
import { GiCheckedShield } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

const Premium: FC = () => {
  return (
    <div className="flex flex-col rounded-md cursor-pointer p-3 border-l border-gray-300">
      <div className="flex mb-2">
        {/* <GiCheckedShield className="text-[#FF4500] text-6.5 mt-2" /> */}
        <div className="flex flex-col items-center space-y-2 text-xs">
          <span className="font-semibold text-base">카페인이 부족합니다.</span>
          <span>횽. 아 일이 안 잡히네. 나 커피 한잔 사주구가.</span>
        </div>
      </div>
      <Button
      className="h-7.5 rounded-md mt-2"
      onClick={() =>
        toast("앗, 고마워! 근데 마음만 받을게.", {
          description: "후원 시스템은 개발 중이야.. 조만간 업데이트 할게.",
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
        아비터에게 커피 사주기
    </Button>
    </div>
  );
};
export default Premium;