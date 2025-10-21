import { useAuth, useOrganization } from "@clerk/nextjs";
import { useMemo } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1";

export function useApiClient() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();

  return useMemo(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (organization) {
      headers["x-company-id"] = organization.id;
    }

    return {
      get: async (path: string) => {
        const token = await getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${path}`, { headers });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      },

      post: async (path: string, body?: any) => {
        const token = await getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_BASE}${path}`, {
          method: "POST",
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      },
    };
  }, [getToken, organization]);
}