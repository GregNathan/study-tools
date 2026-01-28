// Learner Materials JavaScript
console.log('Learner Materials loaded');

// Materials data structure
const materialsData = {
    subjects: {
        'Basic Calculus': {
            icon: '📐',
            files: [
                { name: 'Lesson 1', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-1.pdf', size: '2.4 MB' },
                { name: 'Lesson 2', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-2.pdf', size: '3.1 MB' },
                { name: 'Lesson 3', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-3.pdf', size: '1.8 MB' },
                { name: 'Lesson 4', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-4.pdf', size: '1.8 MB' },
                { name: 'Lesson 5', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-5.pdf', size: '1.8 MB' },
                { name: 'Lesson 6', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-6.pdf', size: '1.8 MB' },
                { name: 'Lesson 7', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-7.pdf', size: '1.8 MB' },
                { name: 'Lesson 8', type: 'pdf', url: '/Basic Calculus/Basic Calculus-Q3-Module-8.pdf', size: '1.8 MB' },
            ]
        },
        'Disaster Readiness and Risk Reduction': {
            icon: '🚨',
            files: [
                { name: 'Disaster Management Framework', type: 'pdf', url: '/Disaster Readiness and Risk Reduction/Disaster Management Framework.pdf', size: '2.7 MB' },
                { name: 'Risk Assessment Guide', type: 'pdf', url: '/Disaster Readiness and Risk Reduction/Risk Assessment Guide.pdf', size: '2.2 MB' },
                { name: 'Emergency Response Procedures', type: 'pdf', url: '/Disaster Readiness and Risk Reduction/Emergency Response Procedures.pdf', size: '1.9 MB' }
            ]
        },
        'Empowerment Technologies': {
            icon: '💻',
            files: [
                { name: 'Digital Literacy Handbook', type: 'pdf', url: '/Empowerment Technologies/Digital Literacy Handbook.pdf', size: '3.5 MB' },
                { name: 'Technology and Society', type: 'pdf', url: '/Empowerment Technologies/Technology and Society.pdf', size: '2.8 MB' },
                { name: 'Digital Safety Guide', type: 'pdf', url: '/Empowerment Technologies/Digital Safety Guide.pdf', size: '2.0 MB' }
            ]
        },
        'Gen Physics 2': {
            icon: '⚛️',
            files: [
                { name: 'Electricity and Magnetism', type: 'pdf', url: '/Gen Physics 2/Electricity and Magnetism.pdf', size: '4.2 MB' },
                { name: 'Optics and Waves', type: 'pdf', url: '/Gen Physics 2/Optics and Waves.pdf', size: '3.8 MB' },
                { name: 'Modern Physics Introduction', type: 'pdf', url: '/Gen Physics 2/Modern Physics Introduction.pdf', size: '3.0 MB' }
            ]
        },
        'General Biology 2': {
            icon: '🧬',
            files: [
                { name: 'Cell Biology and Genetics', type: 'pdf', url: '/General Biology 2/Cell Biology and Genetics.pdf', size: '3.6 MB' },
                { name: 'Evolution and Ecology', type: 'pdf', url: '/General Biology 2/Evolution and Ecology.pdf', size: '3.2 MB' },
                { name: 'Molecular Biology', type: 'pdf', url: '/General Biology 2/Molecular Biology.pdf', size: '2.9 MB' }
            ]
        },
        'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik': {
            icon: '📖',
            files: [
                { name: 'Text Analysis Methods', type: 'pdf', url: '/Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik/Text Analysis Methods.pdf', size: '2.3 MB' },
                { name: 'Research Writing Guide', type: 'pdf', url: '/Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik/Research Writing Guide.pdf', size: '2.5 MB' },
                { name: 'Critical Reading Skills', type: 'pdf', url: '/Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik/Critical Reading Skills.pdf', size: '2.1 MB' }
            ]
        },
        'Physical Education and Health': {
            icon: '🏃',
            files: [
                { name: 'Fitness and Wellness', type: 'pdf', url: '/Physical Education and Health/Fitness and Wellness.pdf', size: '2.6 MB' },
                { name: 'Health and Nutrition', type: 'pdf', url: '/Physical Education and Health/Health and Nutrition.pdf', size: '2.4 MB' },
                { name: 'Sports and Exercise Science', type: 'pdf', url: '/Physical Education and Health/Sports and Exercise Science.pdf', size: '2.8 MB' }
            ]
        },
        'Reading and Writing': {
            icon: '✍️',
            files: [
                { name: 'Writing Essentials', type: 'pdf', url: '/Reading and Writing/Writing Essentials.pdf', size: '2.2 MB' },
                { name: 'Comprehension Strategies', type: 'pdf', url: '/Reading and Writing/Comprehension Strategies.pdf', size: '2.0 MB' },
                { name: 'Grammar and Composition', type: 'pdf', url: '/Reading and Writing/Grammar and Composition.pdf', size: '2.7 MB' }
            ]
        },
        'Statics and Probability': {
            icon: '📊',
            files: [
                { name: 'Statistical Methods', type: 'pdf', url: '/Statics and Probability/Statistical Methods.pdf', size: '3.1 MB' },
                { name: 'Probability Theory', type: 'pdf', url: '/Statics and Probability/Probability Theory.pdf', size: '3.4 MB' },
                { name: 'Data Analysis Guide', type: 'pdf', url: '/Statics and Probability/Data Analysis Guide.pdf', size: '2.8 MB' }
            ]
        },
        'Understanding Culture, Society and Politics': {
            icon: '🌍',
            files: [
                { name: 'Sociology Fundamentals', type: 'pdf', url: '/Understanding Culture, Society and Politics/Sociology Fundamentals.pdf', size: '2.9 MB' },
                { name: 'Political Systems Guide', type: 'pdf', url: '/Understanding Culture, Society and Politics/Political Systems Guide.pdf', size: '3.0 MB' },
                { name: 'Cultural Diversity', type: 'pdf', url: '/Understanding Culture, Society and Politics/Cultural Diversity.pdf', size: '2.5 MB' }
            ]
        }
    }
};

let currentView = 'grid'; // 'grid' or 'list'
let currentPath = []; // Breadcrumb path

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('materials-container');
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    const previewModal = document.getElementById('preview-modal');
    const closeBtn = document.querySelector('.close');
    const closePreviewBtn = document.getElementById('close-preview');

    // View toggle buttons
    gridBtn.addEventListener('click', () => {
        currentView = 'grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        renderMaterials();
    });

    listBtn.addEventListener('click', () => {
        currentView = 'list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        renderMaterials();
    });

    // Modal close handlers
    closeBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });

    closePreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Initial render
    renderMaterials();
});

function renderMaterials() {
    const container = document.getElementById('materials-container');
    const breadcrumb = document.getElementById('breadcrumb');

    // Update breadcrumb
    updateBreadcrumb();

    // Clear container
    container.innerHTML = '';
    container.className = currentView === 'grid' ? 'materials-grid' : 'materials-list';

    // If viewing subjects (root level)
    if (currentPath.length === 0) {
        Object.keys(materialsData.subjects).forEach(subjectName => {
            const subject = materialsData.subjects[subjectName];
            const item = createSubjectItem(subjectName, subject);
            container.appendChild(item);
        });
    }
    // If viewing files in a subject
    else if (currentPath.length === 1) {
        const subject = materialsData.subjects[currentPath[0]];
        if (subject && subject.files) {
            subject.files.forEach(file => {
                const item = createFileItem(file);
                container.appendChild(item);
            });
        }
    }
}

function createSubjectItem(subjectName, subject) {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.innerHTML = `
        <div class="material-icon">${subject.icon}</div>
        <div class="material-name">${subjectName}</div>
        <div class="material-info">${subject.files.length} files</div>
    `;

    item.addEventListener('click', () => {
        currentPath = [subjectName];
        renderMaterials();
    });

    return item;
}

function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'material-item';
    item.innerHTML = `
        <div>
            <div class="material-icon">📄</div>
            <div class="material-name">${file.name}</div>
            <div class="material-info">${file.size}</div>
        </div>
        <div class="material-actions">
            <button class="btn-action preview-btn" data-file="${file.name}">👁️ Preview</button>
            <button class="btn-action download-btn" data-file="${file.name}">📥 Download</button>
        </div>
    `;

    // Preview button
    const previewBtn = item.querySelector('.preview-btn');
    previewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreview(file);
    });

    // Download button
    const downloadBtn = item.querySelector('.download-btn');
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadFile(file);
    });

    return item;
}

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';

    // Home link
    const homeLink = document.createElement('a');
    homeLink.textContent = '📚 Learner Materials';
    homeLink.href = '#';
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPath = [];
        renderMaterials();
    });
    breadcrumb.appendChild(homeLink);

    // Current path
    currentPath.forEach((item, index) => {
        const separator = document.createElement('span');
        separator.textContent = ' / ';
        breadcrumb.appendChild(separator);

        const link = document.createElement('a');
        link.textContent = item;
        link.href = '#';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPath = currentPath.slice(0, index + 1);
            renderMaterials();
        });
        breadcrumb.appendChild(link);
    });
}

function showPreview(file) {
    const modal = document.getElementById('preview-modal');
    const titleEl = document.getElementById('preview-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    const downloadBtn = document.getElementById('download-btn');

    titleEl.textContent = file.name;
    
    // Set PDF viewer source (using placeholder)
    pdfViewer.src = `data:application/pdf,%25PDF-1.4%0A1%200%20obj%0A%3C%3Ctype%2Fcatalog%2Fpages%202%200%20R%3E%3E%0Aendobj%0A2%200%20obj%0A%3C%3Ctype%2Fpages%2Fkids%5B3%200%20R%5D%2Fcount%201%3E%3E%0Aendobj%0A3%200%20obj%0A%3C%3Ctype%2Fpage%2Fparent%202%200%20R%2Fresources%3C%3Cfont%3C%3Cf1%205%200%20R%3E%3E%3E%2Fmediabox%5B0%200%20612%20792%5D%2Fcontent%204%200%20R%3E%3E%0Aendobj%0A4%200%20obj%0A%3Cstream%0ABT%2FDocumentsample%20f1%2024%20tf%0A100%20700%20td%0A(${file.name})Tj%0AET%0Aendstream%0Aendobj%0A5%200%20obj%0A%3C%3Ctype%2Ffont%2Fsubtype%2Ftype1%2Fbasefont%2FHelvetica%3E%3E%0Aendobj%0Axref%0A0%206%0A0000000000%2065535%20f%0A0000000009%2000000%20n%0A0000000074%2000000%20n%0A0000000120%2000000%20n%0A0000000262%2000000%20n%0A0000000374%2000000%20n%0Atrailer%0A%3C%3Csize%206%2Froot%201%200%20R%3E%3E%0Astartxref%0A430%0A%%EOF`;

    // Setup download button
    downloadBtn.onclick = () => downloadFile(file);

    modal.style.display = 'block';
}

function downloadFile(file) {
    // Download the PDF file
    console.log('Downloading:', file.name);
    
    // If file has a valid URL, download it
    if (file.url && file.url !== '#') {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = `${file.name}.pdf`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        // Placeholder message
        alert(`PDF: ${file.name} is ready to download.`);
    }
}
