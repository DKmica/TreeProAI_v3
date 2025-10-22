"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useMemo } from "react";

const useApiClient = () => {
  const { getToken, orgId } = useAuth();

  const client = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/v1",
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (orgId) {
        config.headers["x-company-id"] = orgId;
      }
      return config;
    });

    return instance;
  }, [getToken, orgId]);

  return client;
};

export default useApiClient;