"use client";

import { useState } from "react";
import { User, FileText, Paperclip, Link2, StickyNote, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateNewsArticle } from "@/hooks/use-news-articles";
import type { Attachment, Link } from "@/types";

interface CreateNewsLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  // Personal Details
  submitterFullName: string;
  submitterIc: string;
  submitterAddress: string;
  submitterPhone: string;
  submitterEmail: string;
  // Story Details
  storyTitle: string;
  storyDescription: string;
  storyCategory: string;
  storyUrgency: string;
  storyEstimatedImpact: string;
  // Attachments
  attachments: Attachment[];
  // Links
  links: Link[];
  // Editorial Notes
  editorialNotes: string;
}

interface FormErrors {
  submitterFullName?: string;
  storyTitle?: string;
  storyDescription?: string;
}

const initialFormData: FormData = {
  submitterFullName: "",
  submitterIc: "",
  submitterAddress: "",
  submitterPhone: "",
  submitterEmail: "",
  storyTitle: "",
  storyDescription: "",
  storyCategory: "",
  storyUrgency: "",
  storyEstimatedImpact: "",
  attachments: [],
  links: [],
  editorialNotes: "",
};

const CATEGORY_OPTIONS = [
  "Politics", "Business", "Technology", "Sports", "Entertainment",
  "Health", "Science", "Environment", "Crime", "Community"
];

const URGENCY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const IMPACT_OPTIONS = ["National", "Regional", "Local", "International"];
const ATTACHMENT_TYPES = ["Image", "Video", "Document"];

export function CreateNewsLeadDialog({ open, onOpenChange }: CreateNewsLeadDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const createMutation = useCreateNewsArticle();

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const addAttachment = () => {
    const newAttachment: Attachment = {
      id: crypto.randomUUID(),
      type: "Image",
      name: "",
      url: "",
      description: "",
      source: "",
    };
    updateField("attachments", [...formData.attachments, newAttachment]);
  };

  const removeAttachment = (id: string) => {
    updateField(
      "attachments",
      formData.attachments.filter((a) => a.id !== id)
    );
  };

  const updateAttachment = (id: string, field: keyof Attachment, value: string) => {
    updateField(
      "attachments",
      formData.attachments.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      )
    );
  };

  const addLink = () => {
    const newLink: Link = {
      id: crypto.randomUUID(),
      url: "",
      description: "",
      verified: false,
    };
    updateField("links", [...formData.links, newLink]);
  };

  const removeLink = (id: string) => {
    updateField(
      "links",
      formData.links.filter((l) => l.id !== id)
    );
  };

  const updateLink = (id: string, field: keyof Link, value: string | boolean) => {
    updateField(
      "links",
      formData.links.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      )
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.submitterFullName.trim()) {
      newErrors.submitterFullName = "Full name is required";
    }
    if (!formData.storyTitle.trim()) {
      newErrors.storyTitle = "Story title is required";
    }
    if (!formData.storyDescription.trim()) {
      newErrors.storyDescription = "Story description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const today = new Date().toISOString().split("T")[0];

    await createMutation.mutateAsync({
      title: formData.storyTitle,
      submissionDate: today,
      currentStatus: "Unverified",
      statusColor: "error",
      submitterFullName: formData.submitterFullName || null,
      submitterIc: formData.submitterIc || null,
      submitterAddress: formData.submitterAddress || null,
      submitterPhone: formData.submitterPhone || null,
      submitterEmail: formData.submitterEmail || null,
      storyTitle: formData.storyTitle,
      storyDescription: formData.storyDescription || null,
      storyCategory: formData.storyCategory || null,
      storyUrgency: formData.storyUrgency || null,
      storyEstimatedImpact: formData.storyEstimatedImpact || null,
      attachments: formData.attachments.length > 0 ? JSON.stringify(formData.attachments) : null,
      links: formData.links.length > 0 ? JSON.stringify(formData.links) : null,
      editorialNotes: formData.editorialNotes || null,
      sources: formData.submitterFullName || "Unknown",
    });

    setFormData(initialFormData);
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create News Lead</DialogTitle>
          <DialogDescription>
            Add a new news lead to the verification pipeline. Fill in all relevant sections.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="personal" className="mt-4">
          <TabsList className="w-full justify-start flex-wrap h-auto gap-1">
            <TabsTrigger value="personal" className="gap-1.5">
              <User className="size-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="story" className="gap-1.5">
              <FileText className="size-4" />
              Story
            </TabsTrigger>
            <TabsTrigger value="attachments" className="gap-1.5">
              <Paperclip className="size-4" />
              Attachments
            </TabsTrigger>
            <TabsTrigger value="links" className="gap-1.5">
              <Link2 className="size-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5">
              <StickyNote className="size-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          {/* Section 1: Personal Details */}
          <TabsContent value="personal" className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.submitterFullName}
                  onChange={(e) => updateField("submitterFullName", e.target.value)}
                  placeholder="Enter submitter's full name"
                  className={errors.submitterFullName ? "border-destructive" : ""}
                />
                {errors.submitterFullName && (
                  <p className="text-xs text-destructive">{errors.submitterFullName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icNumber">IC Number</Label>
                <Input
                  id="icNumber"
                  value={formData.submitterIc}
                  onChange={(e) => updateField("submitterIc", e.target.value)}
                  placeholder="Enter IC number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.submitterAddress}
                onChange={(e) => updateField("submitterAddress", e.target.value)}
                placeholder="Enter full address"
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.submitterPhone}
                  onChange={(e) => updateField("submitterPhone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.submitterEmail}
                  onChange={(e) => updateField("submitterEmail", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </TabsContent>

          {/* Section 2: Story Details */}
          <TabsContent value="story" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storyTitle">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="storyTitle"
                value={formData.storyTitle}
                onChange={(e) => updateField("storyTitle", e.target.value)}
                placeholder="Enter story title"
                className={errors.storyTitle ? "border-destructive" : ""}
              />
              {errors.storyTitle && (
                <p className="text-xs text-destructive">{errors.storyTitle}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="storyDescription">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="storyDescription"
                value={formData.storyDescription}
                onChange={(e) => updateField("storyDescription", e.target.value)}
                placeholder="Describe the news story in detail"
                rows={4}
                className={errors.storyDescription ? "border-destructive" : ""}
              />
              {errors.storyDescription && (
                <p className="text-xs text-destructive">{errors.storyDescription}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.storyCategory || undefined}
                  onValueChange={(v) => updateField("storyCategory", v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select
                  value={formData.storyUrgency || undefined}
                  onValueChange={(v) => updateField("storyUrgency", v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Impact</Label>
                <Select
                  value={formData.storyEstimatedImpact || undefined}
                  onValueChange={(v) => updateField("storyEstimatedImpact", v ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMPACT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Section 3: Attachments */}
          <TabsContent value="attachments" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Attachments</Label>
              <Button variant="outline" size="sm" onClick={addAttachment}>
                <Plus className="size-4 mr-1" />
                Add Attachment
              </Button>
            </div>
            {formData.attachments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                No attachments added yet. Click &quot;Add Attachment&quot; to add files.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.attachments.map((attachment, index) => (
                  <div
                    key={attachment.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Attachment {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">File Name</Label>
                        <Input
                          value={attachment.name}
                          onChange={(e) =>
                            updateAttachment(attachment.id, "name", e.target.value)
                          }
                          placeholder="Enter file name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <Select
                          value={attachment.type || undefined}
                          onValueChange={(v) =>
                            updateAttachment(attachment.id, "type", v ?? "")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ATTACHMENT_TYPES.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={attachment.url}
                          onChange={(e) =>
                            updateAttachment(attachment.id, "url", e.target.value)
                          }
                          placeholder="Enter file URL"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Description (optional)</Label>
                        <Input
                          value={attachment.description || ""}
                          onChange={(e) =>
                            updateAttachment(attachment.id, "description", e.target.value)
                          }
                          placeholder="Brief description"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Source (optional)</Label>
                        <Input
                          value={attachment.source || ""}
                          onChange={(e) =>
                            updateAttachment(attachment.id, "source", e.target.value)
                          }
                          placeholder="Source of file"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Section 4: Links & Proof */}
          <TabsContent value="links" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Links & Proof</Label>
              <Button variant="outline" size="sm" onClick={addLink}>
                <Plus className="size-4 mr-1" />
                Add Link
              </Button>
            </div>
            {formData.links.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                No links added yet. Click &quot;Add Link&quot; to add supporting URLs.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.links.map((link, index) => (
                  <div
                    key={link.id}
                    className="p-4 border rounded-lg space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Link {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeLink(link.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(link.id, "url", e.target.value)}
                          placeholder="Enter URL"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Description (optional)</Label>
                        <Input
                          value={link.description || ""}
                          onChange={(e) =>
                            updateLink(link.id, "description", e.target.value)
                          }
                          placeholder="Brief description"
                        />
                      </div>
                      <div className="space-y-1.5 flex items-end">
                        <Label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.verified || false}
                            onChange={(e) =>
                              updateLink(link.id, "verified", e.target.checked)
                            }
                            className="size-4 rounded border-input"
                          />
                          <span className="text-xs">Verified</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Section 5: Editorial Notes */}
          <TabsContent value="notes" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Initial Editorial Notes</Label>
              <Textarea
                value={formData.editorialNotes}
                onChange={(e) => updateField("editorialNotes", e.target.value)}
                placeholder="Add internal notes for the editorial team. These notes are for internal use only and will help guide the verification process."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Use this space to record any initial thoughts, context, or instructions for the editorial team.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
