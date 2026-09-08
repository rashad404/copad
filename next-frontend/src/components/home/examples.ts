import type { HomeCopy } from "./copy";
export type ExampleMember = {
  id: string;
  name: string;
  relationship: keyof HomeCopy;
  allergy: keyof HomeCopy;
  medication: keyof HomeCopy;
  condition: keyof HomeCopy;
  answer: keyof HomeCopy;
  results: number[];
};
// Fictional examples only. Never load patient records into the public homepage.
export const exampleMembers: ExampleMember[] = [
  {
    id: "leyla",
    name: "Leyla",
    relationship: "self",
    allergy: "penicillin",
    medication: "vitaminD",
    condition: "migraine",
    answer: "leylaAnswer",
    results: [12.8, 13.0, 12.9, 13.2],
  },
  {
    id: "ayan",
    name: "Ayan",
    relationship: "child",
    allergy: "pollen",
    medication: "noEntry",
    condition: "noEntry",
    answer: "ayanAnswer",
    results: [12.0, 12.1, 12.5, 12.4],
  },
  {
    id: "rauf",
    name: "Rauf",
    relationship: "parent",
    allergy: "noEntry",
    medication: "amlodipine",
    condition: "hypertension",
    answer: "raufAnswer",
    results: [13.7, 14.0, 13.8, 14.1],
  },
];
export const sampleTimes = ["10:00", "11:30", "14:00"];
