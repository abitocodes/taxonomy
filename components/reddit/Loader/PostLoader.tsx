import { FC } from "react";

type PostLoaderProps = {
  skeletonCount?: number;
};

const PostLoader: FC<PostLoaderProps> = ({ skeletonCount = 2 }) => {
  return (
    <div className="space-y-6">
      {Array.from(Array(skeletonCount)).map((_, index) => (
        <div key={index} className="p-2.5 shadow-lg rounded-md">
          <div className="mt-1 h-6 bg-gray-300 rounded animate-pulse w-2/5"></div>
          <div className="mt-1 space-y-1.5">
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="mt-1 h-50 bg-gray-300 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};
export default PostLoader;