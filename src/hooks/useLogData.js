import { useState, useEffect, useRef } from "react";

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

        // Use the ReadableStream API to read data incrementally
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let remainingText = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          // Decode the chunk into text and add it to the remaining text
          const chunk = decoder.decode(value, { stream: true });
          remainingText += chunk;

          // Split the text into lines to handle the NDJSON format
          const lines = remainingText.split("\n");
          remainingText = lines.pop(); // Keep the last incomplete line

          // Parse each line into JSON
          const newEntries = lines
            .map((line) => {
              try {
                return JSON.parse(line);
              } catch {
                return null; // Ignore lines that can't be parsed
              }
            })
            .filter(Boolean); // Remove any null entries

          // Update the log entries state incrementally
          setLogEntries((prevEntries) => [...prevEntries, ...newEntries]);
        }

        // Process any remaining text after the stream has completed
        if (remainingText.trim()) {
          try {
            const finalEntry = JSON.parse(remainingText);
            setLogEntries((prevEntries) => [...prevEntries, finalEntry]);
            // eslint-disable-next-line no-unused-vars
          } catch (e) {
            console.error(
              "Failed to parse the final log entry:",
              remainingText,
            );
          }
        }

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
