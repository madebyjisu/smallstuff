import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'outline';
  size?: 'normal' | 'small';
  width?: number | string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = 'default',
  size = 'normal',
  width,
  disabled = false,
  type = 'button',
  onClick,
}: ButtonProps) => {

  // 버튼 종류에 따른 클래스명 설정
  const className = `
    button
    ${variant === 'outline' ? 'button--outline' : ''}
    ${size === 'small' ? 'button--compact' : ''}
  `;

  return (
    <button
      className={className}
      style={{ width: width }}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};