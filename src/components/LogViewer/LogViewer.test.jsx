import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, vi } from "vitest";
import LogViewer from "./LogViewer.jsx";
import useLogData from "../../hooks/useLogData.js";

// Mock the useLogData hook
vi.mock("../../hooks/useLogData");

describe("LogViewer Component", () => {
  beforeEach(() => {
    // Clear mock calls before each test
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    useLogData.mockReturnValue({ logEntries: [], loading: true, error: null });
    render(<LogViewer />);
    expect(screen.getByText(/Loading log entries.../i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    useLogData.mockReturnValue({
      logEntries: [],
      loading: false,
      error: "Error fetching data",
    });
    render(<LogViewer />);
    expect(screen.getByText(/Error loading log entries/i)).toBeInTheDocument();
  });

  it("renders log entries correctly", () => {
    const mockLogEntries = [
      { _time: "2024-09-30T12:00:00Z", message: "Test log entry 1" },
      { _time: "2024-09-30T12:10:00Z", message: "Test log entry 2" },
    ];
    useLogData.mockReturnValue({
      logEntries: mockLogEntries,
      loading: false,
      error: null,
    });

    render(<LogViewer />);

    // Check that the log entries are rendered
    expect(screen.getByText(/Test log entry 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test log entry 2/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-09-30T12:00:00.000Z/i)).toBeInTheDocument();
    expect(screen.getByText(/2024-09-30T12:10:00.000Z/i)).toBeInTheDocument();
  });

  it("toggles row expansion when clicked", async () => {
    const mockLogEntries = [
      {
        _time: "2024-09-30T12:00:00Z",
        message: { event: "Event 1", details: "Details 1" },
      },
    ];
    useLogData.mockReturnValue({
      logEntries: mockLogEntries,
      loading: false,
      error: null,
    });

    render(<LogViewer />);

    // Initially, the row should show a single line JSON
    expect(
      screen.getByText(/{"event":"Event 1","details":"Details 1"}/i),
    ).toBeInTheDocument();

    // Click to expand the row
    fireEvent.click(screen.getByText(/▶/i)); // Clicking the expand indicator

    // Wait for the expanded content to appear
    await waitFor(() => {
      expect(screen.getByText(/"event": "Event 1"/i)).toBeInTheDocument();
      expect(screen.getByText(/"details": "Details 1"/i)).toBeInTheDocument();
    });
  });
});
