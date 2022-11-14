export interface Paper {
  title: string;
  description: string | null;
  abstract: string | null;
  paper_content: string | null;
  publication_type: string | null;
  publication_location: string | null,
  publication_date: Date | null;
  doi: string | null;
  pages: number | null;
  authors: string | null;
  language: string | null;
  file: File | null;
  blob_url: string | null,
  id: string | null;
}
