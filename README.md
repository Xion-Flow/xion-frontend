# Xion Frontend Application

The modern, responsive web application for **Xion** — an engineering lifecycle project management platform. Built with React, TypeScript, Vite, Lucide icons, and a custom Vanilla CSS design system.

## 🎨 Design & Aesthetic Features

- **Custom Design System**: Vanilla CSS design system (`theme.css`) with CSS custom properties, smooth transitions, and light/dark theme switcher.
- **Glassmorphism & Micro-animations**: Sleek card containers, modal backdrops, and interactive hover states.
- **Responsive Layouts**: Fully responsive grid and flexbox interfaces designed for all viewport sizes.

---

## ⚡ Features & Views

### 1. Unique Username Handles & Profile Management (`/profile`)
- Debounced `@username` availability checker with live feedback badges (green check / red error).
- Profile editor for updating Full Name, `@username`, Email, Avatar, and Password.

### 2. Projects Workspace (`/projects`)
- **Status Filter Tabs**: Quick filtering by `Active Projects`, `All Projects`, `Completed`, and `Archived`.
- **Create Project Modal**: Option for `Personal` or `Team` projects with a live `@username` candidate search input and interactive selected member profile chips.
- **Project Cards**: Displays phase progress bar, active phase indicator, tech stack tags, and quick-access **GitHub Repo** and **Live Demo** badges.

### 3. Project Detail Page (`/projects/:id`)
- **10-Phase Roadmap Sidebar**: Visual phase status indicators (`COMPLETED`, `IN_PROGRESS`, `NOT_STARTED`). Phase status dynamically updates to `IN_PROGRESS` only when deliverables are started.
- **Deliverables Checklist**: Update deliverable status, assign team members (restricted to project team), attach document URLs, and add completion notes.
- **Header Actions & Modal Safety**:
  - **Edit Details Modal**: Edit Project Name, Description, Tech Stack, GitHub Repo URL, Live Demo URL, Target Completion Date, and Status.
  - **Archive / Unarchive**: Toggle read-only archived state.
  - **Delete Project**: Creator & Admin restricted permanent deletion requiring project name typing confirmation.
  - **Leave Project**: Non-creator team members can leave project (unassigns pending deliverables).

### 4. Interactive Notification Drawer (Navbar Bell)
- Unread badge counter icon in the global navigation bar.
- Interactive popover displaying pending **Project Join Request** notifications with **Accept & Join** and **Decline** buttons.

### 5. My Work Board (`/my-work`)
- Personal dashboard indexing all deliverables assigned to the logged-in user across all active projects.
- Filter by status (`ALL`, `PENDING`, `COMPLETED`, `IN_PROGRESS`, `BLOCKED`) and sort by creation or due date.

---

## 💻 Getting Started

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Dev Server
```bash
# Start Vite development server on http://localhost:3000
npm run dev
```

### 3. Production Build
```bash
# Compile TypeScript and build production distribution in dist/
npm run build

# Preview production build locally
npm run preview
```
