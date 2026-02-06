import type { ReactNode } from "react";

type SettingRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  iconContainerClassName?: string;
  titleClassName?: string;
};

export function SettingRow({
  icon,
  title,
  description,
  action,
  iconContainerClassName,
  titleClassName,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted ${iconContainerClassName ?? ""}`.trim()}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${titleClassName ?? ""}`.trim()}>{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
