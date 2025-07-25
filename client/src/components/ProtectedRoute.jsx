// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
        return;
      }

      // ✅ Normalize roles to lowercase for comparison
      const userRole = user.role?.toLowerCase();
      const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

      if (!normalizedAllowedRoles.includes(userRole)) {
        navigate("/unauthorized");
        return;
      }

      setOk(true);
    }
  }, [user, isLoading, navigate, allowedRoles]);

  if (isLoading || !ok) return <div>Loading...</div>;
  return children;
}
