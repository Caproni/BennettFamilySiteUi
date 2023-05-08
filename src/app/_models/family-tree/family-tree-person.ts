export interface FamilyTreePerson {
  first_name: string | null;
  middle_names: string[];
  chosen_name: string | null;
  surname: string | null;
  title: string | null;
  birthplace: string | null;
  sex: string | null;
  date_of_birth: Date | null;
  date_of_death: Date | null;
  blob_url: string | null;
  previous_surnames: string[];
  relationships: string[];
  narrative: string | null;
  facts: string[];
  photos: string[];
  sources: string[];
  id: string | null;
}
