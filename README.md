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
- Spring Boot (Backend)
- MySQL Database

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Java 17 or later
- MySQL 8.0 or later

### Installation

1. Clone the repository
2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Testing Guide

### Base URL
```
http://localhost:8080/api
```

### 1. Add Stocks

Add Apple stock:
```bash
curl -X POST http://localhost:8080/api/stocks \
-H "Content-Type: application/json" \
-d '{
    "name": "Apple Inc.",
    "ticker": "AAPL",
    "quantity": 10,
    "buyPrice": 150.50
}'
```

Add Microsoft stock:
```bash
curl -X POST http://localhost:8080/api/stocks \
-H "Content-Type: application/json" \
-d '{
    "name": "Microsoft Corporation",
    "ticker": "MSFT",
    "quantity": 5,
    "buyPrice": 280.75
}'
```

Add Tesla stock:
```bash
curl -X POST http://localhost:8080/api/stocks \
-H "Content-Type: application/json" \
-d '{
    "name": "Tesla Inc.",
    "ticker": "TSLA",
    "quantity": 8,
    "buyPrice": 190.25
}'
```

### 2. Get All Stocks
```bash
curl http://localhost:8080/api/stocks
```

### 3. Get Portfolio Summary
```bash
curl http://localhost:8080/api/stocks/portfolio-summary
```

### 4. Update Stock
Replace `{id}` with the actual stock ID:
```bash
curl -X PUT http://localhost:8080/api/stocks/{id} \
-H "Content-Type: application/json" \
-d '{
    "name": "Apple Inc.",
    "ticker": "AAPL",
    "quantity": 15,
    "buyPrice": 150.50
}'
```

### 5. Delete Stock
Replace `{id}` with the actual stock ID:
```bash
curl -X DELETE http://localhost:8080/api/stocks/{id}
```

### Windows PowerShell Users
Use this format instead:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/stocks" `
-Headers @{"Content-Type"="application/json"} `
-Body '{
    "name": "Apple Inc.",
    "ticker": "AAPL",
    "quantity": 10,
    "buyPrice": 150.50
}'
```

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── AddStockForm.tsx
│   ├── PortfolioDashboard.tsx
│   └── StockList.tsx
├── services/             # API services
│   └── api.ts           # API client configuration
└── public/              # Static assets
```

## Implementation Details

- Responsive web interface built with React and Tailwind CSS
- Portfolio management with local state
- Clean and intuitive user interface
- Real-time stock data from Alpha Vantage API
- RESTful backend API with Spring Boot
- MySQL database for persistent storage

### Assumptions & Limitations
- Portfolio is limited to 5 stocks per user
- Stock quantity is fixed at 1 share per stock
- Alpha Vantage API has rate limits (5 calls per minute in free tier)
- Data updates every minute for real-time prices

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

## Environment Variables

Create a `.env` file in the root directory:

```env
ALPHA_VANTAGE_API_KEY=your_api_key
REACT_APP_BACKEND_URL=http://localhost:8080/api
```

For the backend, configure in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=root
spring.datasource.password=yourpassword
```