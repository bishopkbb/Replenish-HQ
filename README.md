# ReplenishHQ - Smart Sales & Inventory Management System

<div align="center">

![ReplenishHQ](https://img.shields.io/badge/ReplenishHQ-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?logo=tailwind-css)

**A modern, professional inventory management system built with React, TypeScript, and Tailwind CSS**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Project Structure](#project-structure) • [Technology Stack](#technology-stack)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

ReplenishHQ is a comprehensive inventory management system designed to help retail and wholesale businesses manage products, track sales, and maintain optimal inventory levels. It provides real-time visibility into stock movement, automates restocking workflows, and delivers actionable analytics to support better business decisions.

### Core Purpose

ReplenishHQ centralizes product, sales, and inventory data into one easy-to-use platform. It helps prevent stockouts and overstocking, streamlines supplier ordering, and makes daily store operations faster and more accurate.

## ✨ Features

### 🔐 Authentication & User Roles
- Secure login with email + password
- Role-based access control: Admin, Manager, Staff, Viewer
- Multi-user support and password recovery

### 📊 Dashboard
- Today's sales overview with key metrics
- Low-stock alerts and notifications
- Key statistics (products, out-of-stock items, pending orders)
- Interactive sales charts and recent transactions
- Real-time data visualization

### 📦 Product Management
- Add/edit products with comprehensive details (SKU, pricing, categories, supplier link)
- Track stock quantity and reorder thresholds
- Bulk import/export (CSV) support
- Optional barcodes and product images
- Advanced search and filtering

### 📈 Inventory Tracking
- Real-time stock updates
- Stock adjustment logs (who, when, reason)
- Loss/damage corrections
- Low-stock notifications
- Inventory history tracking

### 🛒 Sales / POS System
- Fast POS interface with search and barcode scanning
- Manual product entry
- Discounts and multiple payment types
- Digital receipts generation
- Daily sales summary
- Returns/refunds management

### 🚚 Purchase Orders & Suppliers
- Comprehensive supplier management
- Manual or auto-generated purchase orders
- Receive stock and update inventory automatically
- Purchase history tracking
- Order status management

### 🤖 Smart Replenishment
- Auto-reorder rules per product
- Low-stock triggers
- Suggested reorder quantities
- Approval workflow for automated POs

### 📊 Reports & Analytics
- Sales reports (daily, weekly, monthly, custom date ranges)
- Profit & loss statements
- Best-selling & slow-moving products analysis
- Stock movement logs
- Export to PDF/Excel

## 🛠 Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **TypeScript 5.2.2** - Type-safe development
- **Vite 5.0.8** - Fast build tool and dev server
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Recharts 2.10.3** - Beautiful charts and data visualization
- **Lucide React** - Modern icon library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/replenish-hq.git
cd replenish-hq
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Start the Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will start on `http://localhost:3000` (or the next available port).

## 💻 Usage

### Development Mode

Run the development server:
```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`.

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
replenish-hq/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Analytics.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Orders.tsx
│   │   ├── POS.tsx
│   │   ├── Products.tsx
│   │   ├── Settings.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatCard.tsx
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── constants.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## 🔧 Development

### Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** (recommended) for code formatting

### Adding New Features

1. Create components in `src/components/`
2. Add types in `src/types/index.ts`
3. Add utilities in `src/utils/`
4. Follow the existing code structure and patterns

### Component Guidelines

- Use functional components with TypeScript
- Implement proper error handling
- Add validation for user inputs
- Use Tailwind CSS for styling
- Follow React best practices

## 🌐 Viewing on Localhost

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, navigate to `http://localhost:3000` manually

### Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port (3001, 3002, etc.)
- Check the terminal output for the actual port number
- Or specify a port in `vite.config.ts`:
  ```typescript
  server: {
    port: 3000,
    strictPort: true, // Exit if port is in use
  }
  ```

**Dependencies not installing?**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**TypeScript errors?**
- Run `npm run type-check` to see all type errors
- Ensure all imports are correct
- Check that types are properly defined in `src/types/`

## 🚢 Building for Production

### Create Production Build

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle and minify code
- Optimize assets
- Output to `dist/` directory

### Deploy

The `dist/` directory contains the production-ready files. You can deploy this to:
- **Vercel** - `vercel deploy`
- **Netlify** - Drag and drop the `dist` folder
- **GitHub Pages** - Configure in repository settings
- **Any static hosting service**

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful data visualization

---

<div align="center">

**Made with ❤️ using React, TypeScript, and Tailwind CSS**

[Report Bug](https://github.com/yourusername/replenish-hq/issues) • [Request Feature](https://github.com/yourusername/replenish-hq/issues)

</div>
