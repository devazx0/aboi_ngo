type SectionIntroProps = {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionIntro({
  badge,
  title,
  description,
  className = "",
}: SectionIntroProps) {
  return (
    <div className={`text-center max-w-3xl mx-auto mb-xl ${className}`}>
      {badge && (
        <span className="inline-block bg-surface-container-high text-primary font-label-md text-label-md px-sm py-xs rounded-full mb-md">
          {badge}
        </span>
      )}
      <h2 className="font-display-lg text-display-lg text-primary mb-md">
        {title}
      </h2>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {description}
        </p>
      )}
    </div>
  );
}
