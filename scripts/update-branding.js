// Script to update all AgriHub references to Agri Hub
const fs = require('fs');
const path = require('path');

const files = [
  'components/landing/TestimonialsSection.tsx',
  'components/landing/HowItWorksSection.tsx',
  'components/landing/LandingFooter.tsx',
  'app/(public)/resources/ussd/page.tsx',
  'app/(public)/resources/guide/page.tsx',
  'app/(public)/contact/page.tsx',
  'app/(public)/about/page.tsx',
  'app/(public)/auth/login/page.tsx',
  'app/(app)/settings/page.tsx',
  'app/(app)/marketplace/page.tsx',
  'app/(app)/marketplace/[id]/page.tsx',
  'app/admin/dashboard/page.tsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/AgriHub/g, 'Agri Hub');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
