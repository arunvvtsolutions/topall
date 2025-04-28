import React from 'react';
import { ButtonProps, Button as ShadcnButton } from '../ui/button';

import { cn } from '@/lib/utils';

interface IButtonProps extends ButtonProps {
  text: any;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  dataTestId?: string;
  variant?: any;
  color?: any;
  ariaLabel?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<IButtonProps> = ({
  text,
  startIcon,
  endIcon,
  className,
  variant,
  color,
  ariaLabel,
  dataTestId,
  disabled,
  onClick,
  ...props
}) => {
  return (
    <>
      <ShadcnButton
        onClick={onClick}
        className={cn('gap-2', className)}
        aria-label={ariaLabel}
        data-test-id={dataTestId}
        disabled={disabled}
        variant={variant}
        color={color}
        {...props}
      >
        {startIcon}
        {text}
        {endIcon}
      </ShadcnButton>
    </>
  );
};

export default Button;
