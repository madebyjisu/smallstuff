import type { ChangeEvent } from 'react'

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    placeholder?: string;
    variant?: 'default' | 'measurement' | 'reason';
    width?: string | number;
    id?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({
    options,
    value,
    placeholder = '선택해 주세요.',
    variant = 'default',
    width = '100%',
    id,
    name,
    disabled = false,
    required = false,
    onChange,
}:SelectProps) => {
    // 드롭다운 종류에 따른 클래스명 설정
    const className = `
    field
    select-field
    ${variant === 'measurement' ? 'field--measurement' : ''}
    ${variant === 'reason' ? 'field--reason' : ''}`;

    return (
        <select
        className={className}
        id={id}
        name={name}
        value={value}
        style={{width:width}}
        disabled={disabled}
        required={required}
        onChange={onChange}>
            <option value="" disabled>
                {placeholder}
            </option>

            {/* 선택 항목 반복 출력 */}
            {options.map((item)=>(
                <option
                key={item.value}
                value={item.value}
                disabled={item.disabled}>
                    {item.label}
                </option>
            ))}
        </select>
    )
}
