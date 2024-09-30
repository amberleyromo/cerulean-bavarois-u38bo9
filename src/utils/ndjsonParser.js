export const ndjsonParser = async (response, onNewData) => {
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
    const newData = lines
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null; // Ignore lines that can't be parsed
        }
      })
      .filter(Boolean); // Remove any null entries

    // Update the log entries state incrementally
    onNewData((prevData) => [...prevData, ...newData]);
  }

  // Process any remaining text after the stream has completed
  if (remainingText.trim()) {
    try {
      const finalEntry = JSON.parse(remainingText);
      onNewData((prevData) => [...prevData, finalEntry]);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      console.error("Failed to parse the final log entry:", remainingText);
    }
  }
};
