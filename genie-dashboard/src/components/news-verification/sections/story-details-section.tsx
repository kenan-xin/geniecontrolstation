"use client";

import { useState } from "react";
import { FileText, Edit2, X, Check, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NewsArticle, NewNewsArticle } from "@/types";

const categoryOptions = [
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "Environment",
  "Crime",
  "Community",
];

const urgencyOptions = ["Critical", "High", "Medium", "Low"];

const impactOptions = ["National", "Regional", "Local", "International"];

const urgencyColors: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800",
  High: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800",
  Low: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-800",
};

interface StoryDetailsSectionProps {
  article: NewsArticle;
  editable?: boolean;
  onSave?: (updates: Partial<NewNewsArticle>) => void;
  isSaving?: boolean;
}

export function StoryDetailsSection({
  article,
  editable = false,
  onSave,
  isSaving = false,
}: StoryDetailsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    storyTitle: article.storyTitle || "",
    storyDescription: article.storyDescription || "",
    storyCategory: article.storyCategory || "",
    storyUrgency: article.storyUrgency || "",
    storyEstimatedImpact: article.storyEstimatedImpact || "",
  });

  const handleSave = () => {
    onSave?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      storyTitle: article.storyTitle || "",
      storyDescription: article.storyDescription || "",
      storyCategory: article.storyCategory || "",
      storyUrgency: article.storyUrgency || "",
      storyEstimatedImpact: article.storyEstimatedImpact || "",
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            Story Details
          </CardTitle>
          {editable && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Edit2 className="size-3.5" />
              Edit
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
                disabled={isSaving}
              >
                <X className="size-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0"
                disabled={isSaving}
              >
                <Check className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Title
              </label>
              <Input
                value={formData.storyTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, storyTitle: e.target.value }))
                }
                placeholder="Story title..."
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Description
              </label>
              <Textarea
                value={formData.storyDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    storyDescription: e.target.value,
                  }))
                }
                placeholder="Story description..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <Select
                  value={formData.storyCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, storyCategory: value }))
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Urgency
                </label>
                <Select
                  value={formData.storyUrgency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, storyUrgency: value }))
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map((urg) => (
                      <SelectItem key={urg} value={urg}>
                        {urg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Impact
                </label>
                <Select
                  value={formData.storyEstimatedImpact}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      storyEstimatedImpact: value,
                    }))
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    {impactOptions.map((imp) => (
                      <SelectItem key={imp} value={imp}>
                        {imp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Title
              </span>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {article.storyTitle || (
                  <span className="text-muted-foreground italic">
                    No title provided
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Description
              </span>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {article.storyDescription || (
                  <span className="text-muted-foreground italic">
                    No description provided
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {article.storyCategory && (
                <Badge variant="secondary" className="font-normal">
                  {article.storyCategory}
                </Badge>
              )}
              {article.storyUrgency && (
                <Badge
                  variant="outline"
                  className={cn(
                    "font-normal",
                    urgencyColors[article.storyUrgency]
                  )}
                >
                  {article.storyUrgency}
                </Badge>
              )}
              {article.storyEstimatedImpact && (
                <Badge variant="outline" className="font-normal">
                  {article.storyEstimatedImpact}
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
