import { FC, ReactNode } from "react";

interface PageContentLayoutProps {
  children?: ReactNode;
  maxWidth?: string;
}

// Assumes array of two children are passed
const PageContentLayout: FC<PageContentLayoutProps> = ({ children, maxWidth }) => {
  return (
    <div className="flex justify-center p-[16px_0px]">
      <div className={`flex w-95% justify-center max-w-[${maxWidth || "860px"}]`}>
        <div className="flex flex-col w-full md:w-2/3 md:mr-6">
          {children && children[0 as keyof typeof children]}
        </div>
        {/* Right Content */}
        <div className="hidden md:flex flex-col flex-grow">
          {children && children[1 as keyof typeof children]}
        </div>
      </div>
    </div>
  );
};

export default PageContentLayout;