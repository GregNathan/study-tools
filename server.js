const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('.'));

const MODULES_PATH = path.join(__dirname, 'modules');

// Get all materials data dynamically
app.get('/api/materials', (req, res) => {
    try {
        const materialsData = {
            subjects: {}
        };

        // Define subjects with their icons
        const subjectIcons = {
            'Basic Calculus': '📐',
            'Disaster Readiness and Risk Reduction': '🚨',
            'Empowerment Technologies': '💻',
            'Gen Physics 2': '⚛️',
            'General Biology 2': '🧬',
            'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik': '📖',
            'Physical Education and Health': '🏃',
            'Reading and Writing': '✍️',
            'Statics and Probability': '📊',
            'Understanding Culture, Society and Politics': '🌍'
        };

        // Scan each subject folder
        Object.keys(subjectIcons).forEach(subjectName => {
            const subjectPath = path.join(MODULES_PATH, subjectName);
            
            if (fs.existsSync(subjectPath)) {
                const files = [];
                
                try {
                    const items = fs.readdirSync(subjectPath);
                    
                    items.forEach(item => {
                        const itemPath = path.join(subjectPath, item);
                        const stats = fs.statSync(itemPath);
                        
                        // Only include files, not directories
                        if (stats.isFile() && item.toLowerCase().endsWith('.pdf')) {
                            const sizeInBytes = stats.size;
                            const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(1);
                            
                            files.push({
                                name: item.replace('.pdf', ''),
                                type: 'pdf',
                                url: `/modules/${subjectName}/${item}`,
                                size: `${sizeInMB} MB`
                            });
                        }
                    });
                } catch (err) {
                    console.error(`Error reading ${subjectName}:`, err.message);
                }
                
                // Only add subject if it has files
                if (files.length > 0) {
                    materialsData.subjects[subjectName] = {
                        icon: subjectIcons[subjectName],
                        files: files
                    };
                }
            }
        });

        res.json(materialsData);
    } catch (error) {
        console.error('Error reading materials:', error);
        res.status(500).json({ error: 'Failed to read materials' });
    }
});

// Serve PDF files
app.use('/modules', express.static(path.join(__dirname, 'modules')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Materials folder: ${MODULES_PATH}`);
});
