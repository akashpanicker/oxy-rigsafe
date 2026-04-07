# H&P RigSafe – ROC Dashboard

A real-time CCTV surveillance and safety alert monitoring dashboard built for H&P's Remote Operations Center (ROC). The application enables operators to monitor multiple drilling rig camera feeds, track safety alerts, and review incident timelines from a centralized interface.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Run the Development Server](#run-the-development-server)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Features](#features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The RigSafe ROC Dashboard provides industrial site operators with a unified view of:

- **Live camera feeds** from multiple rigs, sites, and regions
- **Real-time safety alerts** (human detection, vehicle detection, equipment detection)
- **Zone monitoring** across Red Zone, Yellow Zone, Restricted Zone, and Operational Zone classifications
- **Incident details** with a filterable event timeline
- **Toast notifications** for incoming alerts
- Dual-layout support to adapt to different operator workflows

---

## Prerequisites

Ensure the following are installed before setting up the project:

| Requirement | Version |
|-------------|---------|
| [Node.js](https://nodejs.org/) | v18+ recommended |
| npm | v9+ (bundled with Node.js) |

Verify your installations:

```bash
node --version
npm --version
```

---

## Getting Started

### Clone the Repository

```bash
git clone <repository-url>
cd "HP RigSafe"
```

> _Replace `<repository-url>` with the actual remote URL once confirmed._

### Install Dependencies

```bash
npm install
```

### Environment Variables

This project currently uses static mock data and does not require any environment variables to run locally.

> _If backend integration or API keys are added in the future, document them in a `.env.example` file at the project root._

### Run the Development Server

```bash
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)** by default (Vite's default port).

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server with Hot Module Replacement |
| `npm run build` | Compile TypeScript and bundle the app for production |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run ESLint across the source files |

---

## Project Structure

```
HP RigSafe/
├── public/
│   └── assets/
│       └── images/          # Static camera feed images, logos, and sample video
├── src/
│   ├── components/          # Reusable React UI components
│   │   ├── AlertCardPanel.tsx      # Panel showing active and recent alerts
│   │   ├── AlertRow.tsx            # Single row entry in the alert table
│   │   ├── AlertTable.tsx          # Tabular view of alert history
│   │   ├── AlertToast.tsx          # Toast notification for incoming alerts
│   │   ├── CameraHierarchyDropdown.tsx  # Dropdown for Region > Site > Rig > Camera selection
│   │   ├── CameraThumbnail.tsx     # Individual camera thumbnail
│   │   ├── CameraThumbnailBar.tsx  # Horizontal bar of camera thumbnails
│   │   ├── EventTimeline.tsx       # Filterable incident/event timeline
│   │   ├── Header.tsx              # Top navigation and branding bar
│   │   ├── Sidebar.tsx             # Sidebar navigation and alert summary
│   │   ├── Tooltip.tsx             # Accessible tooltip component
│   │   └── VideoPanel.tsx          # Main video player panel
│   ├── constants/
│   │   └── alerts.ts               # Static mock alert data (25 entries)
│   ├── styles/
│   │   └── app.css                 # Global styles and CSS design tokens
│   ├── App.tsx                     # Root component with hash-based routing and layout state
│   ├── IncidentDetailsPage.tsx     # Dedicated incident details view
│   ├── main.tsx                    # React app entry point
│   └── vite-env.d.ts               # Vite TypeScript environment declarations
├── index.html                      # HTML shell (title: "H&P RigSafe – ROC Dashboard")
├── vite.config.js                  # Vite build configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── eslint.config.js                # ESLint flat config (v9)
├── package.json                    # Project metadata and npm scripts
└── .gitignore                      # Files excluded from version control
```

### Key Architectural Notes

- **Routing**: Hash-based routing via `window.location.hash`. Two routes: `#/` (dashboard) and `#/incident-details`.
- **Layouts**: Two switchable dashboard layouts controlled from `App.tsx`.
  - Layout 1: Single video panel + alerts sidebar
  - Layout 2: Dual video panels + full alert table
- **State**: Component-level React state; no external state management library.
- **Styling**: CSS custom properties (design tokens) defined in `app.css` for colors, spacing, typography, and shadows.
- **Data**: All alert and camera data is currently static mock data in `src/constants/alerts.ts`.

---

## Features

- **Dual Dashboard Layouts** — Switch between single-feed and dual-feed views
- **Camera Hierarchy Dropdown** — Navigate by Region → Site → Rig → Camera
- **Alert Monitoring** — Live-style alert table with severity and zone classification
- **Toast Notifications** — Non-blocking alerts for incoming safety events
- **Video Panel** — Embedded video playback with close functionality
- **Event Timeline** — Filter events by time range (15 min to 2 days)
- **Incident Details Page** — Drill into a specific incident's full event log
- **Tooltip System** — Contextual tooltips across interactive elements
- **Dark Theme** — Consistent dark UI optimized for ROC operator environments

---

## Troubleshooting

### `npm install` fails

- Ensure you are using Node.js v18 or later.
- Delete `node_modules` and `package-lock.json`, then re-run `npm install`.

```bash
rm -rf node_modules package-lock.json
npm install
```

### Dev server port is already in use

Vite will automatically try the next available port. To set a specific port:

```bash
npm run dev -- --port 3000
```

Or configure it permanently in `vite.config.js`:

```js
export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
})
```

### TypeScript errors after pulling changes

Run the TypeScript compiler check manually:

```bash
npx tsc --noEmit
```

Fix any type errors reported before running the dev server.

### ESLint errors blocking development

```bash
npm run lint
```

Review the output and resolve flagged issues. The project uses ESLint v9 flat config — ensure your editor's ESLint extension supports this format.

### Camera images or video not loading

Static assets are served from the `public/assets/images/` directory. Confirm the files exist at the expected paths referenced in the component files.

---

## Contributing

1. **Fork** the repository and create a new branch from `master`:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes, following the existing code style and component conventions.

3. Run linting before committing:

```bash
npm run lint
```

4. **Commit** with a clear, descriptive message:

```bash
git commit -m "Add: brief description of your change"
```

5. **Push** your branch and open a Pull Request against `master`.

6. Ensure your PR description explains:
   - What was changed and why
   - Any new dependencies introduced
   - Screenshots for UI changes

> _Add explanation here once a formal code review or CI process is confirmed._

---

## License

This project is licensed under the **MIT License**.

> _Confirm with the project owner whether a proprietary or alternative license applies before public distribution._
