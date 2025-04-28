import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React from 'react';
import clsx from 'clsx';

interface FilterButtonProps {
  icon: string;
  filledIcon: string;
  label?: string;
  selected?: boolean;
  color?: any;
  className?: string;
  onClick?: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  filledIcon,
  label,
  selected,
  className,
  onClick,
  color = 'secondary'
}) => {
  return (
    <Button onClick={onClick} variant="default" color={color} className={clsx('mr-5', className)} size="md">
      <img src={selected ? filledIcon : icon} alt="logo" className="mr-2 size-4" />
      {label}
    </Button>
  );
};

export default FilterButton;
