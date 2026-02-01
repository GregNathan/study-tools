# Dynamic Materials Loader Setup

## How It Works

The system now **automatically detects PDF files** in your folder structure and displays them without hardcoding.

### Folder Structure

Create this folder structure and add your PDF files:

```
Web/
├── modules/
│   ├── Basic Calculus/
│   │   ├── Basic Calculus-Q3-Module-1.pdf
│   │   ├── Basic Calculus-Q3-Module-2.pdf
│   │   └── ... (more PDFs)
│   ├── Disaster Readiness and Risk Reduction/
│   │   └── ... (your PDFs here)
│   ├── Empowerment Technologies/
│   │   └── ... (your PDFs here)
│   ├── Gen Physics 2/
│   │   └── ... (your PDFs here)
│   ├── General Biology 2/
│   │   └── ... (your PDFs here)
│   ├── Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik/
│   │   └── ... (your PDFs here)
│   ├── Physical Education and Health/
│   │   └── ... (your PDFs here)
│   ├── Reading and Writing/
│   │   └── ... (your PDFs here)
│   ├── Statics and Probability/
│   │   └── ... (your PDFs here)
│   └── Understanding Culture, Society and Politics/
│       └── ... (your PDFs here)
├── server.js
├── package.json
└── ... (other files)
```

## Installation & Setup

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Open Terminal** in the Web folder and install dependencies:
   ```
   npm install
   ```

3. **Start the server**:
   ```
   npm start
   ```

4. **Open your browser**:
   - Go to `http://localhost:3000`

## What It Does Automatically

✅ Scans all subject folders  
✅ Detects all PDF files  
✅ Calculates file sizes automatically  
✅ Updates the UI dynamically  
✅ No hardcoding needed!  

## Adding New Modules

Simply:
1. Create a new folder in `/modules/` with the exact subject name
2. Add your PDF files inside
3. Restart the server
4. The materials will appear automatically!

## Notes

- Only `.pdf` files are detected
- File sizes are automatically calculated
- The subject icons are predefined (📐, 🚨, etc.)
- Files appear in the order they're found in the folder
