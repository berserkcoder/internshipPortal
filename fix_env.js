const fs = require('fs');

['backend/.env', 'frontend/.env'].forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(file, content.replace(/\r/g, ''));
        console.log(`Fixed line endings for ${file}`);
    } catch(e) {
        console.error(`Error processing ${file}:`, e.message);
    }
});
