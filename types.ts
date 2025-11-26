export enum Specialty {
  GENERAL_PRACTITIONER = "General Practitioner",
  CARDIOLOGIST = "Cardiologist",
  DERMATOLOGIST = "Dermatologist",
  PEDIATRICIAN = "Pediatrician",
  NEUROLOGIST = "Neurologist",
  ORTHOPEDIST = "Orthopedist",
  PSYCHIATRIST = "Psychiatrist"
}

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  bio: string;
  location: string;
  rating: number;
  imageUrl: string;
  availability: AvailabilitySlot[];
  calendarSynced: boolean;
  yearsExperience: number;
}

export interface AiMatchResult {
  id: string;
  matchReason: string;
  confidence: number;
}
