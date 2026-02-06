"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type Session = { user: { name: string; email: string } } | null;

interface SessionContextValue {
  session: Session;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (mounted) {
          setSession(data);
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
