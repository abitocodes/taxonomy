import { FC } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload: FC<ImageUploadProps> = ({ selectedFile, setSelectedFile, selectFileRef, onSelectImage }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {selectedFile ? (
        <>
          {selectedFile.includes("video") ? (
            <div className="aspect-w-16 aspect-h-9">
              <video controls src={selectedFile} className="object-contain" />
            </div>
          ) : (
            <img src={selectedFile} className="max-w-[400px] max-h-[400px]" alt="post image" />
          )}
          <div className="flex mt-4">
            <button className="border border-gray-300 py-1 px-3" onClick={() => setSelectedFile("")}>
              Remove
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center p-5 border-dashed border-1 border-gray-200 rounded w-full">
          <button className="border border-gray-300 py-1 px-3" onClick={() => selectFileRef.current?.click()}>
            Upload (&lt;20MB)
          </button>
          <input id="file-upload" type="file" accept="image/x-png,image/gif,image/jpeg,video/mp4" hidden ref={selectFileRef} onChange={onSelectImage} />
        </div>
      )}
    </div>
  );
};
export default ImageUpload;