import { createContext, useContext, useState, useEffect } from 'react';

const PatientAccessContext = createContext(null);

const DEFAULT_SESSION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function PatientAccessProvider({ children }) {
  const [authorizedSession, setAuthorizedSession] = useState(() => {
    const saved = sessionStorage.getItem('hrs_patient_access');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (new Date(parsed.expiresAt) <= new Date()) {
        sessionStorage.removeItem('hrs_patient_access');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (!authorizedSession) {
      setSecondsRemaining(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((new Date(authorizedSession.expiresAt).getTime() - Date.now()) / 1000));
      setSecondsRemaining(diff);
      if (diff <= 0) {
        clearAccess('EXPIRED');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [authorizedSession]);

  function grantAccess(patientData, token, customDurationMs = DEFAULT_SESSION_DURATION_MS) {
    const now = Date.now();
    const session = {
      patientId: patientData.id,
      patient: patientData,
      token,
      authorizedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + customDurationMs).toISOString(),
    };
    sessionStorage.setItem('hrs_patient_access', JSON.stringify(session));
    setAuthorizedSession(session);
    return session;
  }

  function clearAccess(reason = 'LOGOUT') {
    sessionStorage.removeItem('hrs_patient_access');
    setAuthorizedSession(null);
    setSecondsRemaining(0);
  }

  function isAuthorizedForPatient(patientId) {
    if (!authorizedSession) return false;
    if (new Date(authorizedSession.expiresAt) <= new Date()) {
      clearAccess('EXPIRED');
      return false;
    }
    return authorizedSession.patientId === patientId;
  }

  return (
    <PatientAccessContext.Provider
      value={{
        authorizedSession,
        secondsRemaining,
        grantAccess,
        clearAccess,
        isAuthorizedForPatient,
      }}
    >
      {children}
    </PatientAccessContext.Provider>
  );
}

export function usePatientAccess() {
  const ctx = useContext(PatientAccessContext);
  if (!ctx) throw new Error('usePatientAccess must be used within PatientAccessProvider');
  return ctx;
}
