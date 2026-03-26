import type { NewsArticle, Link, Attachment } from "@/types";
import type { FactCheckResponse, FactCheckItem, RelevanceItem } from "@/types/fact-check";

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

function getStatusText(status: FactCheckItem["status"]): string {
  if (status === "ok") return "[OK]";
  if (status === "warning") return "[WARNING]";
  return "[ERROR]";
}

function getScoreLabel(score: number): string {
  if (score < 4) return "Low";
  if (score <= 6) return "Medium";
  return "High";
}

function getRecommendation(
  factualAccuracy: FactCheckResponse["factualAccuracy"],
  newsworthyRelevance: FactCheckResponse["newsworthyRelevance"],
  contentIntegrity: FactCheckResponse["contentIntegrity"]
): string {
  const errors = [
    ...factualAccuracy.items,
    ...contentIntegrity.items,
  ].filter((item) => item.status === "error").length;

  const warnings = [
    ...factualAccuracy.items,
    ...contentIntegrity.items,
  ].filter((item) => item.status === "warning").length;

  const lowScores = newsworthyRelevance.items.filter((item) => item.score < 4).length;

  if (errors > 0) {
    return "REJECT — Critical issues found requiring immediate attention";
  }
  if (warnings > 2 || lowScores > 2) {
    return "NEEDS REVISION — Multiple concerns require addressing before approval";
  }
  if (warnings > 0 || lowScores > 0) {
    return "PROCEED WITH CAUTION — Minor concerns noted, recommend review";
  }
  return "APPROVE — Article meets editorial standards";
}

export function generateJuniorEditorialNotes(
  factCheckData: FactCheckResponse,
  article: NewsArticle
): string {
  const timestamp = formatTimestamp();
  const { factualAccuracy, newsworthyRelevance, contentIntegrity, references } = factCheckData;

  const links = article.links
    ? typeof article.links === "string"
      ? JSON.parse(article.links)
      : article.links
    : [];

  const attachments = article.attachments
    ? typeof article.attachments === "string"
      ? JSON.parse(article.attachments)
      : article.attachments
    : [];

  const verifiedLinks = links.filter((link: Link) => link.verified).length;
  const recommendation = getRecommendation(factualAccuracy, newsworthyRelevance, contentIntegrity);

  const sections: string[] = [];

  // Header
  sections.push(`JUNIOR EDITORIAL REVIEW — ${timestamp}`);
  sections.push("═".repeat(50));
  sections.push("");

  // Sources Verification
  sections.push("SOURCES VERIFICATION");
  sections.push("─".repeat(20));
  sections.push(`Submitter: ${article.submitterFullName || "Unknown"}`);
  sections.push(`Source: ${article.sources || "Not specified"}`);
  sections.push(`Proof links: ${links.length} provided, ${verifiedLinks} verified`);
  sections.push("");

  // Fact-Checking Analysis
  sections.push("FACT-CHECKING ANALYSIS");
  sections.push("─".repeat(22));
  factualAccuracy.items.forEach((item) => {
    sections.push(`${getStatusText(item.status)} ${item.key}: ${item.message}`);
  });
  sections.push("");

  // Newsworthy Assessment
  sections.push("NEWSWORTHY ASSESSMENT");
  sections.push("─".repeat(21));
  sections.push(`Overall Score: ${newsworthyRelevance.overallScore}/10`);
  newsworthyRelevance.items.forEach((item) => {
    sections.push(`${item.key} (${item.score}/10): ${item.message}`);
  });
  sections.push("");

  // Content Integrity Check
  sections.push("CONTENT INTEGRITY CHECK");
  sections.push("─".repeat(23));
  contentIntegrity.items.forEach((item) => {
    sections.push(`${getStatusText(item.status)} ${item.key}: ${item.message}`);
  });
  sections.push("");

  // References Summary
  sections.push("REFERENCES SUMMARY");
  sections.push("─".repeat(18));
  sections.push(`Total references: ${references.length}`);
  const highConfidence = references.filter((r) => r.confidence === "High").length;
  sections.push(`High confidence sources: ${highConfidence}`);
  sections.push("");

  // Editorial Standards Compliance
  sections.push("EDITORIAL STANDARDS COMPLIANCE");
  sections.push("─".repeat(31));
  const errorCount = factualAccuracy.items.filter((i) => i.status === "error").length +
    contentIntegrity.items.filter((i) => i.status === "error").length;
  const warningCount = factualAccuracy.items.filter((i) => i.status === "warning").length +
    contentIntegrity.items.filter((i) => i.status === "warning").length;

  if (errorCount === 0 && warningCount === 0) {
    sections.push("Article meets all editorial standards.");
  } else if (errorCount > 0) {
    sections.push(`Article has ${errorCount} critical issue(s) and ${warningCount} warning(s).`);
  } else {
    sections.push(`Article has ${warningCount} warning(s) but no critical issues.`);
  }
  sections.push("");

  // Recommendation
  sections.push("RECOMMENDATION");
  sections.push("─".repeat(14));
  sections.push(recommendation);

  return sections.join("\n");
}

export function generateSeniorEditorialNotes(article: NewsArticle): string {
  const timestamp = formatTimestamp();

  const links = article.links
    ? typeof article.links === "string"
      ? JSON.parse(article.links)
      : article.links
    : [];

  const attachments = article.attachments
    ? typeof article.attachments === "string"
      ? JSON.parse(article.attachments)
      : article.attachments
    : [];

  const sections: string[] = [];

  // Header
  sections.push(`SENIOR EDITORIAL REVIEW — ${timestamp}`);
  sections.push("═".repeat(50));
  sections.push("");

  // Grammar Assessment
  sections.push("GRAMMAR ASSESSMENT");
  sections.push("─".repeat(18));
  sections.push("Review for spelling, grammar, and punctuation errors.");
  sections.push(`Story length: ${article.storyDescription?.length || 0} characters`);
  sections.push("");

  // Tone & Style Review
  sections.push("TONE & STYLE REVIEW");
  sections.push("─".repeat(19));
  sections.push("Assess consistency with publication voice and style guide.");
  sections.push("Check for bias, objectivity, and appropriate language.");
  sections.push("");

  // Content Completeness
  sections.push("CONTENT COMPLETENESS");
  sections.push("─".repeat(20));
  sections.push(`Title: ${article.storyTitle ? "Present" : "Missing"}`);
  sections.push(`Description: ${article.storyDescription ? "Present" : "Missing"}`);
  sections.push(`Sources: ${article.sources || "Not specified"}`);
  sections.push(`Attachments: ${attachments.length} file(s)`);
  sections.push(`Links: ${links.length} link(s) provided`);
  sections.push("");

  // Visual Content Review
  sections.push("VISUAL CONTENT REVIEW");
  sections.push("─".repeat(21));
  if (attachments.length > 0) {
    sections.push(`${attachments.length} visual attachment(s) available for review.`);
  } else {
    sections.push("No visual attachments provided.");
    sections.push("Consider requesting supporting media if applicable.");
  }
  sections.push("");

  // Editorial Decision
  sections.push("EDITORIAL DECISION");
  sections.push("─".repeat(18));
  sections.push("Based on junior editorial review and senior assessment:");
  sections.push("");
  sections.push("☐ Grammar and style verified");
  sections.push("☐ Content completeness confirmed");
  sections.push("☐ Sources validated");
  sections.push("☐ Visual content reviewed (if applicable)");
  sections.push("");
  sections.push("Decision: APPROVED FOR SCHEDULING");

  return sections.join("\n");
}

export function generatePublisherNotes(article: NewsArticle): string {
  const timestamp = formatTimestamp();

  const publishingDetails = article.publishingDetails
    ? typeof article.publishingDetails === "string"
      ? JSON.parse(article.publishingDetails)
      : article.publishingDetails
    : null;

  const selectedChannels = publishingDetails?.selectedChannels || [];

  const sections: string[] = [];

  // Header
  sections.push(`PUBLISHER NOTES — ${timestamp}`);
  sections.push("═".repeat(50));
  sections.push("");

  // Recommended Timing
  sections.push("RECOMMENDED TIMING");
  sections.push("─".repeat(18));
  sections.push("Optimal publishing windows for maximum engagement:");
  sections.push("");
  sections.push("• Weekday mornings (8-10 AM local time)");
  sections.push("• Early afternoon (1-3 PM)");
  sections.push("• Avoid late evening and weekends for news content");
  sections.push("");

  // Channel Distribution Strategy
  sections.push("CHANNEL DISTRIBUTION STRATEGY");
  sections.push("─".repeat(29));
  if (selectedChannels.length > 0) {
    sections.push(`Selected channels: ${selectedChannels.join(", ")}`);
  } else {
    sections.push("Recommended channels based on content type:");
    sections.push("• Website — Primary publication");
    sections.push("• Social media — Twitter/X, Facebook for breaking news");
    sections.push("• Email newsletter — For subscriber engagement");
  }
  sections.push("");

  // Audience Considerations
  sections.push("AUDIENCE CONSIDERATIONS");
  sections.push("─".repeat(22));
  sections.push("Target audience demographics and engagement patterns:");
  sections.push("");
  sections.push("• Primary: News readers interested in current events");
  sections.push("• Secondary: Social media followers seeking updates");
  sections.push("• Consider timezone distribution for international reach");
  sections.push("");

  // Publication Checklist
  sections.push("PUBLICATION CHECKLIST");
  sections.push("─".repeat(20));
  sections.push("☐ Final headline review");
  sections.push("☐ Featured image selected");
  sections.push("☐ Social media copy prepared");
  sections.push("☐ SEO metadata configured");
  sections.push("☐ Scheduled time confirmed");
  sections.push("");
  sections.push("Status: READY FOR PUBLICATION");

  return sections.join("\n");
}
