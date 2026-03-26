"use client";

import { User, Phone, Mail, MapPin, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsArticle } from "@/types";

interface PersonalDetailsSectionProps {
  article: NewsArticle;
}

export function PersonalDetailsSection({ article }: PersonalDetailsSectionProps) {
  const fields = [
    {
      icon: User,
      label: "Full Name",
      value: article.submitterFullName,
    },
    {
      icon: CreditCard,
      label: "IC Number",
      value: article.submitterIc,
    },
    {
      icon: MapPin,
      label: "Address",
      value: article.submitterAddress,
    },
    {
      icon: Phone,
      label: "Phone",
      value: article.submitterPhone,
    },
    {
      icon: Mail,
      label: "Email",
      value: article.submitterEmail,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="size-4 text-primary" />
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Icon className="size-3" />
                {label}
              </dt>
              <dd className="text-sm text-foreground break-words">
                {value || (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
