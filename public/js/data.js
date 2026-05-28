/* ═══════════════════════════════════════════
   DATA MANAGEMENT
   Handles loading/saving data to localStorage
   ═══════════════════════════════════════════ */

// Default data if none exists in localStorage
const defaultProjects = [
  {
    id: 'proj-1',
    title: 'Modern Villa Kochi',
    category: 'exterior',
    description: 'A contemporary luxury villa featuring open spaces, natural light, and a seamless blend of indoor-outdoor living.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    location: 'Kochi, Kerala',
    year: '2026'
  },
  {
    id: 'proj-2',
    title: 'Minimalist Living Space',
    category: 'living-room',
    description: 'A warm and modern living room designed with balanced lighting, comfortable seating, and a layout that brings style and everyday comfort together.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    location: 'Ernakulam, Kerala',
    year: '2025'
  },
  {
    id: 'proj-3',
    title: 'Functional Modern Kitchen',
    category: 'kitchen',
    description: 'A functional, modern kitchen designed for easy movement, smart storage, and a clean, stylish look that fits everyday living.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85',
    location: 'Thiruvananthapuram',
    year: '2025'
  },
  {
    id: 'proj-4',
    title: 'Serene Master Bedroom',
    category: 'bedroom',
    description: 'A calming bedroom retreat featuring neutral tones, custom woodwork, and soft ambient lighting for ultimate relaxation.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
    location: 'Thrissur, Kerala',
    year: '2024'
  },
  {
    id: 'proj-5',
    title: 'Executive Small Office',
    category: 'office',
    description: 'An efficient, comfortable small office space designed for productivity and professionalism with smart space planning.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    location: 'Kochi, Kerala',
    year: '2025'
  },
  {
    id: 'proj-6',
    title: 'Luxury Bathroom Retreat',
    category: 'bathroom',
    description: 'A spa-like bathroom renovation with premium fixtures, elegant tiling, and thoughtful lighting design.',
    image: 'https://images.unsplash.com/photo-1620626011761-9ea224050b1a?auto=format&fit=crop&w=1200&q=85',
    location: 'Kottayam, Kerala',
    year: '2024'
  }
];

const defaultTestimonials = [
  {
    id: 'test-1',
    name: 'Anu & Rakesh',
    location: 'Kochi',
    text: 'They handled our home project with so much care and clarity. Every update was communicated on time, and the final result truly felt like our home. We’re so glad we chose them.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Mohammed Ali',
    location: 'Ernakulam',
    text: 'From the first meeting to the final handover, the team was highly professional. The interior work in our new apartment exceeded our expectations.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Priya George',
    location: 'Thrissur',
    text: 'Choosing Kreupas Construction was the best decision we made for our villa renovation. Honest pricing, excellent quality, and delivered right on schedule.',
    rating: 5
  },
  {
    id: 'test-4',
    name: 'Rahul Varma',
    location: 'Thiruvananthapuram',
    text: 'The office space they designed for us is perfect. It makes great use of a small area and feels very premium. Highly recommend their services.',
    rating: 4
  }
];

// Initialize data if needed
function initData() {
  if (!localStorage.getItem('kc_projects')) {
    localStorage.setItem('kc_projects', JSON.stringify(defaultProjects));
  }
  if (!localStorage.getItem('kc_testimonials')) {
    localStorage.setItem('kc_testimonials', JSON.stringify(defaultTestimonials));
  }
}

// Get data
function getProjects() {
  initData();
  return JSON.parse(localStorage.getItem('kc_projects') || '[]');
}

function getTestimonials() {
  initData();
  return JSON.parse(localStorage.getItem('kc_testimonials') || '[]');
}

// Save data
function saveProjects(projects) {
  localStorage.setItem('kc_projects', JSON.stringify(projects));
}

function saveTestimonials(testimonials) {
  localStorage.setItem('kc_testimonials', JSON.stringify(testimonials));
}

// Category helper
function formatCategory(cat) {
  return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Run init on load
initData();
