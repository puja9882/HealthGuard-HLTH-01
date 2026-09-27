// services/api.js
// Stand-in for real FastAPI backend calls.
// All pages import only from this file so replacing mock data with REST endpoints is isolated.

import {
  mockClinician,
  mockPatient,
  mockPatientsList,
  mockVisits,
  mockPrescriptions,
  mockAccessHistory,
  mockNotifications,
} from '../data/mockData';

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// Session stores
let clinicianStore = { ...mockClinician };
let patientsStore = mockPatientsList.map((p) => ({ ...p }));
let visitsStore = mockVisits.map((v) => ({ ...v }));
let prescriptionsStore = mockPrescriptions.map((p) => ({ ...p }));
let accessHistoryStore = mockAccessHistory.map((a) => ({ ...a }));
let notificationsStore = mockNotifications.map((n) => ({ ...n }));
let passwordStore = null;

// Temporary QR store for patient
let patientQRStore = null;
const QR_LIFETIME_MS = 5 * 60 * 1000;

function randomToken() {
  return 'temporary-secure-token-' + Math.random().toString(36).slice(2, 12);
}

// ----------------------------------------------------
// AUTH API
// ----------------------------------------------------
export async function login(email, password, role = 'patient') {
  await delay();
  if (!email || !password) {
    const err = new Error('Email and password are required'); err.status = 400; throw err;
  }
  if (password.length < 6) {
    const err = new Error('Invalid credentials'); err.status = 401; throw err;
  }

  if (role === 'clinician') {
    if (clinicianStore.verificationStatus === 'REJECTED') {
      const err = new Error('Your clinician verification request was rejected.'); err.status = 403; throw err;
    }
    return {
      token: 'mock.jwt.clinician.' + clinicianStore.id,
      user: {
        id: clinicianStore.id,
        name: clinicianStore.name,
        email: clinicianStore.email,
        role: 'clinician',
        specialization: clinicianStore.specialization,
        verificationStatus: clinicianStore.verificationStatus,
      },
    };
  }

  return {
    token: 'mock.jwt.patient.' + mockPatient.id,
    user: { id: mockPatient.id, name: mockPatient.name, role: 'patient' },
  };
}

export async function register(formData) {
  await delay(500);
  if (formData.password !== formData.confirmPassword) {
    const err = new Error('Passwords do not match'); err.status = 400; throw err;
  }
  return { success: true };
}

export async function registerClinician(formData) {
  await delay(500);
  if (formData.password !== formData.confirmPassword) {
    const err = new Error('Passwords do not match'); err.status = 400; throw err;
  }
  clinicianStore = {
    ...clinicianStore,
    name: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    registrationNumber: formData.registrationNumber,
    specialization: formData.specialization,
    organization: formData.organization,
    region: formData.city,
    verificationStatus: 'PENDING',
  };
  return { success: true, clinician: clinicianStore };
}

export async function changePassword(currentPassword, newPassword) {
  await delay();
  if (!currentPassword || !newPassword) {
    const err = new Error('Current and new password are required'); err.status = 400; throw err;
  }
  if (newPassword.length < 6) {
    const err = new Error('New password must be at least 6 characters'); err.status = 400; throw err;
  }
  passwordStore = newPassword;
  return { success: true };
}

// ----------------------------------------------------
// PATIENT MODULE API
// ----------------------------------------------------
export async function getProfile() {
  await delay();
  return { ...mockPatient };
}

export async function updateProfile(updates) {
  await delay();
  return { ...mockPatient, ...updates };
}

export async function getVisits() {
  await delay();
  return visitsStore.filter((v) => v.patientId === 'PT-10482');
}

export async function getVisitById(id) {
  await delay(200);
  const visit = visitsStore.find((v) => v.id === id);
  if (!visit) { const err = new Error('Visit not found'); err.status = 404; throw err; }
  return visit;
}

export async function getPrescriptions() {
  await delay();
  return prescriptionsStore.filter((p) => p.patientId === 'PT-10482');
}

export async function generateQR() {
  await delay(300);
  const now = Date.now();
  patientQRStore = {
    token: randomToken(),
    status: 'active',
    generatedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + QR_LIFETIME_MS).toISOString(),
  };
  return { ...patientQRStore };
}

export async function getQRStatus() {
  await delay(150);
  if (!patientQRStore) return null;
  if (patientQRStore.status === 'active' && new Date(patientQRStore.expiresAt) <= new Date()) {
    patientQRStore = { ...patientQRStore, status: 'expired' };
  }
  return { ...patientQRStore };
}

export async function revokeQR() {
  await delay(200);
  if (patientQRStore) patientQRStore = { ...patientQRStore, status: 'revoked' };
  return patientQRStore ? { ...patientQRStore } : null;
}

export async function getAccessHistory() {
  await delay();
  return accessHistoryStore.filter((a) => a.patientId === 'PT-10482');
}

export async function getNotifications() {
  await delay();
  return [...notificationsStore].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function markNotificationRead(id) {
  await delay(150);
  notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
  return [...notificationsStore];
}

export async function markAllNotificationsRead() {
  await delay(150);
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  return [...notificationsStore];
}

export async function deleteNotification(id) {
  await delay(150);
  notificationsStore = notificationsStore.filter((n) => n.id !== id);
  return [...notificationsStore];
}

// ----------------------------------------------------
// CLINICIAN MODULE API
// ----------------------------------------------------

export async function getClinicianProfile() {
  await delay();
  return { ...clinicianStore };
}

export async function updateClinicianProfile(updates) {
  await delay();
  // Protected fields like registrationNumber or verificationStatus cannot be edited here
  const allowedUpdates = {
    name: updates.name || clinicianStore.name,
    phone: updates.phone || clinicianStore.phone,
    organization: updates.organization || clinicianStore.organization,
    region: updates.region || clinicianStore.region,
  };
  clinicianStore = { ...clinicianStore, ...allowedUpdates };
  return { ...clinicianStore };
}

export async function verifyQRCode(tokenStr) {
  await delay(450);
  const cleanToken = (tokenStr || '').trim();

  // Audit log entry template
  const newLog = {
    id: 'ACC-' + Math.floor(100 + Math.random() * 900),
    clinicianId: clinicianStore.id,
    clinicianName: clinicianStore.name,
    patientId: 'PT-10482',
    patientName: 'Aarav Sharma',
    timestamp: new Date().toISOString(),
    accessMethod: 'QR Verification',
  };

  if (!cleanToken) {
    accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Failed', status: 'Invalid' });
    return { status: 'INVALID', message: 'No QR code data provided.' };
  }

  // Handle explicit demo mock codes for testing
  if (cleanToken.includes('EXPIRED')) {
    accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Expired', accessMethod: 'Expired QR Code' });
    return { status: 'EXPIRED', message: 'This QR code is no longer valid. Ask the patient to generate a new QR code.' };
  }

  if (cleanToken.includes('REVOKED')) {
    accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Revoked', accessMethod: 'Revoked QR Code' });
    return { status: 'REVOKED', message: 'The patient has revoked this access code. Ask the patient to generate a new QR code.' };
  }

  if (cleanToken.includes('UNAUTHORIZED')) {
    accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Denied', accessMethod: 'Unauthorized Access' });
    return { status: 'UNAUTHORIZED', message: 'Access Denied. You are not authorized to access this patient record.' };
  }

  if (cleanToken.includes('INVALID')) {
    accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Invalid', accessMethod: 'Malformed Token' });
    return { status: 'INVALID', message: 'Invalid QR code token format.' };
  }

  // Check if token matches current active patient QR or is valid format
  if (patientQRStore) {
    if (patientQRStore.status === 'expired' || new Date(patientQRStore.expiresAt) <= new Date()) {
      accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Expired' });
      return { status: 'EXPIRED', message: 'QR code has expired. Patient must generate a new code.' };
    }
    if (patientQRStore.status === 'revoked') {
      accessHistoryStore.unshift({ ...newLog, action: 'QR Verification Attempt', status: 'Revoked' });
      return { status: 'REVOKED', message: 'QR code was revoked by the patient.' };
    }
  }

  // Default valid patient match (Aarav Sharma PT-10482)
  const targetPatient = patientsStore.find((p) => p.id === 'PT-10482') || patientsStore[0];

  accessHistoryStore.unshift({
    ...newLog,
    patientId: targetPatient.id,
    patientName: targetPatient.name,
    action: 'Patient Record Access Granted',
    status: 'Authorized',
    accessMethod: 'Temporary QR Scan',
  });

  return {
    status: 'VALID',
    patient: targetPatient,
    token: cleanToken,
    expiresInSeconds: 300,
  };
}

export async function getAuthorizedPatient(patientId) {
  await delay(200);
  const patient = patientsStore.find((p) => p.id === patientId);
  if (!patient) {
    const err = new Error('Patient record not found'); err.status = 404; throw err;
  }
  return { ...patient };
}

export async function getPatientHistory(patientId) {
  await delay(250);
  return visitsStore
    .filter((v) => v.patientId === patientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getPatientPrescriptions(patientId) {
  await delay(250);
  return prescriptionsStore
    .filter((p) => p.patientId === patientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function createConsultation(patientId, formData) {
  await delay(450);
  const patient = patientsStore.find((p) => p.id === patientId);
  if (!patient) throw new Error('Patient not found');

  const newVisit = {
    id: 'VIS-' + Math.floor(900 + Math.random() * 100),
    patientId,
    date: formData.visitDate || new Date().toISOString().split('T')[0],
    time: formData.visitTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    clinician: clinicianStore.name,
    specialization: clinicianStore.specialization,
    visitType: formData.visitType,
    symptoms: formData.symptoms,
    diagnosis: formData.diagnosis,
    category: formData.category || 'General',
    diagnosisNotes: formData.diagnosisNotes || '',
    treatment: formData.treatment || '',
    followUp: formData.followUp || '',
    hasPrescription: false,
  };

  visitsStore.unshift(newVisit);

  // Update patient last visit
  patient.lastVisit = newVisit.date;
  patient.lastAction = 'New Consultation Saved';

  // Log access history
  accessHistoryStore.unshift({
    id: 'ACC-' + Math.floor(100 + Math.random() * 900),
    clinicianId: clinicianStore.id,
    clinicianName: clinicianStore.name,
    patientId,
    patientName: patient.name,
    timestamp: new Date().toISOString(),
    action: 'Consultation Added',
    status: 'Authorized',
    accessMethod: 'Active Session',
  });

  // Add notification
  notificationsStore.unshift({
    id: 'NOT-' + Math.floor(300 + Math.random() * 100),
    title: 'Consultation Successfully Saved',
    message: `New consultation record added for patient ${patient.name} (${patient.id}).`,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'success',
  });

  return newVisit;
}

export async function createPrescription(patientId, prescriptionData) {
  await delay(450);
  const patient = patientsStore.find((p) => p.id === patientId);
  if (!patient) throw new Error('Patient not found');

  const newPrescription = {
    id: 'RX-' + Math.floor(2000 + Math.random() * 1000),
    patientId,
    visitId: prescriptionData.visitId || null,
    date: new Date().toISOString().split('T')[0],
    clinician: clinicianStore.name,
    condition: prescriptionData.condition || 'General Consultation',
    medicines: prescriptionData.medicines.map((m) => ({ ...m })),
  };

  prescriptionsStore.unshift(newPrescription);

  // Log access history
  accessHistoryStore.unshift({
    id: 'ACC-' + Math.floor(100 + Math.random() * 900),
    clinicianId: clinicianStore.id,
    clinicianName: clinicianStore.name,
    patientId,
    patientName: patient.name,
    timestamp: new Date().toISOString(),
    action: 'Prescription Added',
    status: 'Authorized',
    accessMethod: 'Active Session',
  });

  // Add notification
  notificationsStore.unshift({
    id: 'NOT-' + Math.floor(300 + Math.random() * 100),
    title: 'Prescription Successfully Added',
    message: `Prescription #${newPrescription.id} generated for patient ${patient.name}.`,
    timestamp: new Date().toISOString(),
    read: false,
    type: 'info',
  });

  return newPrescription;
}

export async function getRecentPatients() {
  await delay();
  return patientsStore.map((p) => ({ ...p }));
}

export async function getClinicianAccessHistory() {
  await delay();
  return [...accessHistoryStore].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function getClinicianNotifications() {
  await delay();
  return [...notificationsStore].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export async function markClinicianNotificationRead(id) {
  await delay(150);
  notificationsStore = notificationsStore.map((n) => (n.id === id ? { ...n, read: true } : n));
  return [...notificationsStore];
}

export async function markAllClinicianNotificationsRead() {
  await delay(150);
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  return [...notificationsStore];
}
