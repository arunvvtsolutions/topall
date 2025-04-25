import * as React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '../ui/pagination';
import { Icon } from '../ui/icon';
import { DialogTitle } from '@/types/enum';

interface PaginateProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Paginate: React.FC<PaginateProps> = ({ currentPage, totalPages, onPageChange }) => {
  const renderPaginationItems = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum pages to display at once
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is less than maxVisiblePages
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={i === currentPage}
            style={i === currentPage ? { backgroundColor: 'rgba(0, 0, 128, 1)', color: 'white' } : undefined}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Back Button */}
        {currentPage > 1 ? (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              style={{ padding: '0.5rem 2rem', fontWeight: '400' }}
            >
              <span className='flex items-center text-[14px] gap-1'>
              <Icon icon="material-symbols-light:keyboard-arrow-left" className="h-4 w-4" />
              {DialogTitle.BACK}
              </span>
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              href="#"
              style={{
                pointerEvents: 'none',
                opacity: 0.5,
                padding: '0.5rem 2rem',
                fontWeight: '400'
              }}
            >
              <span className='flex items-center text-[14px] gap-1'>
              <Icon icon="material-symbols-light:keyboard-arrow-left" className="h-4 w-4" />
              {DialogTitle.BACK}
              </span>
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Pagination Items */}
        {renderPaginationItems()}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              style={{ padding: '0.5rem 2rem', fontWeight: '400' }}
              
            >
              <span className='flex items-center text-[14px] gap-1' >
              {DialogTitle.NEXT}
              <Icon icon="material-symbols-light:keyboard-arrow-right" className="h-4 w-4" />
              </span>
            </PaginationLink>
          </PaginationItem>
        ) : (
          <PaginationItem>
            <PaginationLink
              href="#"
              style={{
                pointerEvents: 'none',
                opacity: 0.5,
                padding: '0.5rem 2rem',
                fontWeight: '400'
              }}
            >
              <span className='flex items-center text-[14px] gap-1'>
              {DialogTitle.NEXT}
              <Icon icon="material-symbols-light:keyboard-arrow-right" className="h-4 w-4" />
              </span>
            </PaginationLink>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default Paginate;
