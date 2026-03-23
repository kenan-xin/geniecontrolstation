import {
  AlertTriangle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Newspaper,
  FileSearch,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusCards = [
  {
    label: "Unverified",
    count: 0,
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-l-red-500",
    gradient: "from-red-500/8 to-transparent",
  },
  {
    label: "Pending Approval",
    count: 0,
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-l-amber-500",
    gradient: "from-amber-500/8 to-transparent",
  },
  {
    label: "Scheduled",
    count: 0,
    icon: CalendarCheck,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
    gradient: "from-blue-500/8 to-transparent",
  },
  {
    label: "Published",
    count: 0,
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-500",
    gradient: "from-emerald-500/8 to-transparent",
  },
] as const;

export default function NewsVerificationPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-md shadow-amber-500/20">
            <Newspaper className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              News Verification
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered editorial workflow for verifying and publishing news
              stories
            </p>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statusCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={`relative overflow-hidden border-l-[3px] ${stat.border} transition-shadow duration-200 hover:shadow-md`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} pointer-events-none`}
              />
              <CardContent className="relative flex items-center gap-3">
                <div className={`shrink-0 rounded-lg p-2.5 ${stat.bg}`}>
                  <Icon className={`size-4.5 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-3xl font-bold tracking-tight leading-none ${stat.color}`}
                  >
                    {stat.count}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Empty State */}
      <Card className="border-dashed">
        <CardHeader className="items-center text-center pb-2">
          <div className="mb-3 flex size-16 items-center justify-center rounded-2xl bg-muted">
            <FileSearch className="size-8 text-muted-foreground/60" />
          </div>
          <CardTitle className="text-lg font-semibold text-muted-foreground">
            No news articles yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto">
            Data will appear once the database is connected. Articles will flow
            through the 4-stage verification pipeline automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
