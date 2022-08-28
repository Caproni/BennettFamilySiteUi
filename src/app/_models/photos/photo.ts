export interface Photo {
  name: string;
  description: string | null;
  camera_details: string | null;
  taken_date: Date | null;
  taken_by: string | null;
  image: File | null;
  id: string | null;
}
