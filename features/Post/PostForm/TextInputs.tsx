import { Dispatch, FC, SetStateAction } from "react";

type TextInputsProps = {
  textInputs: string;
  setTextInputs: Dispatch<SetStateAction<string>>;
};

const TextInputs: FC<TextInputsProps> = ({ textInputs, setTextInputs }) => {
  return (
    <div className="space-y-3 w-full">
      <textarea
        name="body"
        value={textInputs}
        onChange={(event) => setTextInputs(event.target.value)}
        className="text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border focus:border-black h-24 w-full"
        placeholder="Text (optional)"
      />
    </div>
  );
};
export default TextInputs;
