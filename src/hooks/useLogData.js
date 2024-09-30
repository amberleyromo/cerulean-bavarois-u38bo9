import { useState, useEffect, useRef } from "react";
import { ndjsonParser } from "../utils/ndjsonParser";

const useLogData = (url) => {
  const [logEntries, setLogEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Track whether fetch has already occurred

  if (!url) {
    throw new Error("A URL must be provided to fetch log data");
  }

  useEffect(() => {
    if (hasFetched.current) return; // Prevent double-fetching

    hasFetched.current = true; // Mark as fetched

    // Function to fetch and parse NDJSON data
    const fetchLogData = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        ndjsonParser(response, setLogEntries);

        // Mark loading as complete
        setLoading(false);
      } catch (error) {
        console.error("Error loading log data:", error);
        setError(error);
        setLoading(false);
      }
    };

    // Start fetching log data
    fetchLogData();
  }, [url]);

  return { logEntries, loading, error };
};

export default useLogData;
