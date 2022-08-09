export interface FamilyTreePerson {
  first_name: string | null;
  middle_names: string[];
  chosen_name: string | null;
  surname: string | null;
  title: string | null;
  birthplace: string | null;
  date_of_birth: Date | null;
  date_of_death: Date | null;
  image: string | null;
  previous_surnames: string[];
  relationships: string[];
  narrative: string | null;
  generation_index: number;
  column_index: number;
  facts: string[];
  photos: string[];
  sources: string[];
}
