"use client";

import { createContext, useContext, type ReactNode } from "react";

// Define the shape of the session object that client components will receive.
// Note that `expiresAt` will be a string after being serialized from the server.
export type Session = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  profileImage: {
    url: string;
    pub_id: string;
  } | null;
  expiresAt: Date;
};

// Create a context to hold the session data. The default value is `null`
// for when there is no active session or the provider is not yet mounted.
const SessionContext = createContext<Session | null>(null);

/**
 * A client-side component that provides session data to its children via React Context.
 * It should be used in a server component (like the root layout) where the session
 * data is initially fetched and passed as the `value` prop.
 */
export function SessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Session | null;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/**
 * A custom hook to access the session data from any client component.
 * It must be used within a component that is a descendant of <SessionProvider>.
 * Returns the session object or `null` if the user is not authenticated.
 */
export function useSession() {
  const session = useContext(SessionContext);
  // The context is initialized with `null`, so `useContext` will return `null`
  // if it's used outside a provider. This is the desired behavior, as it
  // indicates no active session. Thus, no error check is needed here.
  return session;
}
