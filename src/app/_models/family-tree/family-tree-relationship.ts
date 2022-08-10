export interface FamilyTreeRelationship {
  person_one: string;
  person_two: string;
  start_time: Date | null;
  end_time: Date | null;
  narrative: string | null;
}
