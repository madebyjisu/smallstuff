import type { ChangeEvent } from "react"

interface CheckboxProps {
    checked: boolean;
    label?: string;
    id?: string;
    name?: string;
    disabled?: boolean;
    ariaLabel?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = ({
    checked,
    label,
    id,
    name,
    disabled = false,
    ariaLabel,
    onChange,
}: CheckboxProps) => {
    return (
        <label className="checkbox-wrap">
            <input
                type="checkbox"
                className="checkbox"
                id={id}
                name={name}
                checked={checked}
                disabled={disabled}
                aria-label={ariaLabel}
                onChange={onChange}
            />

            {/* 라벨이 있을 경우에만 글씨 표시 */}
            {label && <span>{label}</span>}
        </label>
    );
};
