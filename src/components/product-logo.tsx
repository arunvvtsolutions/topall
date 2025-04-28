import Image from 'next/image';
import React from 'react';

interface Props {
  className?: string;
}

const ProductLogo = ({ className }: Props) => {
  return (
    <>
      <Image src="/images/logo/logo.svg" alt="topall" width={100} height={100} className={className} />
    </>
  );
};

export default ProductLogo;
