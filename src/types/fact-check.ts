export interface FactCheckItem {
  key: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
}

export interface RelevanceItem {
  key: string;
  score: number;
  message: string;
}

export interface Reference {
  url: string;
  title: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
  snippet: string;
}

export interface FactCheckResponse {
  factualAccuracy: { items: FactCheckItem[] };
  newsworthyRelevance: { overallScore: number; items: RelevanceItem[] };
  contentIntegrity: { items: FactCheckItem[] };
  references: Reference[];
  report: string;
}
