import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// UI-side gate only — this is UX, not the security boundary. The real
// boundary is the 403 thrown by services/*.js (and, in production, by the
// FastAPI require_role() dependency). Removing this component would change
// what's rendered, not what data can be fetched.
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login/patient" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
}
