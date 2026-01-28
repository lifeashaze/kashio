export function HomeHeader() {
  return (
    <div className="space-y-2 text-center">
      <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
        Welcome back, Ari.
      </h1>
      <p className="text-sm text-muted-foreground md:text-base">
        Just type what you spent. Kashio will parse the rest.
      </p>
    </div>
  );
}
