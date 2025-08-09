export interface OutputData {
  time?: number;
  blocks: {
    id?: string;
    type: string;
    data: Record<string, unknown>;
  }[];
  version?: string;
}

export type EditorData = OutputData | null;

export interface BlockData {
  type: string;
  data: Record<string, unknown>;
}

// Status type for job status
export type JobStatus = 'active' | 'draft' | 'reviewing' | 'closed';
