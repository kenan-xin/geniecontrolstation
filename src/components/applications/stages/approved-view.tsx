"use client";

import { useState } from "react";
import { User, FileText, Clock } from "lucide-react";
import { ApplicationDetailLayout } from "../detail-layout";
import type { SectionItem } from "@/components/news-verification/section-nav";
import type { Application } from "@/types";
import {
  CandidateInfoSection,
  ApplicationProgressSection,
  AssignmentSection,
  TimelineSection,
} from "../sections";

interface ApprovedViewProps {
  application: Application;
}

export function ApprovedView({ application }: ApprovedViewProps) {
  const [activeSection, setActiveSection] = useState(0);

  const sections: SectionItem[] = [
    { id: 0, name: "Candidate Info", icon: User },
    { id: 1, name: "Progress", icon: FileText },
    { id: 2, name: "Assignment", icon: User },
    { id: 3, name: "Timeline", icon: Clock },
  ];

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

  return (
    <ApplicationDetailLayout
      title={application.candidateName || "Untitled Application"}
      activeStep={3}
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSection()}
    </ApplicationDetailLayout>
  );
}
