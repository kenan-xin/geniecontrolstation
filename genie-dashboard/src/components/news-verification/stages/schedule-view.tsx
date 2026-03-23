"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { DetailLayout } from "../detail-layout";
import type { SectionItem } from "../section-nav";
import {
  PersonalDetailsSection,
  StoryDetailsSection,
  AttachmentsSection,
  LinksSection,
  EditorialNotesSection,
  PublishingScheduleSection,
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
import { Badge } from "@/components/ui/badge";
import { useUpdateNewsArticle } from "@/hooks/use-news-articles";
import type { NewsArticle, NewNewsArticle, EditorialNote, PublishingDetails } from "@/types";
import {
  User,
  FileText,
  Paperclip,
  Link as LinkIcon,
  ShieldCheck,
  CalendarClock,
  Monitor,
} from "lucide-react";

interface ScheduleViewProps {
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

export function ScheduleView({ article }: ScheduleViewProps) {
  const router = useRouter();
  const updateMutation = useUpdateNewsArticle();

  const [activeSection, setActiveSection] = useState(0);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);

  const [rejectReason, setRejectReason] = useState("");
  const [revertReason, setRevertReason] = useState("");

  // Parse existing publishing details or use defaults
  const existingDetails: PublishingDetails | null = article.publishingDetails
    ? JSON.parse(article.publishingDetails)
    : null;

  const [scheduleData, setScheduleData] = useState({
    publishedDateTime: existingDetails?.publishedDateTime || "",
    selectedChannels: existingDetails?.selectedChannels || [],
    publisherNotes: existingDetails?.publisherNotes || "",
  });

  // Sections with confirmed status (all except Publishing Schedule)
  const sections: SectionItem[] = [
    { id: 0, name: "Publishing Schedule", icon: CalendarClock },
    { id: 1, name: "Personal Details", icon: User, confirmed: true },
    { id: 2, name: "Story Details", icon: FileText, confirmed: true },
    { id: 3, name: "Attachments", icon: Paperclip, confirmed: true },
    { id: 4, name: "Links & Proof", icon: LinkIcon, confirmed: true },
    { id: 5, name: "Editorial Notes", icon: ShieldCheck, confirmed: true },
    { id: 6, name: "Channel Display", icon: Monitor, confirmed: true },
  ];

  const handlePublish = () => {
    if (!scheduleData.publishedDateTime) {
      toast.error("Please select a publication date and time");
      return;
    }
    if (scheduleData.selectedChannels.length === 0) {
      toast.error("Please select at least one distribution channel");
      return;
    }

    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : [];

    const newNote: EditorialNote = {
      role: "Publisher",
      action: "Published",
      timestamp: formatTimestamp(),
      content: scheduleData.publisherNotes || "Article published successfully.",
    };

    const publishingDetails: PublishingDetails = {
      publishedDateTime: scheduleData.publishedDateTime,
      selectedChannels: scheduleData.selectedChannels,
      publisherNotes: scheduleData.publisherNotes,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Published",
          statusColor: "success",
          publishedDate: scheduleData.publishedDateTime,
          publishingDetails: JSON.stringify(publishingDetails),
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article published successfully");
          setPublishDialogOpen(false);
          router.push(`/news-verification/published/${article.id}`);
        },
        onError: () => {
          toast.error("Failed to publish article");
        },
      }
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : [];

    const newNote: EditorialNote = {
      role: "Publisher",
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

  const handleRevert = () => {
    if (!revertReason.trim()) {
      toast.error("Please provide a reason for revert");
      return;
    }

    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : [];

    const newNote: EditorialNote = {
      role: "Publisher",
      action: "Reverted",
      timestamp: formatTimestamp(),
      content: revertReason,
    };

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Approval",
          statusColor: "warning",
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        } as Partial<NewNewsArticle>,
      },
      {
        onSuccess: () => {
          toast.success("Article reverted to Approval");
          setRevertDialogOpen(false);
          router.push(`/news-verification/approval/${article.id}`);
        },
        onError: () => {
          toast.error("Failed to revert article");
        },
      }
    );
  };

  const actionButtons = (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="gap-1.5"
        onClick={() => setPublishDialogOpen(true)}
      >
        <Check className="size-4" />
        Publish
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setRejectDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <XCircle className="size-4 mr-2" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRevertDialogOpen(true)}>
            <RotateCcw className="size-4 mr-2" />
            Revert to Approval
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
          <PublishingScheduleSection
            scheduleData={scheduleData}
            onChange={setScheduleData}
          />
        );
      case 1:
        return <PersonalDetailsSection article={article} />;
      case 2:
        return <StoryDetailsSection article={article} />;
      case 3:
        return <AttachmentsSection article={article} />;
      case 4:
        return <LinksSection article={article} />;
      case 5:
        return (
          <EditorialNotesSection
            article={article}
            highlightedNote={article.seniorEditorialNotes || undefined}
          />
        );
      case 6:
        return <ChannelDisplaySection article={article} />;
      default:
        return null;
    }
  };

  // Format datetime for display
  const formatDateTime = (dt: string) => {
    if (!dt) return "Not scheduled";
    return new Date(dt).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const channelLabels: Record<string, string> = {
    website: "Website",
    facebook: "Facebook",
    twitter: "Twitter",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    email: "Email Newsletter",
    telegram: "Telegram",
    newspaper: "Newspaper",
    rss: "RSS Feed",
  };

  return (
    <>
      <DetailLayout
        title={article.storyTitle || "Untitled Article"}
        activeStep={2}
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        actionButtons={actionButtons}
      >
        {renderSection()}
      </DetailLayout>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Publication</DialogTitle>
            <DialogDescription>
              Review the publication details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Scheduled Date & Time
              </span>
              <p className="text-sm font-medium text-foreground">
                {formatDateTime(scheduleData.publishedDateTime)}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Distribution Channels ({scheduleData.selectedChannels.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {scheduleData.selectedChannels.length > 0 ? (
                  scheduleData.selectedChannels.map((channel) => (
                    <Badge key={channel} variant="secondary" className="font-normal">
                      {channelLabels[channel] || channel}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No channels selected
                  </span>
                )}
              </div>
            </div>

            {scheduleData.publisherNotes && (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Publisher Notes
                </span>
                <p className="text-sm text-foreground bg-muted/30 rounded-md p-3 whitespace-pre-wrap">
                  {scheduleData.publisherNotes}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={
                updateMutation.isPending ||
                !scheduleData.publishedDateTime ||
                scheduleData.selectedChannels.length === 0
              }
            >
              Confirm & Publish
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

      {/* Revert Dialog */}
      <Dialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revert to Approval</DialogTitle>
            <DialogDescription>
              Return this article to the Approval stage for editorial re-review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Revert Reason *</Label>
              <Textarea
                value={revertReason}
                onChange={(e) => setRevertReason(e.target.value)}
                placeholder="Enter the reason for reverting..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevertDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRevert}
              disabled={updateMutation.isPending || !revertReason.trim()}
            >
              Revert to Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
