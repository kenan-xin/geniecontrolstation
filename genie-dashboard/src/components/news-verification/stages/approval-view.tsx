"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DetailLayout } from "../detail-layout";
import type { SectionItem } from "../section-nav";
import {
  PersonalDetailsSection,
  StoryDetailsSection,
  AttachmentsSection,
  LinksSection,
  EditorialNotesSection,
  ChannelDisplaySection,
} from "../sections";
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateNewsArticle } from "@/hooks/use-news-articles";
import type { NewsArticle, NewNewsArticle, EditorialNote } from "@/types";

// Helper to safely parse JSON that may already be an object
function safeJsonParse<T>(value: T | string | null): T | null {
  if (!value) return null;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
import {
  User,
  FileText,
  Paperclip,
  Link as LinkIcon,
  StickyNote,
  Monitor,
} from "lucide-react";

interface ApprovalViewProps {
  article: NewsArticle;
}

function formatTimestamp(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
}

export function ApprovalView({ article }: ApprovalViewProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [pushBackDialogOpen, setPushBackDialogOpen] = useState(false);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);

  const [seniorNotes, setSeniorNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [pushBackReason, setPushBackReason] = useState("");
  const [revertReason, setRevertReason] = useState("");

  const updateMutation = useUpdateNewsArticle();

  const sections: SectionItem[] = [
    { id: 0, name: "Personal Details", icon: User },
    { id: 1, name: "Story Details", icon: FileText },
    { id: 2, name: "Attachments", icon: Paperclip },
    { id: 3, name: "Links & Proof", icon: LinkIcon },
    { id: 4, name: "Editorial Notes", icon: StickyNote },
    { id: 5, name: "Channel Display", icon: Monitor },
  ];

  const handleApprove = () => {
    if (!seniorNotes.trim()) {
      toast.error("Please add senior editorial notes");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Senior Editorial",
      action: "Approved",
      timestamp: formatTimestamp(),
      content: seniorNotes,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Schedule",
          statusColor: "info",
          seniorEditorialNotes: seniorNotes,
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article approved for scheduling");
          setApproveDialogOpen(false);
          router.push(`/news-verification/schedule/${article.id}`);
        },
        onError: () => {
          toast.error("Failed to approve article");
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Senior Editorial",
      action: "Rejected",
      timestamp: formatTimestamp(),
      content: rejectReason,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Rejected",
          statusColor: "default",
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article rejected");
          setRejectDialogOpen(false);
          router.push("/news-verification");
        },
        onError: () => {
          toast.error("Failed to reject article");
        },
      }
    );
  };

  const handlePushBack = () => {
    if (!pushBackReason.trim()) {
      toast.error("Please provide revision instructions");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Senior Editorial",
      action: "Pushed Back",
      timestamp: formatTimestamp(),
      content: pushBackReason,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Unverified",
          statusColor: "error",
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article pushed back to Junior Editorial");
          setPushBackDialogOpen(false);
          router.push("/news-verification");
        },
        onError: () => {
          toast.error("Failed to push back article");
        },
      }
    );
  };

  const handleRevert = () => {
    if (!revertReason.trim()) {
      toast.error("Please provide a reason for revert");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Senior Editorial",
      action: "Reverted",
      timestamp: formatTimestamp(),
      content: revertReason,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Unverified",
          statusColor: "error",
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article reverted to Unverified");
          setRevertDialogOpen(false);
          router.push("/news-verification");
        },
        onError: () => {
          toast.error("Failed to revert article");
        },
      }
    );
  };

  const handleStorySave = (updates: Partial<NewNewsArticle>) => {
    updateMutation.mutate(
      { id: article.id, data: updates },
      {
        onSuccess: () => {
          toast.success("Story details updated");
        },
        onError: () => {
          toast.error("Failed to update story");
        },
      }
    );
  };

  const actionButtons = (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="gap-1.5"
        onClick={() => setApproveDialogOpen(true)}
      >
        <Check className="size-4" />
        Approve
        <ChevronDown className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon" className="shrink-0" />}
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setRejectDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <XCircle className="size-4 mr-2" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPushBackDialogOpen(true)}>
            <ArrowLeft className="size-4 mr-2" />
            Push Back
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRevertDialogOpen(true)}>
            <RotateCcw className="size-4 mr-2" />
            Revert to Unverified
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <PersonalDetailsSection article={article} />;
      case 1:
        return (
          <StoryDetailsSection
            article={article}
            editable
            onSave={handleStorySave}
            isSaving={updateMutation.isPending}
          />
        );
      case 2:
        return <AttachmentsSection article={article} />;
      case 3:
        return <LinksSection article={article} />;
      case 4:
        return (
          <EditorialNotesSection
            article={article}
            highlightedNote={article.juniorEditorialNotes || undefined}
          />
        );
      case 5:
        return <ChannelDisplaySection article={article} />;
      default:
        return null;
    }
  };

  return (
    <>
      <DetailLayout
        title={article.storyTitle || "Untitled Article"}
        activeStep={1}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        actionButtons={actionButtons}
      >
        {renderSection()}
      </DetailLayout>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Senior Editorial Notes — Approve for Scheduling</DialogTitle>
            <DialogDescription>
              Add notes before approving for scheduling.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertDescription className="text-xs">
                Notes will be pre-filled by AI analysis in Phase 5
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Senior Editorial Notes</Label>
              <Textarea
                value={seniorNotes}
                onChange={(e) => setSeniorNotes(e.target.value)}
                placeholder="Enter your editorial notes..."
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={updateMutation.isPending || !seniorNotes.trim()}
            >
              Approve for Scheduling
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Article</DialogTitle>
            <DialogDescription>
              This will mark the article as rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>This action cannot be undone.</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
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
              disabled={updateMutation.isPending || !rejectReason.trim()}
            >
              Reject Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Push Back Dialog */}
      <Dialog open={pushBackDialogOpen} onOpenChange={setPushBackDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Push Back to Junior Editorial</DialogTitle>
            <DialogDescription>
              Return to Junior Editorial for revision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Revision Instructions *</Label>
              <Textarea
                value={pushBackReason}
                onChange={(e) => setPushBackReason(e.target.value)}
                placeholder="Enter revision instructions..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPushBackDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePushBack}
              disabled={updateMutation.isPending || !pushBackReason.trim()}
            >
              Push Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revert Dialog */}
      <Dialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revert to Unverified</DialogTitle>
            <DialogDescription>
              This requires full re-verification of the article.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This will reset the article to Unverified status, requiring complete
                re-verification.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Revert Reason *</Label>
              <Textarea
                value={revertReason}
                onChange={(e) => setRevertReason(e.target.value)}
                placeholder="Enter the reason for revert..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevertDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevert}
              disabled={updateMutation.isPending || !revertReason.trim()}
            >
              Revert Article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
