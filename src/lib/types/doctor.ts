// Doctor portal domain models derived strictly from backend documentation (DOCTOR_PORTAL_API_TESTING_GUIDE.md)
// Keep field names exactly as documented; avoid renaming to preserve wire compatibility.

export interface EyeMeasurement {
  sphere: number;          // e.g. -2.5
  cylinder: number;        // e.g. -0.5
  axis: number;            // degrees 0-180
  add?: number;            // near addition (optional in some responses)
}

export interface PatientShopRef {
  id: number;
  name: string;
}

export interface Patient {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  lastVisit?: string | null;
  createdAt?: string;
  shop?: PatientShopRef; // { id, name }
}

export interface PrescriptionPatientRef {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  medicalHistory?: string;
  shop?: PatientShopRef;
}

export interface Prescription {
  id: number;
  patientId: number;
  rightEye: EyeMeasurement;
  leftEye: EyeMeasurement;
  createdAt: string;
  updatedAt: string;
  patient?: PrescriptionPatientRef; // included in list/detail responses per docs
}

export interface DoctorInfo {
  id: number;
  name: string;
  role: string; // OPTOMETRIST
  shopId: number;
}

// Request payload for creating a prescription (as per docs)
export interface PrescriptionCreatePayload {
  patientId: number;
  rightEye: EyeMeasurement;
  leftEye: EyeMeasurement;
}

// Response shapes exactly as documentation indicates
export interface PatientsResponse {
  success: boolean;
  data: Patient[];
  count: number;
}

export interface PrescriptionCreateResponse {
  success: boolean;
  message: string;
  data: Prescription;
  doctorInfo: DoctorInfo;
}

export interface PrescriptionsListResponse {
  prescriptions: Prescription[];
  total: number;
  page: number;
  totalPages: number;
}

export type PrescriptionDetailResponse = Prescription; // direct object per docs

// Utility generic pagination shape for internal UI usage (optional)
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ThermalMeta {
  filename: string; // expected pattern Prescription-{id}-Thermal.txt
  content: string;  // plain text body
  width?: number;   // printer char width if known
}

export interface PdfMeta {
  filename: string; // Prescription-{id}.pdf
  blob: Blob;
}

// Validation constraints (can be reused by form logic)
export const MEASUREMENT_LIMITS = {
  sphere: { min: -20, max: 20 },
  cylinder: { min: -10, max: 0 },
  axis: { min: 0, max: 180 },
  add: { min: 0, max: 4 }
} as const;

export function validateEyeMeasurement(side: 'rightEye' | 'leftEye', m: Partial<EyeMeasurement>): string[] {
  const errors: string[] = [];
  if (m.sphere === undefined) errors.push(`${side}.sphere required`);
  if (m.cylinder === undefined) errors.push(`${side}.cylinder required`);
  if (m.axis === undefined) errors.push(`${side}.axis required`);
  if (m.sphere !== undefined && (m.sphere < MEASUREMENT_LIMITS.sphere.min || m.sphere > MEASUREMENT_LIMITS.sphere.max)) {
    errors.push(`${side}.sphere out of range`);
  }
  if (m.cylinder !== undefined && (m.cylinder < MEASUREMENT_LIMITS.cylinder.min || m.cylinder > MEASUREMENT_LIMITS.cylinder.max)) {
    errors.push(`${side}.cylinder out of range`);
  }
  if (m.axis !== undefined && (m.axis < MEASUREMENT_LIMITS.axis.min || m.axis > MEASUREMENT_LIMITS.axis.max)) {
    errors.push(`${side}.axis out of range`);
  }
  if (m.add !== undefined && (m.add < MEASUREMENT_LIMITS.add.min || m.add > MEASUREMENT_LIMITS.add.max)) {
    errors.push(`${side}.add out of range`);
  }
  return errors;
}
