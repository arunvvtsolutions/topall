import React from 'react';

interface IPageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<IPageHeaderProps> = ({ title, className = '', description, actions }) => {
  return (
    <>
      <div className={`flex flex-wrap items-center p-1 sm:p-2 md:p-2 lg:p-2 ${className}`}>
        <div className="ml-0 w-full text-left">
          <h1 className="font- Plus Jakarta Sans text-[20px] font-semibold text-B2CAgrayn sm:text-xl md:text-2xl">{title}</h1>

          {description && <p className="mt-2 text-sm font-semibold text-B2CAgrayn sm:text-base md:text-lg">{description}</p>}
        </div>

        {actions && (
          <div className="mr-1 mt-2 flex flex-1 justify-start sm:justify-end md:justify-between lg:justify-end">{actions}</div>
        )}
      </div>
    </>
  );
};

export default PageHeader;
