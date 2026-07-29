type PillarDetailProps = {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  objectives: { label: string }[];
  actions: { label: string }[];
  reversed?: boolean;
};

export function PillarDetail({
  icon,
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  objectives,
  actions,
  reversed = false,
}: PillarDetailProps) {
  return (
    <article className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center group">
      <div className={`${reversed ? "order-2 md:order-1" : "order-2 md:order-1"} space-y-md`}>
        <div className="flex items-center gap-sm text-primary mb-xs">
          <span
            className="material-symbols-outlined text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
          <h2 className="font-headline-lg text-headline-lg">{title}</h2>
        </div>
        <p className="font-headline-md text-headline-md text-secondary">
          {subtitle}
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
          <div className="bg-surface-container-lowest p-md rounded shadow-sm border border-outline-variant">
            <h3 className="font-label-md text-label-md text-primary mb-sm flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                flag
              </span>
              Key Objectives
            </h3>
            <ul className="space-y-xs font-body-md text-body-md text-on-surface-variant">
              {objectives.map((obj) => (
                <li key={obj.label} className="flex items-start gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">
                    check_circle
                  </span>
                  {obj.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-container-lowest p-md rounded shadow-sm border border-outline-variant">
            <h3 className="font-label-md text-label-md text-primary mb-sm flex items-center gap-xs">
              <span
                className="material-symbols-outlined text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                action_key
              </span>
              Concrete Actions
            </h3>
            <ul className="space-y-xs font-body-md text-body-md text-on-surface-variant">
              {actions.map((act) => (
                <li key={act.label} className="flex items-start gap-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-[2px]">
                    check_circle
                  </span>
                  {act.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className={`rounded overflow-hidden shadow-sm relative group-hover:shadow-md transition-shadow duration-300 ${
          reversed ? "order-1 md:order-2" : "order-1 md:order-2"
        }`}
      >
        <img
          className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageUrl}
          alt={imageAlt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </article>
  );
}
