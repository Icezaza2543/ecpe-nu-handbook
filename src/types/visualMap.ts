export interface GraphEdge {
  id?: string;
  from?: string;
  to?: string;
  fromTitle?: string;
  toTitle?: string;
  type?: string;
  sourcePage?: string | null;
  confidence?: string;
  [key: string]: unknown;
}

export interface VisualFilter {
  id: string;
  label: string;
  value: string;
}
