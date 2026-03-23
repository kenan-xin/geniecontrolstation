"use client";

import { useState } from "react";
import { DetailLayout } from "../detail-layout";
import type { SectionItem } from "../section-nav";
import {
  PersonalDetailsSection,
  StoryDetailsSection,
  AttachmentsSection,
  LinksSection,
  EditorialNotesSection,
  ChannelDisplaySection,
  PerformanceMetricsSection,
  PublishingDetailsSection,
} from "../sections";
import type { NewsArticle, PerformanceMetrics, PublishingDetails } from "@/types";
import {
  User,
  FileText,
  Paperclip,
  Link as LinkIcon,
  ShieldCheck,
  CalendarClock,
  Monitor,
  TrendingUp,
} from "lucide-react";

interface PublishedViewProps {
  article: NewsArticle;
}

export function PublishedView({ article }: PublishedViewProps) {
  const [activeSection, setActiveSection] = useState(0);

  // Parse performance metrics
  const metrics: PerformanceMetrics | null = article.performanceMetrics
    ? JSON.parse(article.performanceMetrics)
    : null;

  // Parse publishing details
  const publishingDetails: PublishingDetails | null = article.publishingDetails
    ? JSON.parse(article.publishingDetails)
    : null;

  // All sections are read-only in Published state
  const sections: SectionItem[] = [
    { id: 0, name: "Performance Metrics", icon: TrendingUp },
    { id: 1, name: "Personal Details", icon: User },
    { id: 2, name: "Story Details", icon: FileText },
    { id: 3, name: "Attachments", icon: Paperclip },
    { id: 4, name: "Links & Proof", icon: LinkIcon },
    { id: 5, name: "Editorial Trail", icon: ShieldCheck },
    { id: 6, name: "Publishing Details", icon: CalendarClock },
    { id: 7, name: "Channel Display", icon: Monitor },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 0:
        return <PerformanceMetricsSection metrics={metrics} />;
      case 1:
        return <PersonalDetailsSection article={article} />;
      case 2:
        return <StoryDetailsSection article={article} />;
      case 3:
        return <AttachmentsSection article={article} />;
      case 4:
        return <LinksSection article={article} />;
      case 5:
        // Editorial Trail shows complete history
        return <EditorialNotesSection article={article} />;
      case 6:
        return <PublishingDetailsSection details={publishingDetails} />;
      case 7:
        return <ChannelDisplaySection article={article} />;
      default:
        return null;
    }
  };

  return (
    <DetailLayout
      title={article.storyTitle || "Untitled Article"}
      activeStep={3}
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      // No action buttons for published articles
    >
      {renderSection()}
    </DetailLayout>
  );
}
