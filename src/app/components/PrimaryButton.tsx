'use client';

import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function PrimaryButton({ className, ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`before:ease-in-out relative overflow-hidden transition-all duration-1000 before:absolute before:right-0 before:-top-4 before:h-[90px] before:w-12 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-50 before:duration-1000 hover:bg-jade-hover hover:before:-translate-x-[600px] bg-jade text-white rounded-xl border-jade py-3 px-5 ${className || ''}`}
      {...props}
    />
  );
}

