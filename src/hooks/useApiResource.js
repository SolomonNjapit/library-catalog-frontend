import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

export default function useApiResource(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    api.get(path, { signal: controller.signal })
      .then((payload) => {
        const items = Array.isArray(payload)
          ? payload
          : payload?.data ?? payload?.items ?? [];
        setData(items);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setData([]);
          setError(requestError.message || "The data could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [path, version]);

  return { data, loading, error, refresh };
}
