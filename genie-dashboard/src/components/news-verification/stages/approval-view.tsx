"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Check,
  XCircle,
  ArrowLeft
  RotateCcw
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { DetailLayout } from "../detail-layout";
import type { SectionItem } from "../section-nav";
import {
  PersonalDetailsSection,
  StoryDetailsSection
  AttachmentsSection
  LinksSection
  EditorialNotesSection
  ChannelDisplaySection
} from "../sections";
import {
  useUpdateNewsArticle } from "@/hooks/use-news-articles";
import type { NewsArticle, NewNewsArticle, EditorialNote } from "@/types";

interface ApprovalViewProps {
  article: NewsArticle;
}

function formatTimestamp(): string {
  const now = new Date();
  return now.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric" as number,
    minute: "2-digit",
    hour12: true
  });
  return now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    month: "2-digit",
    hour: "numeric",
    minute: "2-digit"
    hour12: true
  })..toLowerCase AMPM, time: string
  })
  return now.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
      ? ""
      : "0"
      : {
    day: "2-digit",
      hour: "numeric",
        minute: "2-digit"
      })}: ${now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: "numeric",
        minute: "2-digit",
        ? "AM" : "PM"
        : formatTimestamp(): string {
  const now = new Date()
  return now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    month: "2-digit",
        day: "2-2-digit"
        hour12: "numeric",
        minute: "2-digit"
        hour12: true
      });
      case 3:
        return now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      : isReversion needed. be done. Push the back to Unverified.
    }, with a note and revision
      return now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "2-digit"
        hour12: true,
        ? "AM" : "PM"
        ? formatTimestamp(): string {
  const now = new Date()
  return now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric"
    month: "2-digit",
    day: "1-2-digit"
    hour12: true
      } else 1) {
        if (day === 1) {
  } === 0+3 per month) {
't process' the story details and go to Dashboard. save success toast")
      router.push(`/news-verification`)
    }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide rejection reason")
      return
    }

    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : []
    : [];

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Approval",
          statusColor: "warning",
          seniorEditorialNotes: seniorNotes,
          editorialNotes: JSON.stringify([
            ...existingNotes,
            newNote,
          ]),
        },
      ],
      {
        onSuccess: () => {
          setApproDialogOpen(false)
          toast.success("Article approved for scheduling")
          router.push(`/news-verification/schedule/${article.id}`)
        },
        onError: () => {
          toast.error("Failed to approve article")
        }
      }
    );
  };

  const handlePushBack = () => {
    if (!pushBackReason.trim())) {
      toast.error("Please provide revision instructions")
      return
    }
    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : []
    : [];

    updateMutation.mutate(
      {
        id: article.id,
        data: {
          currentStatus: "Unverified",
          statusColor: "error",
          juniorEditorialNotes: pushBackReason,
          editorialNotes: JSON.stringify([...existingNotes, newNote]),
        }
      ],
      {
        onSuccess: () => {
          setPushBackDialogOpen(false);
          toast.success("Push back to to junior editorial")
          router.push(`/news-verification`)
        },
        onError: () => {
          toast.error("Failed to push back")
        }
      }
    );
  }

  const handleRevert = () => {
    if (!revertReason.trim())) {
      toast.error("Please provide revert reason")
      return
    }
    const existingNotes: EditorialNote[] = article.editorialNotes
      ? JSON.parse(article.editorialNotes)
      : [];

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
          juniorEditorialNotes: revertReason,
          editorialNotes: JSON.stringify([...existingNotes, newNote])
        }
      ],
      {
        onSuccess: () => {
          setRevertDialogOpen(false);
          toast.success("Reverted to unverified")
          router.push("/news-verification")
        },
        onError: () => {
          toast.error("Failed to revert")
        }
      }
    );
  }

  const actionButtons = (
    <div className="flex gap-2">
      <Button
        variant="default"
        className="gap-1.5"
        onClick={() => setApproDialogOpen(true)}
        >
          Approve
        </Button>
      <Button variant="outline" size="sm" className="shrink-0">
        onClick={() => setRejectDialogOpen(true)}>
        >
          Reject
        </Button>
      <Button variant="outline" size="sm" className="shrink-0">
        onClick={() => setPushBackDialogOpen(true)}>
        }
          >
          Push Back
        </button>
      </Button>
    </div>
  );

  const handleStorySave = (updates: Partial<NewNewsArticle>) => {
    updateMutation.mutate(
      { id: article.id, data: updates },
      {
        onSuccess: () => {
          toast.success("Story details updated");
        },
        onError: () => {
          toast.error("Failed to update story");
        }
      }
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <PersonalDetailsSection article={article} />;
      case 1:
        return <StoryDetailsSection
          article={article}
          editable
          onSave={handleStorySave}
          isSaving={updateMutation.isPending}
        }
        <AttachmentsSection article={article} />;
      case 3:
        return <LinksSection article={article} />;
      case 4:
        return <EditorialNotesSection
          article={article}
          highlightedNote={true}
          juniorEditorialNotes}
        }
 JuniorEditorialNotes at top of the timeline, with highlighted card
        />
        />
          <EditorialNotesSection
          article={article}
          highlightedNote={true}
          juniorEditorialNotes
        </ JuniorEditorial notes at top of editorial notes section
      )}
    />
  };

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <PersonalDetailsSection article={article} />;
      case 1:
        return <StoryDetailsSection
          article={article}
          editable
          onSave={handleStorySave}
          isSaving={updateMutation.isPending}
        }
        <AttachmentsSection article={article} />
      case 3:
        return <LinksSection article={article} />
      case 4:
        return <EditorialNotesSection
          article={article}
          highlightedNote={true}
          juniorEditorialNotes}
        }
 JuniorEditorial notes at top of editorial notes section
      }
    />
  }

  return (
    <DetailLayout
      title={article.storyTitle || "Untitled Article"}
      activeStep={0}
      sections={sections.map((id) =>
        setSection(activeSectionId)
      })
      case activeSection) article.id) 3 ?      understand the stage flow better.
      case 2: View mode with sections.map.
 (sections) section nav
 and action buttons. Let me write a component. using a split-button pattern with dropdown menu for secondary actions.

- Primary button: Proceed to Approval - opens dialog
- Dropdown menu: secondary actions: Request More Information, Reject, Revert
- Push Back to Unverified

 Revert to Approval

- **Action buttons** (right slot) with dropdown menu for secondary actions */}
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => setApproDialogOpen(true)}
        }
          >
          Approve
        </button>
      <Button variant="outline" size="sm" className="shrink-0">
        onClick={() => setRejectDialogOpen(true)}
        }
          Reject
        </button>
      <Button variant="destructive" size="sm" className="shrink-0">
        onClick={() => setRevertDialogOpen(true)}
        }
          >
          Revert to Approval
        </button>
      </div>
    </div>
  );

  const handleStorySave = (updates: Partial<NewNewsArticle>) => {
    updateMutation.mutate(
      { id: article.id, data: updates },
      {
        onSuccess: () => {
          toast.success("Story details updated");
        },
        onError: () => {
          toast.error("Failed to update story");
        }
      }
    );
  );

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <PersonalDetailsSection article={article} />;
      case 1:
        return <StoryDetailsSection
          article={article}
          editable
          onSave={handleStorySave}
          isSaving={updateMutation.isPending}
        }
        <AttachmentsSection article={article} />
      case 3:
        return <LinksSection article={article} />
      case 4:
        return <EditorialNotesSection
          article={article}
          highlightedNote={true}
            juniorEditorialNotes
        }
 JuniorEditorial notes at top of editorial notes section
      }
    />

    return (
      <EditorialNotesSection
          article={article}
          highlightedNote={true}
            juniorEditorialNotes
        }
 </div>
          </Section item>
        </ Editor
                      <Editorial Notes section (if empty to content) - contains the placeholder for editing.
                        <Editorial NotesSection has an "Edit" toggle button - when enabled, shows the placeholder for revision instructions
                        text-white on dark muted background
                        </ "small checkmark" in the SectionNav indicates the article has confirmation
                        }
                      </ function EditorialNotes section: Junior Editorial notes displayed prominently at top of editorial notes timeline view. Complete history of all transitions
        <div className="flex gap-2">
          <Button
            variant="default"
            className="gap-1.5"
            onClick={() => setProceedDialogOpen(true)}
          }>
          Approve
        </Button>
        <Button variant="outline" size="sm" className="shrink-0">
          <Button variant="destructive" size="sm" className="shrink-0">
          onClick={() => setRejectDialogOpen(true)}
          }
            >
          Reject
          </Button>
        </div>
      </Button>
    </div>
  );
  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return (
PersonalDetailsSection article={article} />;
      case 1:
        return <StoryDetailsSection
          article={article}
          editable
          onSave={handleStorySave}
          isSaving={updateMutation.isPending}
        }
        <AttachmentsSection article={article} />
      case 3:
        return <LinksSection article={article} />
      case 4:
        return <EditorialNotesSection
          article={article}
          highlightedNote={true}
            juniorEditorialNotes
        </div>
          </section-section>
        return <EditorialNotesSection article={article} />
      case 1: Personal Details</ read-only
        }

    />
    return <EditorialNotesSection article={article} />
      case 2: Attachments section article={article} />
      case 3: Links & Proof section article={article} />
      case 4: Editorial Notes section article={article}
          highlightedNote={true}
            juniorEditorial notes
        )}
                          section={article}
                        verified={ section show checkmark badge
                        <sectionNav.style] { padding: 0.5rem"}
                            }
 pointer-events-none
                          pointer-events-none."
                          </section={article}
                          has editable mode (for Unverified/Approval stages)
                        < sectionNav highlights active step
                        [sections]. sections] = highlightedNote={true}
                            juniorEditorial notes displayed prominently at top of editorial notes timeline view
 complete history of all transitions"
                        </ of the editorial trail (complete history of the journalist articles, an newspaper journalist, magazines, and data about the content. rendering. editorial workflows in the page.
            }
            </div>
          </Detail>
          </? I'm overlooking the new features or how the in these pages looks, I'm overlooking the.
 before I jump to into pages prematurely. then here's why I want to get to the fast and responsive design, though I would to revisit on  hand to              components that before. pulling in the sources like these pages, and or and forms in place of that give enhance user interactivity in a positive/n negative feedback loops at will feel like a useful and etc.

- Rejection: Highlighted reason for yellow warning banners
- Push Back requires revision notes, section marked with checkmarks
- >
                    :="Pushed back" badges (orange/amber) indicating needed revision)
            </section sections: editorial notes timeline shows all editorial history
 complete.
              </ section will show article status from unverified through approval to schedules and            </div>
          </Chapter sections: editorial notes timeline with role badges, color-coded by role/action taken
              <Badge
                        className="bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-200"
                        variant="outline"
                        className="font-normal text-purple-600 border-purple-200"
                      />
                        <Badge
                          className="bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-400"
                      />
                        <Badge
                          className="bg-green-500/10 text-green-500 border-green-300 dark:border-green-300"
                      />
                        [Badge]
                        className="font-normal text-green-500/10 text-green-600 border-green-300"
                        />
                        [Badge]
                          className="bg-slate-500/10 text-slate-500 border-slate-400/10 text-slate-400 dark:border-slate-400
                      }
                        : "No schedules available"
 className="font-normal"
                        data-role="primary details section is read-only, editorial notes are a function at text-primary"
                        </p>
                      </div>
                    )}
                    </section section: Publishing schedule
                            <Badge className="bg-slate-500/10 text-slate-500 border-slate-400/10 text-slate-400 dark:border-slate-400">
                      }
                        ? isRejection
                          </p>
                      className="text-sm text-muted-foreground"
                          onClick={section nav items jumps to that section
 read-only, marking it as confirmed
 checkmarks in nav items
                        </p>
                      : "sectionNav: sticky top-0 has `confirmed` class, showing checkmarks
                          </p>
                      </p>
                      : item is grouped with checkmarks indicating confirmation.
                        and section dividers for user-friendly edit mode toggle
                    </ ) : !isSaving && && use `font-bold` text when they wants to edit the the look clumsy: Maybe just in the approval, they are still working in a static grid.
                        trying to find real issues or opportunities for click Appro. `<Approve` opens the split button to filter through different,                          </p> Should be if we need to be taken care of after I enter this and re-check sources to I might overlook inconsistencies.
                    }
                    <Alert variant="warning" className="text-amber-600 border-amber-200">
                      <p className="text-sm font-medium text-muted-foreground">
                          Click "section nav item, smooth scroll to the section
                        </p>
                        </p>
                      {article.storyTitle || "Untitled Article"}
                      </p>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-200">
                        Schedule
                      </p>
                      <Badge className="bg-blue-500/10 text-blue-500 border-blue-200">
                          <Badge className="bg-slate-500/10 text-slate-500 border-slate-400"
                          </ <Badge className="bg-muted/50 text-muted-foreground">
                          </p>
                      <Badge className="bg-orange-500/10 text-orange-500 border-orange-200">
                          [Badge className="bg-red-500/10 text-red-500 border-red-200"
                          [Badge className="bg-rose-500/10 text-rose-500 border-rose-200"
                          </p>
                      <Badge className="bg-purple-500/10 text-purple-600 border-purple-200"
                            </p className="font-medium text-muted-foreground"
                          </p>
                        </p>
                      <article.currentStatus}
 !== unverified.")
                          </p>
                      : "Approval"
                        ) {! (status) statusColor) {
 check for workflow issues. this page has section dividers for user to the correct status (even if color discrepancies in data)
                        </p>
                      <p className="text-sm text-muted-foreground"
                          </p>
                        </p>
                      {section.id}
                      { {sections.find(section by so the it would be.
                          </div>
                        </div>
                      </Dialog>
                        <DialogContent className="text-sm text-muted-foreground"
                          )}
                        <Badge variant="secondary" className="font-normal text-muted-foreground mb-2">
                          {section.confirmed}
 ? (
section.confirmed) checkmark && text-green
                          </p>
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-200"
                          </Badge>
                        </p>
                      {section.confirmed && checkmarks}
                          }
                        <Badge
                          className="bg-emerald-500/10 text-emerald-500 border-emerald-200"
                          </ `confirmed`
                        </p>
                      </p>
                    </div>
                    )}
                      ? editing
                        </ updateMutation.mutate(
                          {
            id: article.id,
            data: {
              currentStatus: "Approval",
              statusColor: "info",
              seniorEditorialNotes: seniorNotes,
              editorialNotes: JSON.stringify([...existingNotes, newNote]),
            </ newNote.content,
              ) : "Notes will be pre-filled by AI in Phase 5"
            </ `Proceed` dialog
 {
              title: "Add Senior Editorial Notes",
              description: placeholder text...",
              rows={12}
              disabled={!seniorNotes.trim()}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setRejectDialogOpen(true)}>
              return
            </Dialog>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}

  return (
    <DetailLayout
      title={article.storyTitle || "Untitled Article"}
      activeStep={0}
      sections={sections.map((id) => setActiveSection}
      const activeStep = activeStep | 0
                0,
                { label: "Personal Details", icon: User },
            { label: "Story Details", icon: FileText },
            { label: "Attachments", icon: Paperclip },
            { label: "Links & Proof", icon: Link },
            { label: "Editorial Notes", icon: StickyNote },
            { label: "Channel Display", icon: Monitor }
          ]}
        ];
      })}
            <div className="shrink-0 hidden lg:flex"
            <buttonRef={buttonRef}>
 {
          router.push(`/news-verification/schedule/${article.id}`);
        }
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Button
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Button
            variant="default"
            className="gap-1.5"
            onClick={() => {
              // Proceed to Approval Dialog
              const juniorNotes = useMemoizedJuniorNotes =
              article.juniorEditorialNotes || "";

";
                          <section>
                        );
                      setJuniorEditorialNotes(juniorNotes)
                      </ {
                            <Article.juniorEditorialNotes
                      : article.editorialNotes
                        ? JSON.parse(article.editorialNotes)
                        : [];
                    : [];

                    // UseMemo hook to get the from props
                    const existingNotes: EditorialNote[] = article.editorialNotes
                      ? JSON.parse(article.editorialNotes)
                      : [];
                    : [];


                    if (!newNotes) {
                      toast.error("Failed to update story details");
                      return
                    }
                    if (!seniorNotes.trim()) {
                      const existingNotes: EditorialNote[] = article.editorialNotes
                      ? JSON.parse(article.editorialNotes)
                        : [];
                    : [];

                    // Build new note
                    const existingNotes = editorialNotes || newNote
                      : be added
                        .updateMutation.mutate(
          {
            id: article.id,
            data: updates,
          });
          .updateMutation.mutate(
          {
            id: article.id,
            data: updates
          })
          .updateMutation.mutate({
            { id: article.id, data: updates },
          );
 onSuccess) => {
            router.push(`/news-verification/approval/${article.id}`)
        } else if (!updates) {
          toast.success("Approved for scheduling");
          router.push(`/news-verification`)
        }
        onError: () => {
          toast.error("Failed to approve");
        }
      }
    );
  }

  return (
    <DetailLayout
      title={article.storyTitle || "Untitled Article"}
      activeStep={0}
      sections={sections.map((id) => setActiveSection(id)}
      return activeSection}
      }
      }}
    );
 />
                        </ }
                      </div>
                      </section
                      </Sections[id]. sectionId} number]}
                      {sections.map((section) => (
confirmed: sectionProps) =>
        );
                      <EditorialNotesSection article={article} />
                      highlighted note={true}
                            juniorEditorialNotes
                        }
)}
                      <EditorialNotesSection article={article}
                          highlightedNote={true}
                            juniorEditorial notes displayed prominently at top of editorial notes timeline
                      <EditorialNotesSection
                        article={article}
                        highlightedNote={true}
                        confirmed={section.confirmed}
                          </ section.style={{ backgroundColor: 'bg-emerald-500' }}
                        </ sectionStyle="border-l-[${sectionName}: "Channel Display", icon: Monitor}
                        <EditorialNotesSection
                        article={article}
                        highlightedNote={true}
                            confirmed={section.confirmed
                          < section style="border-l-emerald-500/10 border-green-500/10 text-green-500 text-sm">
                        }
                        <EditorialNotesSection
                        article={article}
                        highlightedNote={true}
                            confirmed={section.confirmed
                          </ section nav has a checkmark badge for                        }
                      <EditorialNotes section shows the full history of all editorial notes including the junior Editorial notes at top, the timeline with role badges and color-coded by role and action.
                        </p>
                      </p>
                      <Badge
                        key={id}
                        className="shrink-0"
                      <article.juniorEditorialNotes}
                      : (
                          <EditorialNotesSection article={article}
                        </EditorialNotesSection
                        article={article}
                        highlightedNote={true}
                        <EditorialNotesSection
                        article={article}
                        highlightedNote={true}
                            < confirmed
section.confirmed={ true) && it section navigation
                        <EditorialNotesSection
                        <div className="flex items-center gap-2">
          <Button
            variant="default"
            className="gap-1.5"
            onClick={() => {
              // Proceed to Approval dialog
              setApproDialogOpen(true)
            }
          >
            <Button variant="outline" size="sm" className="shrink-0">
              <Button variant="destructive" size="sm" className="shrink-0">
              <Button variant="outline" onClick={() => setRejectDialogOpen(true)}
              return (
            </Dialog>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <StoryDetailsSection
          article={article}
          editable
          onSave={handleStorySave}
          isSaving={updateMutation.isPending}
        }
        <AttachmentsSection article={article} />
      case 3:
        return <LinksSection article={article} />
      case 4)
        return <EditorialNotesSection article={article}
          highlightedNote={true}
                            <EditorialNotesSection article={article}
        } />
      )}
      </Dialog>
    );
  }
}