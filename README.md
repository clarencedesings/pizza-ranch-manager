# Pizza Ranch FunZone Manager Dashboard

Manager dashboard for Pizza Ranch FunZone in McPherson, KS. React frontend + FastAPI backend.

## Architecture

- **Frontend**: React + Vite (port 8083)
- **Backend**: FastAPI + JSON file storage (port 8082)
- **Chatbot**: Separate service at port 8081 reads `data/specials.json` for today's special

## Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip packages: `fastapi uvicorn httpx`

### Install

```bash
cd /home/clarence/pizza-ranch-manager
npm install
```

### Run Development

Start backend and frontend in separate terminals:

```bash
# Terminal 1: Backend API
cd /home/clarence/pizza-ranch-manager/backend
python3 -m uvicorn server:app --host 0.0.0.0 --port 8082

# Terminal 2: Frontend dev server
cd /home/clarence/pizza-ranch-manager
npm run dev
```

Frontend runs at `http://localhost:8083`, API requests proxy to `http://localhost:8082`.

### Production Build

```bash
npm run build
# Serve the dist/ folder with any static file server
```

### Systemd Services

```bash
# Backend API service
sudo cp backend/pizza-ranch-manager-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now pizza-ranch-manager-backend
```

Frontend can be run via `npm run dev` for development, or built with `npm run build` and served statically with nginx or similar.

## Login

Password: `ranch2026`

## Features

- **Dashboard** — Overview cards: today's special, complaint count, party count, open shifts, low inventory
- **Daily Specials** — Set today's pizza special (feeds into Ranger chatbot)
- **Inventory Checklist** — Track stock levels for 10 key items
- **Complaint Log** — Log and track customer complaints by severity
- **Party Booking Tracker** — Manage party reservations sorted by date
- **Daily Sales Summary** — Record covers, buffet revenue, arcade revenue
- **Staff Announcements** — Post normal/urgent announcements for staff
- **Shift Coverage** — Post open shifts, staff can claim them

## Data Storage

All data stored as JSON files in `/home/clarence/pizza-ranch-manager/data/`:

- `specials.json` — Daily specials (also read by Ranger chatbot)
- `inventory.json` — Inventory checklist state
- `complaints.json` — Complaint log
- `parties.json` — Party bookings
- `announcements.json` — Staff announcements
- `shifts.json` — Shift coverage requests
- `sales.json` — Daily sales entries
