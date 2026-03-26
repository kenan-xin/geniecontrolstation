"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, XCircle, User, FileText, Clock } from "lucide-react";
import { toast } from "sonner";
import { ApplicationDetailLayout } from "../detail-layout";
import type { SectionItem } from "@/components/news-verification/section-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateApplication } from "@/hooks/use-applications";
import type { Application, NewApplication } from "@/types";
import {
  CandidateInfoSection,
  ApplicationProgressSection,
  AssignmentSection,
  TimelineSection,
} from "../sections";

interface CandidateScreeningViewProps {
  application: Application;
}

export function CandidateScreeningView({ application }: CandidateScreeningViewProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const updateMutation = useUpdateApplication();

  const sections: SectionItem[] = [
    { id: 0, name: "Candidate Info", icon: User },
    { id: 1, name: "Progress", icon: FileText },
    { id: 2, name: "Assignment", icon: User },
    { id: 3, name: "Timeline", icon: Clock },
  ];


 const handleAdvance = () => {
    const nextStatus = "Pending Approval";
    const nextProgress = 75;

    updateMutation.mutate(
      {
        id: application.id,
        data: {
          currentStatus: nextStatus,
          overallProgress: nextProgress,
          notes: notes || null,
        } as Partial<NewApplication>,
      },
      {
        onSuccess: () => {
          toast.success("Application advanced to Pending Approval");
          setAdvanceDialogOpen(false);
          router.push(`/applications/pending-approval/${application.id}`);
        },
        onError: () => {
          toast.error("Failed to advance application");
        },
      }
    );
  };

  const handleReject = () => {
    if (!notes.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    updateMutation.mutate(
      {
        id: application.id,
        data: {
          notes: notes,
        } as Partial<NewApplication>,
      },
      {
        onSuccess: () => {
          toast.success("Application rejected");
          setRejectDialogOpen(false);
          router.push("/applications");
        },
        onError: () => {
          toast.error("Failed to reject application");
        },
      }
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <CandidateInfoSection application={application} />;
      case 1:
        return <ApplicationProgressSection application={application} />;
      case 2:
        return <AssignmentSection application={application} />;
      case 3:
        return <TimelineSection application={application} />;
      default:
        return null;
    }
  };

  const actionButtons = (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="gap-1.5 min-[400px]:w-auto w-full"
        onClick={() => setAdvanceDialogOpen(true)}
      >
        Advance to Approval
        <ChevronDown className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon" className="shrink-0 hidden min-[400px]:flex" />}
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRejectDialogOpen(true)}>
            <XCircle className="size-4 mr-2 text-red-600" />
            Reject Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      <ApplicationDetailLayout
        title={application.candidateName || "Untitled Application"}
        activeStep={1}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        actionButtons={actionButtons}
      >
        {renderSection()}
      </ApplicationDetailLayout>

      {/* Advance Dialog */}
      <Dialog open={advanceDialogOpen} onOpenChange={setAdvanceDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Advance to Pending Approval</DialogTitle>
            <DialogDescription>
              Add notes before advancing the application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Officer Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this application..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdvanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdvance} disabled={updateMutation.isPending}>
              Confirm & Advance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              This will mark the application as rejected.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              This action cannot be undone.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason *</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={updateMutation.isPending || !notes.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
