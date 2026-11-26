interface SectionTitleProps {
    title: string;
    description?: string;
    align?: 'left' | 'center' | 'right';
    size?: 'normal' | 'small' | 'large';
}

export const SectionTitle = ({
    title,
    description,
    align = 'left',
    size = 'normal',
}: SectionTitleProps) => {
    const className = `
    section-title
    section-title--${align}
    section-title--${size}`;

  return (
    <div className={className}>
        <h2>{title}</h2>

        {/* 설명이 있는 경우에만 표시 */}
        {description && <p>{description}</p>}
    </div>
  );
};
