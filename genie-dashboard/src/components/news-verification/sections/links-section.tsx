"use client";

import { Link as LinkIcon, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle, Link as LinkType } from "@/types";

interface LinksSectionProps {
  article: NewsArticle;
}

export function LinksSection({ article }: LinksSectionProps) {
  const links: LinkType[] = article.links ? JSON.parse(article.links) : [];

  if (links.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <LinkIcon className="size-4 text-primary" />
            Links & Proof
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            No links provided
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <LinkIcon className="size-4 text-primary" />
          Links & Proof
          <Badge variant="secondary" className="ml-auto font-normal">
            {links.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline break-all"
                >
                  {link.url}
                  <ExternalLink className="size-3 shrink-0" />
                </a>
                {link.description && (
                  <p className="text-xs text-muted-foreground">
                    {link.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 pt-0.5">
                {link.verified ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 gap-1 font-normal"
                  >
                    <CheckCircle className="size-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 gap-1 font-normal"
                  >
                    <AlertCircle className="size-3" />
                    Unverified
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
