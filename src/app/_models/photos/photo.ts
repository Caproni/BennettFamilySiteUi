export interface Photo {
  name: string;
  description: string | null;
  camera_details: string | null;
  taken_date: Date | null;
  taken_by: string | null;
  height: number;
  width: number;
  image: File | null;
  blob_url: string | null,
  id: string | null;
}
