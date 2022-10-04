export interface Photo {
  name: string;
  description: string | null;
  camera_details: string | null;
  taken_date: Date | null;
  taken_by: string | null;
  height: number;
  width: number;
  file_format: string;
  file: File | null;
  blob_url: string | null,
  id: string | null;
}
