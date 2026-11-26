import type { ChangeEvent } from 'react';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'search';
  variant?: 'default' | 'checkout' | 'measurement';
  id?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  width?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type = 'text',
  variant = 'default',
  id,
  name,
  value,
  placeholder,
  width = '100%',
  disabled = false,
  readOnly = false,
  required = false,
  onChange,
}: InputProps) => {

  // 입력창 종류에 따른 클래스명 설정
  const className = `
    field
    ${variant === 'checkout' ? 'field--checkout' : ''}
    ${variant === 'measurement' ? 'field--measurement' : ''}
  `;

  return (
    <input
      className={className}
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      style={{ width: width }}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onChange={onChange}
    />
  );
};