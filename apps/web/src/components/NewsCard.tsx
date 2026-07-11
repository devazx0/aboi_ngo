import Link from "next/link";

type NewsCardProps = {
  category: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  href?: string;
  categoryColor?: "primary" | "secondary" | "tertiary";
};

const CATEGORY_COLORS = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
} as const;

export function NewsCard({
  category,
  date,
  title,
  description,
  imageUrl,
  imageAlt,
  href = "#",
  categoryColor = "primary",
}: NewsCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden flex flex-col group hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-shadow">
      <div className="h-48 w-full relative overflow-hidden bg-surface-container-highest">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={imageAlt}
        />
        <div className="absolute top-sm right-sm bg-surface-container-lowest/90 backdrop-blur-sm px-xs py-[4px] rounded font-label-md text-[12px] text-on-surface-variant shadow-sm">
          {date}
        </div>
      </div>
      <div className="p-sm flex-1 flex flex-col">
        <span
          className={`font-label-md text-[12px] ${CATEGORY_COLORS[categoryColor]} uppercase mb-xs tracking-wider`}
        >
          {category}
        </span>
        <h3 className="font-headline-md text-[20px] text-on-surface mb-xs line-clamp-2 group-hover:text-primary-container transition-colors">
          {title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-sm line-clamp-3 flex-1">
          {description}
        </p>
        <Link
          href={href}
          className="font-label-md text-label-md text-primary mt-auto flex items-center gap-xs"
        >
          Read Report{" "}
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </article>
  );
}
