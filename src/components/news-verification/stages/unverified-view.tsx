"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Mail, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DetailLayout } from "../detail-layout";
import type { SectionItem } from "../section-nav";
import {
  PersonalDetailsSection,
  StoryDetailsSection,
  AttachmentsSection,
  LinksSection,
  EditorialNotesSection,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateNewsArticle } from "@/hooks/use-news-articles";
import { useNewsFactCheck } from "@/hooks/use-news-fact-check";
import { AiInsightsDrawer, AiInsightsFab } from "../ai-insights-drawer";
import { generateJuniorEditorialNotes } from "@/lib/editorial-notes";
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
} from "lucide-react";

interface UnverifiedViewProps {
  article: NewsArticle;
}

function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function UnverifiedView({ article }: UnverifiedViewProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [proceedDialogOpen, setProceedDialogOpen] = useState(false);
  const [requestInfoDialogOpen, setRequestInfoDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  const [editorialNotes, setEditorialNotes] = useState("");
  const [requestSubject, setRequestSubject] = useState(
    "Additional Information Required"
  );
  const [requestMessage, setRequestMessage] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const updateMutation = useUpdateNewsArticle();

  // AI Fact-check hook - auto-fetches when title/description are available
  const { data: factCheckData, isLoading: factCheckLoading, isFetching: factCheckFetching, isError: factCheckError, error: factCheckErrorObj, refetch: refetchFactCheck } = useNewsFactCheck(article.storyTitle || "", article.storyDescription || "");

  // Calculate warning count for FAB badge
  const warningCount = useMemo(() => {
    if (!factCheckData) return 0;
    const items = [
      ...factCheckData.factualAccuracy.items,
      ...factCheckData.contentIntegrity.items,
    ];
    return items.filter((item) => item.status === "error" || item.status === "warning").length;
  }, [factCheckData]);

  // Pre-fill editorial notes when dialog opens with AI-generated notes
  useEffect(() => {
    if (proceedDialogOpen && factCheckData && !editorialNotes) {
      setEditorialNotes(generateJuniorEditorialNotes(factCheckData, article));
    }
  }, [proceedDialogOpen, factCheckData, article, editorialNotes]);

  // Regenerate AI notes
  const handleRegenerateNotes = () => {
    if (factCheckData) {
      setEditorialNotes(generateJuniorEditorialNotes(factCheckData, article));
      toast.success("AI notes regenerated");
    }
  };

  const sections: SectionItem[] = [
    { id: 0, name: "Personal Details", icon: User },
    { id: 1, name: "Story Details", icon: FileText },
    { id: 2, name: "Attachments", icon: Paperclip },
    { id: 3, name: "Links & Proof", icon: LinkIcon },
    { id: 4, name: "Editorial Notes", icon: StickyNote },
  ];

  const handleProceedToApproval = () => {
    if (!editorialNotes.trim()) {
      toast.error("Please add editorial notes");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Junior Editorial",
      action: "Submitted for Approval",
      timestamp: formatTimestamp(),
      content: editorialNotes,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Approval",
          statusColor: "warning",
          juniorEditorialNotes: editorialNotes,
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article submitted for approval");
          setProceedDialogOpen(false);
          router.push(`/news-verification/approval/${article.id}`);
        },
        onError: () => {
          toast.error("Failed to submit for approval");
        },
      }
    );
  };

  const handleRequestInfo = () => {
    toast.success("Request sent successfully");
    setRequestInfoDialogOpen(false);
    setRequestMessage("");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const existingNotes: EditorialNote[] = safeJsonParse<EditorialNote[]>(article.editorialNotes) || [];

    const newNote: EditorialNote = {
      role: "Junior Editorial",
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
        className="gap-1.5 min-[400px]:w-auto w-full"
        onClick={() => setProceedDialogOpen(true)}
      >
        Proceed to Approval
        <ChevronDown className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline" size="icon" className="shrink-0 hidden min-[400px]:flex" />}
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRequestInfoDialogOpen(true)}>
            <Mail className="size-4 mr-2" />
            Request More Information
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setRejectDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <XCircle className="size-4 mr-2" />
            Reject News Lead
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
        return <EditorialNotesSection article={article} />;
      default:
        return null;
    }
  };

  return (
    <>
      <DetailLayout
        title={article.storyTitle || "Untitled Article"}
        activeStep={0}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        actionButtons={actionButtons}
      >
        {renderSection()}
      </DetailLayout>

      {/* Proceed to Approval Dialog */}
      <Dialog open={proceedDialogOpen} onOpenChange={setProceedDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Junior Editorial Notes</DialogTitle>
            <DialogDescription>
              Add notes before submitting for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Editorial Notes</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateNotes}
                disabled={!factCheckData}
                className="h-7 gap-1 text-xs"
              >
                <Sparkles className="h-3 w-3" />
                Regenerate AI Notes
              </Button>
            </div>
            <Textarea
              value={editorialNotes}
              onChange={(e) => setEditorialNotes(e.target.value)}
              placeholder="Enter your editorial notes..."
              rows={12}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProceedDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToApproval}
              disabled={updateMutation.isPending || !editorialNotes.trim()}
            >
              Confirm & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request More Information Dialog */}
      <Dialog open={requestInfoDialogOpen} onOpenChange={setRequestInfoDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request More Information</DialogTitle>
            <DialogDescription>
              Send a request to the submitter for additional information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input
                type="email"
                value={article.submitterEmail || ""}
                readOnly
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={requestSubject}
                onChange={(e) => setRequestSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Enter your request message..."
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRequestInfoDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRequestInfo}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject News Lead Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject News Lead</DialogTitle>
            <DialogDescription>
              This will mark the article as rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This action cannot be undone. The article will be marked as
                rejected.
              </AlertDescription>
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
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
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

      {/* AI Insights FAB and Drawer */}
      <AiInsightsFab
        warningCount={warningCount}
        isLoading={factCheckLoading}
        isFetching={factCheckFetching}
        onClick={() => setAiDrawerOpen(true)}
      />
      <AiInsightsDrawer
        factCheckData={factCheckData}
        isLoading={factCheckLoading}
        isFetching={factCheckFetching}
        isError={factCheckError}
        error={factCheckErrorObj}
        onRegenerate={() => void refetchFactCheck()}
        open={aiDrawerOpen}
        onOpenChange={setAiDrawerOpen}
      />
    </>
  );
}
