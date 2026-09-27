import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import PatientRegister from '../pages/auth/PatientRegister';
import ClinicianRegister from '../pages/auth/ClinicianRegister';
import Unauthorized from '../pages/Unauthorized';

// Patient Module Layout & Pages
import PatientLayout from '../layouts/PatientLayout';
import PatientDashboard from '../pages/patient/Dashboard';
import PatientProfile from '../pages/patient/Profile';
import PatientMedicalHistory from '../pages/patient/MedicalHistory';
import PatientPrescriptions from '../pages/patient/Prescriptions';
import PatientGenerateQR from '../pages/patient/GenerateQR';
import PatientAccessHistory from '../pages/patient/AccessHistory';
import PatientNotifications from '../pages/patient/Notifications';

// Clinician Module Layout & Pages
import ClinicianLayout from '../layouts/ClinicianLayout';
import ClinicianDashboard from '../pages/clinician/Dashboard';
import ClinicianScanQR from '../pages/clinician/ScanQR';
import ClinicianRecentPatients from '../pages/clinician/RecentPatients';
import ClinicianAccessHistory from '../pages/clinician/AccessHistory';
import ClinicianNotifications from '../pages/clinician/Notifications';
import ClinicianProfile from '../pages/clinician/Profile';
import ClinicianSettings from '../pages/clinician/Settings';

// Clinician Patient Record Sub-pages
import PatientRecord from '../pages/clinician/patient/PatientRecord';
import PatientOverview from '../pages/clinician/patient/PatientOverview';
import ClinicianPatientHistory from '../pages/clinician/patient/MedicalHistory';
import ClinicianPatientPrescriptions from '../pages/clinician/patient/Prescriptions';
import NewConsultation from '../pages/clinician/patient/NewConsultation';
import AddPrescription from '../pages/clinician/patient/AddPrescription';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Navigate to="/login/patient" replace />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/register" element={<PatientRegister />} />
      <Route path="/register/clinician" element={<ClinicianRegister />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient Module Protected Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="history" element={<PatientMedicalHistory />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="qr" element={<PatientGenerateQR />} />
        <Route path="access-history" element={<PatientAccessHistory />} />
        <Route path="notifications" element={<PatientNotifications />} />
      </Route>

      {/* Clinician Module Protected Routes */}
      <Route
        path="/clinician"
        element={
          <ProtectedRoute allowedRoles={['clinician']}>
            <ClinicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClinicianDashboard />} />
        <Route path="scan" element={<ClinicianScanQR />} />
        <Route path="recent-patients" element={<ClinicianRecentPatients />} />
        <Route path="access-history" element={<ClinicianAccessHistory />} />
        <Route path="notifications" element={<ClinicianNotifications />} />
        <Route path="profile" element={<ClinicianProfile />} />
        <Route path="settings" element={<ClinicianSettings />} />

        {/* Clinician Patient Record Sub-routes */}
        <Route path="patient/:patientId" element={<PatientRecord />}>
          <Route index element={<PatientOverview />} />
          <Route path="history" element={<ClinicianPatientHistory />} />
          <Route path="prescriptions" element={<ClinicianPatientPrescriptions />} />
          <Route path="consultation" element={<NewConsultation />} />
          <Route path="prescription/new" element={<AddPrescription />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
