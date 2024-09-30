import useLogData from "../../hooks/useLogData";
import styles from "./LogViewer.module.css";

const LogViewer = () => {
  const url = "https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log";
  const { logEntries, loading, error } = useLogData(url);
  // @TODO: For during dev, remove after handling large numbers of log entries
  const firstXItems = logEntries.slice(0, 30);

  if (error) return <div>Error loading log entries: {error}</div>;

  return (
    <div className={styles.container}>
      <h1>Log Viewer</h1>
      <p>Number of log entries fetched: {logEntries.length}</p>
      <p>Truncated log entries shown: {firstXItems.length}</p>
      <p>Currently loading data? {loading ? "yes" : "no"}</p>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {firstXItems.map((entry, index) => (
            <tr key={index}>
              <td>{new Date(entry._time).toISOString()}</td>
              <td>
                <pre>{JSON.stringify(entry, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
