"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useApplications } from "@/hooks/use-applications";
import { getApplicationStatusPath } from "@/components/shared/application-status-config";
import type { Application } from "@/types";

export function RecentApplicationsTable() {
  const router = useRouter();
  const { data: applications = [], isLoading } = useApplications();

  // Get 5 most recent applications sorted by submission date
  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(a.submissionDate).getTime();
        const dateB = new Date(b.submissionDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [applications]);

  const handleView = (application: Application) => {
    const statusPath = getApplicationStatusPath(application.currentStatus);
    router.push(`/applications/${statusPath}/${application.id}`);
  };

  const handleExportCSV = () => {
    const headers = ["Application ID", "Candidate Name", "Progress", "Status"];
    const rows = recentApplications.map((app) => [
      app.applicationId || app.id.toString(),
      app.candidateName,
      `${app.overallProgress}%`,
      app.currentStatus,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `recent-applications-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (recentApplications.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        No applications found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">App ID</TableHead>
            <TableHead>Candidate Name</TableHead>
            <TableHead className="w-[180px]">Progress</TableHead>
            <TableHead className="w-[160px]">Status</TableHead>
            <TableHead className="w-[80px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-mono text-sm">
                {application.applicationId || application.id}
              </TableCell>
              <TableCell className="font-medium">
                {application.candidateName}
              </TableCell>
              <TableCell>
                <Progress value={application.overallProgress}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {application.overallProgress}%
                    </span>
                  </div>
                  <ProgressTrack className="h-1.5">
                    <ProgressIndicator
                      style={{ width: `${application.overallProgress}%` }}
                    />
                  </ProgressTrack>
                </Progress>
              </TableCell>
              <TableCell>
                <StatusBadge status={application.currentStatus} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleView(application)}
                    aria-label="View application"
                  >
                    <Eye className="size-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportCSV}>
                        <Download className="size-4 mr-2" />
                        Export as CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
