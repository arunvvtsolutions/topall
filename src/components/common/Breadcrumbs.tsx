import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '../ui/breadcrumb';

type BreadcrumbsProps = {
  items: {
    label: string;
    href?: string;
  }[];
  separator?: React.ReactNode;
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, separator = <BreadcrumbSeparator /> }) => {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList className="flex items-center">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className="flex items-center">
                {!isLastItem ? (
                  <BreadcrumbLink href={item.href} className="!text-[rgba(75, 75, 75, 1)] !text-20px mb-48px font-normal">
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="!text-[rgba(34, 34, 34, 1)] !text-20px mb-48px font-normal">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < items.length - 1 && (
                <BreadcrumbSeparator role="presentation" aria-hidden="true" className="ml-[-10px] mr-[-10px] mt-[6px]">
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
