const steps = [
  {
    step: "01",
    title: "Type naturally",
    description: "Write like you're texting a friend. \"Uber to airport $45\" or \"Grabbed coffee with Maya, $12\". No rigid forms.",
  },
  {
    step: "02",
    title: "Instant understanding",
    description: "Kashio parses amounts, dates, vendors, and categories in milliseconds. It learns your patterns and gets smarter over time.",
  },
  {
    step: "03",
    title: "See the full picture",
    description: "Watch your spending unfold in beautiful visualizations. Spot trends, set goals, and finally feel in control of your money.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-5xl">
          Finance tracking,{" "}
          <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">reimagined</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Forget the friction of traditional budgeting. Kashio turns your words into organized finances instantly.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((item, index) => (
          <div key={item.step} className="relative">
            <div className="bg-gradient-to-r from-chart-1 via-primary to-chart-2 bg-clip-text text-6xl font-bold text-transparent opacity-50">
              {item.step}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">{item.description}</p>
            {index < 2 && (
              <div className="absolute right-0 top-8 hidden h-0.5 w-16 bg-gradient-to-r from-primary/30 to-transparent lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

