import { useState, useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import useLogData from "../../hooks/useLogData";
import styles from "./LogViewer.module.css";

const LogViewer = () => {
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";
  const { logEntries, loading, error } = useLogData(url);
  const [expandedRows, setExpandedRows] = useState({});
  const listRef = useRef();

  // Function to toggle row expansion
  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  };

  // Calculate the height of each row
  const getItemSize = useCallback(
    (index) => (expandedRows[index] ? 200 : 40),
    [expandedRows],
  );

  // Helper function to format JSON as multi-line
  const formatMultilineJSON = (jsonObj) => JSON.stringify(jsonObj, null, 2);

  // Helper function to format JSON as single-line
  const formatSingleLineJSON = (jsonObj) => JSON.stringify(jsonObj);

  if (loading && logEntries.length === 0)
    return <div>Loading log entries...</div>;
  if (error) return <div>Error loading log entries: {error}</div>;

  // Function to render each row
  // eslint-disable-next-line react/prop-types
  const Row = ({ index, style }) => {
    const entry = logEntries[index];
    const isExpanded = expandedRows[index];
    const rowId = `log-row-${index}`;

    return (
      <div
        className={styles.logRow}
        style={{
          ...style,
        }}
        role="row"
        aria-expanded={isExpanded} // Set aria-expanded to indicate expanded/collapsed state
        aria-controls={`${rowId}-details`} // Connects this row to its expanded details
        onClick={() => toggleRow(index)}
        id={rowId}
      >
        <div className={styles.logRowContent}>
          <div
            className={styles.expandIndicatorCell}
            role="cell"
            aria-hidden="true"
          >
            <span className={styles.expandIndicatorContent}>
              {isExpanded ? "▼" : "▶"}
            </span>
          </div>
          <div className={styles.timestampCell} role="cell">
            {new Date(entry._time).toISOString()}
          </div>
          <div
            className={isExpanded ? styles.expandedEventCell : styles.collapsedEventCell}
            role="cell"
          >
            {isExpanded ? (
              <pre
                id={`${rowId}-details`} // ID to link with aria-controls
                className={styles.expandedEventCellContent}
                role="region" // Treat this as a separate region for screen readers
                aria-label="Expanded log details"
              >
                {formatMultilineJSON(entry)}
              </pre>
            ) : (
              formatSingleLineJSON(entry)
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Log Viewer</h1>
      <p>Number of logs entries fetched: {logEntries.length}</p>
      <p>Number of entries shown: {logEntries.length}</p>
      <p>Currently loading data? {loading ? "yes" : "no"}</p>
      <div
        className={styles.logViewerContainer}
        role="table"
        aria-label="Log Entries Table"
      >
        <div className={styles.logTable}>
          <div className={styles.tableHeader} role="row">
            <div
              style={{ width: "30px" }}
              role="columnheader"
              aria-hidden="true"
            ></div>
            <div style={{ width: "200px" }} role="columnheader">
              Time
            </div>
            <div style={{ width: "400px" }} role="columnheader">
              Event
            </div>
          </div>
          <List
            ref={listRef}
            height={600} // Set the height of the viewport (adjustable)
            itemCount={logEntries.length}
            itemSize={getItemSize}
            width="100%"
            overscanCount={5} // Optional: renders 5 additional rows before/after the visible area for smoother scrolling
          >
            {Row}
          </List>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
