"use client";

import { useState } from "react";
import { Monitor, Send, Newspaper, Globe, Rss } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NewsArticle } from "@/types";

interface ChannelDisplaySectionProps {
  article: NewsArticle;
}

export function ChannelDisplaySection({ article }: ChannelDisplaySectionProps) {
  const [activeTab, setActiveTab] = useState("telegram");

  const title = article.storyTitle || "Untitled Story";
  const description =
    article.storyDescription?.slice(0, 200) +
      (article.storyDescription && article.storyDescription.length > 200
        ? "..."
        : "") || "No description available.";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Monitor className="size-4 text-primary" />
          Channel Display Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="telegram" className="gap-1.5">
              <Send className="size-3.5" />
              <span className="hidden sm:inline">Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="newspaper" className="gap-1.5">
              <Newspaper className="size-3.5" />
              <span className="hidden sm:inline">Newspaper</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="gap-1.5">
              <Globe className="size-3.5" />
              <span className="hidden sm:inline">Website</span>
            </TabsTrigger>
            <TabsTrigger value="rss" className="gap-1.5">
              <Rss className="size-3.5" />
              <span className="hidden sm:inline">RSS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="telegram" className="mt-4">
            <div className="max-w-sm mx-auto">
              <div className="bg-[#0f0f0f] rounded-2xl p-4 shadow-lg">
                <div className="bg-[#17212b] rounded-xl overflow-hidden">
                  {/* Telegram header */}
                  <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
                    <div className="size-8 rounded-full bg-[#3390ec] flex items-center justify-center">
                      <Send className="size-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">
                        News Channel
                      </p>
                      <p className="text-[10px] text-white/50">just now</p>
                    </div>
                  </div>
                  {/* Telegram content */}
                  <div className="p-3">
                    <p className="text-sm text-white font-medium mb-1.5 leading-snug">
                      {title}
                    </p>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {description}
                    </p>
                    <p className="text-[10px] text-white/40 text-right mt-2">
                      12:34 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="newspaper" className="mt-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white dark:bg-slate-100 rounded-lg overflow-hidden shadow-lg border">
                {/* Newspaper header */}
                <div className="border-b-2 border-black px-4 py-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center">
                    Daily News
                  </p>
                  <p className="text-[10px] text-slate-400 text-center">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {/* Newspaper content */}
                <div className="p-4">
                  <h3 className="text-lg font-serif font-bold text-black leading-tight mb-3">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-serif">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="website" className="mt-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-lg border">
                {/* Website header */}
                <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 border-b flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-red-400" />
                  <div className="size-2 rounded-full bg-amber-400" />
                  <div className="size-2 rounded-full bg-green-400" />
                  <div className="flex-1 ml-2">
                    <div className="bg-white dark:bg-slate-700 rounded h-4 text-[8px] text-slate-400 px-2 flex items-center">
                      news.example.com/article
                    </div>
                  </div>
                </div>
                {/* Website content */}
                <div className="p-6">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-medium">
                    {article.storyCategory || "News"}
                  </span>
                  <h3 className="text-xl font-bold text-foreground mt-1 mb-3 leading-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rss" className="mt-4">
            <div className="max-w-md mx-auto">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg border">
                {/* RSS header */}
                <div className="bg-orange-500 px-4 py-2 flex items-center gap-2">
                  <Rss className="size-4 text-white" />
                  <span className="text-sm font-medium text-white">RSS Feed</span>
                </div>
                {/* RSS content */}
                <div className="p-4 space-y-3">
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
                    <p className="text-[10px] text-orange-500 font-medium mb-1">
                      {new Date().toISOString()}
                    </p>
                    <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug">
                      {title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
