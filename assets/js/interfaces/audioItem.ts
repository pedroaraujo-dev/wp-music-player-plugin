export interface AudioItem {
  id: string;
  name: string;
  category: string;
  duration: number;
  url: string;
  tags: string[];
  metadata: Record<string, any>;
}
