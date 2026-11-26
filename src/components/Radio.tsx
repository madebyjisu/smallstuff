import type { ChangeEvent } from "react"

interface RadioProps {
    name: string;
    value: string;
    checked: boolean;
    label?: string;
    id?: string;
    disabled?: boolean;
    ariaLabel?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = ({
    name,
    value,
    checked,
    label,
    id,
    disabled = false,
    ariaLabel,
    onChange,
}: RadioProps) => {
    return (
        <label className="radio-wrap">
            <input
                type="radio"
                className="radio"
                name={name}
                value={value}
                checked={checked}
                id={id}
                disabled={disabled}
                aria-label={ariaLabel}
                onChange={onChange} />

            {/* 라벨이 있을 경우에만 글씨 표시 */}
            {label && <span>{label}</span>}
        </label>
    );
};
