export interface Photo {
  name: string;
  description: string | null;
  taken_timestamp: Date | null;
  image: string;
  format: string;
  height: number;
  width: number;
  id: string | null;
}
