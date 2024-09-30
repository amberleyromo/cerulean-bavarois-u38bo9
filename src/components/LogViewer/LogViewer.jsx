import { useState } from "react";
import useLogData from "../../hooks/useLogData";
import styles from "./LogViewer.module.css";

const LogViewer = () => {
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";
  const { logEntries, loading, error } = useLogData(url);
  const [expandedRows, setExpandedRows] = useState({});
  // @TODO: For during dev, remove after handling large numbers of log entries
  const firstXItems = logEntries.slice(0, 30);

  // Function to toggle row expansion
  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the expanded state
    }));
  };

  // Helper function to format JSON as multi-line
  const formatMultilineJSON = (jsonObj) => JSON.stringify(jsonObj, null, 2);

  // Helper function to format JSON as single-line
  const formatSingleLineJSON = (jsonObj) => JSON.stringify(jsonObj);

  if (error) return <div>Error loading log entries: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Log Viewer</h1>
      <p>Number of log entries fetched: {logEntries.length}</p>
      <p>Truncated log entries shown: {firstXItems.length}</p>
      <p>Currently loading data? {loading ? "yes" : "no"}</p>
      <div className={styles.logViewerContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.expandIndicatorCell}></th>{" "}
              {/* Expand/collapse column */}
              <th className={styles.timestampCell}>Time</th> {/* Time column */}
              <th className={styles.eventCell}>Event</th> {/* Event column */}
            </tr>
          </thead>
          <tbody>
            {firstXItems.map((entry, index) => {
              const isExpanded = expandedRows[index];
              const rowId = `log-row-${index}`;

              return (
                <tr
                  key={index}
                  className={styles.tableRow}
                  aria-expanded={isExpanded} // Indicates whether the row is expanded
                  aria-controls={`${rowId}-details`} // Connects this row to its expanded details
                  onClick={() => toggleRow(index)}
                  id={rowId}
                  style={{ cursor: "pointer" }}
                >
                  {/* Expand/collapse indicator */}
                  <td className={styles.expandIndicatorCell}>
                    <span aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
                  </td>
                  {/* Time column */}
                  <td className={styles.timestampCell}>
                    {new Date(entry._time).toISOString()}
                  </td>
                  {/* Event column */}
                  <td className={styles.eventCell}>
                    <div className={styles.eventContent}>
                      {isExpanded ? (
                        <pre
                          id={`${rowId}-details`} // ID to link with aria-controls
                          role="region" // Treat this as a separate region for screen readers
                          aria-label="Expanded log details"
                        >
                          {formatMultilineJSON(entry)}
                        </pre>
                      ) : (
                        formatSingleLineJSON(entry)
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogViewer;
