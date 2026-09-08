import type { Field } from "./recordModel";
export const memberFields: Field[] = [
  { key: "fullName", label: ["Full name", "Ad və soyad"], required: true },
  {
    key: "relationship",
    label: ["Relationship", "Qohumluq"],
    type: "select",
    options: ["SELF", "SPOUSE", "CHILD", "PARENT", "SIBLING", "OTHER"],
    default: "OTHER",
    required: true,
  },
  {
    key: "dateOfBirth",
    label: ["Date of birth", "Doğum tarixi"],
    type: "date",
  },
  {
    key: "biologicalSex",
    label: ["Sex assigned at birth", "Doğumda təyin olunan cins"],
    type: "select",
    options: ["MALE", "FEMALE", "INTERSEX", "UNDISCLOSED"],
    default: "UNDISCLOSED",
  },
  {
    key: "bloodType",
    label: ["Blood type", "Qan qrupu"],
    type: "select",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
];
export const birthFields: Field[] = [
  {
    key: "gestationalAgeWeeks",
    label: ["Gestational age at birth (weeks)", "Doğuşun baş verdiyi həftə"],
    type: "number",
    min: 0,
    step: "any",
  },
  {
    key: "birthWeightGrams",
    label: ["Birth weight (g)", "Doğum çəkisi (g)"],
    type: "number",
    min: 0,
    step: "1",
  },
  {
    key: "birthLengthCm",
    label: ["Birth length (cm)", "Doğum boyu (cm)"],
    type: "number",
    min: 0,
    step: "any",
  },
];
