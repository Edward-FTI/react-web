// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/authContext"; // Check the relative path and file name

// const PrivateRoute = ({ children, requiredRole }) => {
//   const { user } = useAuth(); // Assuming you have a user object in your auth context
//   const location = useLocation();

//   // If no user or user role doesn't match required role, redirect to login or unauthorized page
//   if (!user || (requiredRole && !user.roles.includes(requiredRole))) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoute;
