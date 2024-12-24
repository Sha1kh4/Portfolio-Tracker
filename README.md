# Portfolio Tracker

A real-time stock portfolio tracking application built with Next.js that allows users to track a portfolio of 5 randomly selected stocks.

## Features

- View and manage a portfolio of 5 randomly selected stocks
- Real-time portfolio value tracking using stock price APIs
- Dashboard displaying key portfolio metrics (total value, top performer)
- Responsive design optimized for all devices

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── AddStockForm.tsx
│   ├── PortfolioDashboard.tsx
│   └── StockList.tsx
└── public/               # Static assets
```

## Implementation Details

- Responsive web interface built with React and Tailwind CSS
- Portfolio management with local state
- Clean and intuitive user interface

### Assumptions & Limitations
- Portfolio is limited to 5 stocks per user
- Stock quantity is fixed at 1 share per stock
- Data persists only during the session

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```