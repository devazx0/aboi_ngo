import Link from "next/link";

type PillarCardProps = {
  icon: string;
  title: string;
  description: string;
  href?: string;
  accentColor: "primary" | "secondary" | "tertiary";
  blurColor: string;
};

const ACCENT_STYLES = {
  primary: {
    iconBg: "bg-primary-fixed",
    iconText: "text-on-primary-fixed",
    link: "text-primary-container hover:text-primary",
    hover: "hover:border-primary-container/30",
  },
  secondary: {
    iconBg: "bg-secondary-fixed",
    iconText: "text-on-secondary-fixed",
    link: "text-secondary hover:text-secondary-container",
    hover: "hover:border-secondary-container/30",
  },
  tertiary: {
    iconBg: "bg-tertiary-fixed",
    iconText: "text-on-tertiary-fixed",
    link: "text-tertiary hover:text-tertiary-container",
    hover: "hover:border-tertiary-container/30",
  },
} as const;

export function PillarCard({
  icon,
  title,
  description,
  href = "#",
  accentColor,
  blurColor,
}: PillarCardProps) {
  const styles = ACCENT_STYLES[accentColor];

  return (
    <div
      className={`group relative bg-surface-container-lowest rounded-lg border border-outline-variant/50 p-md overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] ${styles.hover}`}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"
        style={{ backgroundColor: blurColor }}
      />
      <div className="relative z-10 flex items-start gap-md">
        <div
          className={`p-sm ${styles.iconBg} ${styles.iconText} rounded-md shrink-0`}
        >
          <span
            className="material-symbols-outlined text-headline-md"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
            {title}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
            {description}
          </p>
          <Link
            href={href}
            className={`font-label-md text-label-md uppercase inline-flex items-center gap-xs ${styles.link} transition-colors`}
          >
            Learn More{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
