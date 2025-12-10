export interface GenerateParams {
  text: string;
  kind?: string;
}

export interface AnalysisResult {
  summary: string;
  inputLength: number;
  engine: string;
  timestamp: string;
}
