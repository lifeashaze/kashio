interface HomeHeaderProps {
  user: {
    name: string;
  };
}

export function HomeHeader({ user }: HomeHeaderProps) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-2 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground sm:text-4xl md:text-5xl">
        Welcome back, {firstName}.
      </h1>
      <p className="text-sm text-muted-foreground md:text-base">
        Just type what you spent. Kashio will handle the rest.
      </p>
    </div>
  );
}
