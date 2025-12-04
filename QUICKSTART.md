# Quick Start Guide - ReplenishHQ

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including React, TypeScript, Vite, Tailwind CSS, and other packages.

### Step 2: Start Development Server

Run the development server:

```bash
npm run dev
```

### Step 3: Open in Browser

The application will automatically open at:
- **http://localhost:3000**

If it doesn't open automatically, manually navigate to that URL in your browser.

---

## 📋 What You'll See

Once the app loads, you'll see:

1. **Dashboard** - Overview of products, stock levels, and sales
2. **Products** - Manage your inventory items
3. **Point of Sale** - Process sales transactions
4. **Suppliers** - Manage supplier information
5. **Orders** - View purchase orders
6. **Analytics** - View sales and revenue charts
7. **Settings** - Configure business and system settings

---

## 🛠 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run type-check` | Check TypeScript types |

---

## ❓ Troubleshooting

### Port Already in Use?

If port 3000 is already in use, Vite will automatically use the next available port (3001, 3002, etc.). Check the terminal output for the actual port number.

### Dependencies Won't Install?

Try these steps:
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm cache clean --force`
4. Run `npm install` again

### TypeScript Errors?

Run `npm run type-check` to see all type errors. Make sure all files are saved and the project structure is correct.

---

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the code structure in `src/` directory
- Customize the application to fit your needs
- Add backend integration when ready

---

**Happy Coding! 🎉**

