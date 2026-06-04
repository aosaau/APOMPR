import fs from 'fs';
let content = fs.readFileSync('src/components/Passport.tsx', 'utf8');
content = content.replace(/Math\.round\(analysis\.impliedFairValue\)/g, 'Math.round(baseValue)');
fs.writeFileSync('src/components/Passport.tsx', content);
console.log('Fixed!');
