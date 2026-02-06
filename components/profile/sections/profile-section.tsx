import type { ReactNode } from "react";

type ProfileSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function ProfileSection({
  title,
  description,
  children,
}: ProfileSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
