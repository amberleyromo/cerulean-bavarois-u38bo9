# Log Viewer

This project provides an example UI for displaying the contents of a large log file downloaded from a URL. It reads log data from an ndjson stream, and renders it in a table with expandable/collapsable rows that leverages virtualization for performance, rendering only visible elements. It uses the most minimal possible production dependencies, primarily `react-window` for virtualization.

## Setup and Installation

### Prerequisites

- Node.js (tested with v20)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amberleyromo/cerulean-bavarois-u38bo9.git
   cd cerulean-bavarois-u38bo9
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Technologies Used

- **React**: Core framework for building the UI.
- **react-window**: For virtualizing large lists to improve rendering performance.
- **React Testing Library & Vitest**: For testing.
- **CSS Modules**: For scoped, maintainable styles.

## Testing

This project uses Vitest and React Testing Library.

### Running tests

```bash
npm run test
# or
yarn test
```

## Future Improvements and Considerations

### Possible improvements

- Refactor `LogViewer` component to break it up into smaller, reusable, more maintainable pieces.
- Consider fetching in response to user input instead / extend for user to fetch from any log URL.
- Consider different caching strategies to improve load performance.
- More robust error handling and retry logic.
- Real-time data updates.

### Further testing

- Expanded testing of the `LogViewer` component.
- Testing of utilities like `ndjsonParser`.
- Testing of hooks like `useLogDataHook`.
- Test and validate that reintroduced semantics for table roles is correct, given the need to transition away from it due to usage of `react-window`.
