export interface FamilyTreeRelationship {
  person_one: string;
  person_two: string;
  start_date: Date | null;
  end_date: Date | null;
  relationship_type: string;
  narrative: string | null;
  id: string | null;
}
