import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CalendarCheck,
  CheckCircle2,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const stages = [
  {
    key: "unverified",
    label: "Unverified",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500",
    ring: "ring-red-500/30",
  },
  {
    key: "approval",
    label: "Approval",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500",
    ring: "ring-amber-500/30",
  },
  {
    key: "schedule",
    label: "Schedule",
    icon: CalendarCheck,
    color: "text-blue-500",
    bg: "bg-blue-500",
    ring: "ring-blue-500/30",
  },
  {
    key: "published",
    label: "Published",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    ring: "ring-emerald-500/30",
  },
] as const;

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ status: string; id: string }>;
}) {
  const { status, id } = await params;
  const currentIndex = stages.findIndex((s) => s.key === status);
  const capitalizedStatus =
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/news-verification" />}>
              News Verification
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/news-verification" />}
            >
              {capitalizedStatus}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>#{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Stepper */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Workflow Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isCompleted = currentIndex > index;
              const isCurrent = currentIndex === index;
              const isUpcoming = currentIndex < index;

              return (
                <div key={stage.key} className="flex items-center flex-1 last:flex-none">
                  {/* Step circle */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`relative flex size-10 items-center justify-center rounded-full transition-all duration-300 ${
                        isCompleted
                          ? `${stage.bg} text-white shadow-md`
                          : isCurrent
                            ? `${stage.bg}/15 ${stage.color} ring-2 ${stage.ring}`
                            : "bg-muted text-muted-foreground/40"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="size-4.5" />
                      ) : (
                        <Icon className="size-4.5" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent
                          ? stage.color
                          : isUpcoming
                            ? "text-muted-foreground/50"
                            : "text-muted-foreground"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index < stages.length - 1 && (
                    <div className="flex-1 mx-3 mb-6">
                      <div
                        className={`h-0.5 rounded-full transition-colors duration-300 ${
                          currentIndex > index
                            ? "bg-emerald-500/50"
                            : "bg-border"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Placeholder */}
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Detail view for article{" "}
            <span className="font-mono font-semibold text-foreground">
              #{id}
            </span>{" "}
            &mdash; coming in Phase 4
          </p>
        </CardContent>
      </Card>

      {/* Back Link */}
      <Button
        variant="ghost"
        render={<Link href="/news-verification" />}
        nativeButton={false}
        className="gap-2 text-muted-foreground"
      >
        <ArrowLeft className="size-3.5" data-icon="inline-start" />
        Back to News Verification
      </Button>
    </div>
  );
}
