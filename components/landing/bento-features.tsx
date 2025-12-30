import { Shield, TrendingUp } from "lucide-react";

const exampleInputs = [
  { text: "split dinner 4 ways $120" },
  { text: "parking meter, like $3" },
  { text: "amazon — not sure what lol" },
];

const categories = [
  { label: "Food & Drink", color: "bg-chart-1" },
  { label: "Transport", color: "bg-chart-2" },
  { label: "Shopping", color: "bg-chart-3" },
  { label: "Bills", color: "bg-chart-4" },
  { label: "Entertainment", color: "bg-chart-5" },
  { label: "Health", color: "bg-primary" },
];

const breakdown = [
  { category: "Food & Drink", amount: "$342", percent: 19, color: "bg-chart-1" },
  { category: "Transportation", amount: "$289", percent: 16, color: "bg-chart-2" },
  { category: "Shopping", amount: "$456", percent: 25, color: "bg-chart-3" },
  { category: "Bills", amount: "$520", percent: 28, color: "bg-chart-4" },
  { category: "Other", amount: "$240", percent: 13, color: "bg-chart-5" },
];

export function BentoFeatures() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Large card - Natural Language */}
        <div className="group relative col-span-full overflow-hidden rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-sm md:col-span-2">
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-primary">The Core</span>
              <h3 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">Write it like you think it</h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                No dropdowns. No forms. Just type what happened and Kashio figures out the rest.
              </p>
            </div>
            
            {/* Fake input examples */}
            <div className="mt-8 flex flex-wrap gap-2">
              {exampleInputs.map((item) => (
                <div 
                  key={item.text}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground"
                >
                  <span className="text-primary">&rarr;</span> {item.text}
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-[80px]" />
        </div>

        {/* Spending breakdown card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm md:row-span-2">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">This Month</span>
            <span className="text-xl font-bold text-foreground">$1,847</span>
          </div>
          <div className="space-y-3">
            {breakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.category}</span>
                  <span className="font-medium text-foreground">{item.amount}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small card - Speed */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <div className="text-5xl font-bold text-foreground">
            &lt;1<span className="text-2xl text-muted-foreground">s</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Average time to log an expense. Seriously.
          </p>
        </div>

        {/* Small card - Privacy */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 backdrop-blur-sm">
          <Shield className="h-8 w-8 text-primary" />
          <p className="mt-4 text-sm font-medium text-foreground">
            Your data never leaves your control. Encrypted. Private. Yours.
          </p>
        </div>

        {/* Wide card - Categories preview */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm md:col-span-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Auto-tagged</span>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm text-foreground"
              >
                <span className={`h-2 w-2 rounded-full ${tag.color}`} />
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Insight card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          <TrendingUp className="h-6 w-6 text-chart-2" />
          <p className="mt-4 text-sm text-foreground leading-relaxed">
            &ldquo;You spent <span className="font-semibold text-chart-2">23% more</span> on coffee this month than last.&rdquo;
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Insights that actually matter
          </p>
        </div>
      </div>
    </section>
  );
}
