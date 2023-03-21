import React from "react";
import Navigation from "./Navigation";

import { AuthProvider } from "../context/AuthProvider";
import Demo from "./Demo";

export default function Provider() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
