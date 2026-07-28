import { Course, Testimonial, FaqItem } from './types';

/* 
  -----------------------------------------------------------------------
  HOW TO UPDATE IMAGES:
  1. Upload your image to Google Drive.
  2. Right click -> Share -> Copy Link (Ensure access is "Anyone with the link").
  3. Paste the link into the 'imageUrl' field below.
  
  The code will automatically convert Google Drive links to work on the website.
  -----------------------------------------------------------------------
*/

const RAW_COURSES: Course[] = [
  {
    id: '5',
    title: 'V-Ray Photorealism',
    software: 'V-Ray',
    description: 'Make your 3D models look like real photos.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
    color: 'from-blue-600 to-indigo-500',
    students: '48k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Set up realistic sunlight and night lighting',
      'Make materials look like real wood and glass',
      'Take "photographs" of your 3D house'
    ],
    workflowImpact: 'Sell your design before it exists.'
  },
  {
    id: '1',
    title: 'AutoCAD Mastery',
    software: 'AutoCAD',
    description: 'Draw accurate 2D floor plans for houses and buildings.',
    imageUrl: 'https://drive.google.com/file/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR/view?usp=drive_link',
    color: 'from-red-500 to-red-400',
    students: '42.5k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Draw floor plans and furniture layouts easily',
      'Print your drawings to scale for construction',
      'Use shortcuts to draw 10x faster than others'
    ],
    workflowImpact: 'Create professional blueprints that contractors can actually build from.'
  },
  {
    id: '2',
    title: 'BIM with Revit',
    software: 'Revit',
    description: 'Build smart 3D buildings on your computer.',
    imageUrl: 'https://drive.google.com/file/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt/view?usp=drive_link',
    color: 'from-red-600 to-red-500',
    students: '38k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Create 3D buildings with automatic floor plans',
      'Calculate how many bricks and windows you need',
      'Work on big projects with other team members'
    ],
    workflowImpact: 'Save days of work. The software does it for you.'
  },
  {
    id: '3',
    title: 'SketchUp Pro',
    software: 'SketchUp',
    description: 'The easiest way to design 3D houses.',
    imageUrl: 'https://drive.google.com/file/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo/view?usp=drive_link',
    color: 'from-blue-500 to-cyan-400',
    students: '55k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Pull simple shapes into 3D houses instantly',
      'Add furniture, colors, and textures easily',
      'Create 3D views to show your clients'
    ],
    workflowImpact: 'Model their dream kitchen or bedroom in just minutes.'
  },
  {
    id: '4',
    title: '3ds Max Advanced',
    software: '3ds Max',
    description: 'Design fancy furniture and luxury interiors.',
    imageUrl: 'https://drive.google.com/file/d/1DgmIvkeC2dxGpRpzbIthHQsSdlCty2Xg/view?usp=drive_link',
    color: 'from-cyan-600 to-blue-500',
    students: '22k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Model complex shapes like twisted towers',
      'Create soft fabrics, pillows, and blankets',
      'Design high-end luxury interior spaces'
    ],
    workflowImpact: 'Charge more for premium, high-detail luxury designs.'
  },
  {
    id: '6',
    title: 'Lumion Cinematic',
    software: 'Lumion',
    description: 'Make movies of your architecture.',
    imageUrl: 'https://drive.google.com/file/d/1XW2DDHVa1Qc15NcZ3wUKMFRT7LkyZMCt/view?usp=drive_link',
    color: 'from-teal-500 to-emerald-400',
    students: '31k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Add grass, trees, and water instantly',
      'Make people walk and cars drive in your scene',
      'Create a video tour of the house'
    ],
    workflowImpact: 'A 1-minute video sells a house better than 100 drawings.'
  },
  {
    id: '7',
    title: 'D5 Render Realtime',
    software: 'D5 Render',
    description: 'See the final result instantly while you work.',
    imageUrl: 'https://drive.google.com/file/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr/view?usp=drive_link',
    color: 'from-purple-500 to-pink-500',
    students: '19k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Real-time lighting (see it as you work)',
      'Drag and drop thousands of free furniture items',
      'Make 4K images in seconds'
    ],
    workflowImpact: 'Change the floor material and see how it looks instantly.'
  },
  {
    id: '8',
    title: 'Enscape VR',
    software: 'Enscape',
    description: 'Walk inside your design using VR.',
    imageUrl: 'https://drive.google.com/file/d/1SmezP6LwT3yo9aE3oivpGkqS-xycSOyx/view?usp=drive_link',
    color: 'from-blue-500 to-indigo-600',
    students: '25k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'One-click to start walking inside your model',
      'Send a web link so clients can walk around too',
      'Use Virtual Reality (VR) to impress'
    ],
    workflowImpact: 'Spot mistakes before construction starts.'
  },
  {
    id: '9',
    title: 'AI Architecture',
    software: 'Midjourney',
    description: 'Get 100 design ideas in 1 minute with AI.',
    imageUrl: 'https://drive.google.com/file/d/1s-HzZVKpc9F92mLW2gMOPk0kVrKAqUIS/view?usp=drive_link',
    color: 'from-fuchsia-600 to-purple-600',
    students: '60k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'How to write text to get amazing house images',
      'Create mood boards for clients instantly',
      'Combine different styles (e.g., Classic + Modern)'
    ],
    workflowImpact: 'Never run out of ideas.'
  },
  {
    id: '10',
    title: 'Generative Design',
    software: 'Stable Diffusion',
    description: 'Turn a rough sketch into a realistic building using AI.',
    imageUrl: 'https://drive.google.com/file/d/1xSzSjuL4imlbXwEYMwKw_vhuueDcFtHm/view?usp=drive_link',
    color: 'from-indigo-500 to-purple-500',
    students: '15k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Turn hand sketches into realistic renders',
      'Change specific parts of an image with AI',
      'Install AI tools on your own computer'
    ],
    workflowImpact: 'Show a client a realistic picture during the first meeting.'
  },
  {
    id: '11',
    title: 'Unreal Engine 5',
    software: 'Unreal Engine',
    description: 'Make your design look like a high-end video game.',
    imageUrl: 'https://drive.google.com/file/d/14EfKoC7BfxXmYxd6t6qIE470yQaX0toW/view?usp=drive_link',
    color: 'from-gray-600 to-gray-400',
    students: '18k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Create interactive lights and doors',
      'Make realistic fire, water, and wind',
      'Package your design as a playable game'
    ],
    workflowImpact: 'Give clients a controller and let them play inside their future home.'
  },
  {
    id: '12',
    title: 'Post Production',
    software: 'Photoshop',
    description: 'Add real sky, birds, and people to your renders.',
    imageUrl: 'https://drive.google.com/file/d/1FkzIhdu7K5JeRFq7BM1wGV5MND_fLMKe/view?usp=drive_link',
    color: 'from-blue-800 to-blue-600',
    students: '72k',
    price: 7500,
    originalPrice: 37000,
    learningPoints: [
      'Fix lighting and colors easily',
      'Add realistic people and trees',
      'Make your portfolio look professional'
    ],
    workflowImpact: 'Make average renders look like award-winning photography.'
  }
];

// --- AUTO-FIX LOGIC ---
export const COURSES = RAW_COURSES.map(course => {
  let url = course.imageUrl;
  if (url.includes('drive.google.com') && url.includes('/file/d/')) {
    const idMatch = url.match(/\/d\/([^/]+)/);
    if (idMatch && idMatch[1]) {
      url = `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return { ...course, imageUrl: url };
});

export const COURSE_CATEGORIES = [
  {
    title: "Planning",
    ids: ['1', '2']
  },
  {
    title: "Designing",
    ids: ['3', '4', '12']
  },
  {
    title: "Rendering",
    ids: ['5', '6', '7', '8']
  },
  {
    title: "AI & MORE",
    ids: ['9', '10', '11']
  }
];

export const BUNDLE_PRICE = 37000;
export const BUNDLE_ORIGINAL_PRICE = 444000; // 12 × 37,000

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Chinedu Okafor',
    role: 'Senior Architect',
    location: 'Lagos, Nigeria',
    content: 'The Revit workflow section alone saved our firm countless hours. Undeniable value for Nigerian projects.'
  },
  {
    name: 'Amara Eze',
    role: '3D Visualizer',
    location: 'Abuja, Nigeria',
    content: 'V-Ray + 3ds Max combo is a game-changer. My clients in the real estate sector are blown away by the realism.'
  },
  {
    name: 'Ngozi Adeyemi',
    role: 'Freelance Designer',
    location: 'Ibadan, Nigeria',
    content: 'Built my entire freelance portfolio using these courses. Now I charge 3x what I used to for luxury interiors.'
  },
  {
    name: 'Emeka Nwosu',
    role: 'Architecture Student',
    location: 'Port Harcourt, Nigeria',
    content: 'Landed my dream internship at a top firm because I was the only one who knew Enscape VR and AI Design.'
  },
  {
    name: 'Aisha Mohammed',
    role: 'Interior Designer',
    location: 'Kano, Nigeria',
    content: 'I can now present 10 variations to clients in the time it used to take for one. Best investment I ever made.'
  },
  {
    name: 'Tunde Bakare',
    role: 'Landscape Architect',
    location: 'Enugu, Nigeria',
    content: 'D5 Render lets me make changes during client meetings. Blows them away every time. Highly recommended.'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I access the courses after buying?",
    answer: "You'll receive instant access via email with download links and login credentials within 5 minutes of payment."
  },
  {
    question: "Can I buy individual courses or only the bundle?",
    answer: "Both options are available! Each course is available individually, or get all 12 in the bundle for the best deal — saving over 60%. The bundle is by far the best value."
  },
  {
    question: "Are project files included?",
    answer: "Yes, all 3D models, textures, and source files used in tutorials are included for download."
  },
  {
    question: "Do I get a certificate?",
    answer: "Yes, industry-recognized certificates are provided upon course completion."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, 100% money-back guarantee within 7 days if you're not satisfied. No questions asked."
  }
];