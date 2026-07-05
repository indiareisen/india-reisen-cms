import { collection, addDoc, doc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '../src/services/firebaseService.js'

const journeys = [
  {
    title: 'Golden Triangle',
    destination: 'Delhi, Agra, Jaipur',
    description: 'Experience the iconic trinity of Indian heritage with visits to the Taj Mahal, Red Fort, and City Palace.',
    duration: 5,
    difficulty: 'Easy',
    price: 1299,
    createdAt: Timestamp.now()
  },
  {
    title: 'Kerala Backwaters',
    destination: 'Kochi, Alleppey, Kumarakom',
    description: 'Navigate through serene backwaters on traditional houseboats surrounded by lush coconut palms.',
    duration: 6,
    difficulty: 'Easy',
    price: 1599,
    createdAt: Timestamp.now()
  },
  {
    title: 'Rajasthan Royal Heritage',
    destination: 'Jaipur, Jodhpur, Jaisalmer',
    description: 'Discover the grandeur of Rajasthan with desert safaris, majestic forts, and vibrant culture.',
    duration: 7,
    difficulty: 'Moderate',
    price: 1799,
    createdAt: Timestamp.now()
  },
  {
    title: 'Himalayan Trekking',
    destination: 'Himachal Pradesh, Uttarakhand',
    description: 'Trek through pristine mountain landscapes with breathtaking views and stay in mountain villages.',
    duration: 8,
    difficulty: 'Challenging',
    price: 2199,
    createdAt: Timestamp.now()
  },
  {
    title: 'Nepal Adventure',
    destination: 'Kathmandu, Pokhara, Nagarkot',
    description: 'Explore the mystical temples, serene lakes, and mountain views of Nepal.',
    duration: 7,
    difficulty: 'Moderate',
    price: 1499,
    createdAt: Timestamp.now()
  },
  {
    title: 'Bhutan Explorer',
    destination: 'Thimphu, Paro, Punakha',
    description: 'Discover the kingdom of Bhutan with its pristine nature, unique culture, and spiritual heritage.',
    duration: 6,
    difficulty: 'Moderate',
    price: 2499,
    createdAt: Timestamp.now()
  },
  {
    title: 'Goa Paradise',
    destination: 'North Goa, South Goa',
    description: 'Relax on tropical beaches, explore Portuguese heritage, and experience vibrant nightlife.',
    duration: 5,
    difficulty: 'Easy',
    price: 999,
    createdAt: Timestamp.now()
  },
  {
    title: 'Tibet High Altitude',
    destination: 'Lhasa, Shigatse, Mount Everest',
    description: 'Journey to the roof of the world with stunning Himalayan vistas and sacred monasteries.',
    duration: 10,
    difficulty: 'Challenging',
    price: 3299,
    createdAt: Timestamp.now()
  },
  {
    title: 'South India Cultural Tour',
    destination: 'Chennai, Madurai, Kanyakumari',
    description: 'Experience the ancient temples, spice markets, and tropical beaches of South India.',
    duration: 8,
    difficulty: 'Easy',
    price: 1699,
    createdAt: Timestamp.now()
  },
  {
    title: 'East India Discovery',
    destination: 'Kolkata, Darjeeling, Sikkim',
    description: 'Explore the tea gardens, mountain views, and rich cultural heritage of East India.',
    duration: 7,
    difficulty: 'Moderate',
    price: 1599,
    createdAt: Timestamp.now()
  }
]

const blogs = [
  {
    title: '10 Must-Do Experiences in India',
    author: 'Rajesh Kumar',
    category: 'Travel Tips',
    excerpt: 'Discover the unforgettable experiences that define India - from spiritual journeys to culinary adventures.',
    content: 'India offers countless unforgettable experiences. Witness the sunrise at Varanasi, ride a camel in Rajasthan, trek through the Himalayas, enjoy a backwater houseboat in Kerala, visit the Taj Mahal at sunrise, experience a traditional Ayurvedic massage, learn to cook Indian cuisine, explore ancient temples, watch a classical dance performance, and swim in the Arabian Sea. Each experience tells a unique story of India.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Best Time to Visit India',
    author: 'Priya Sharma',
    category: 'Planning',
    excerpt: 'Plan your Indian journey perfectly by understanding the seasons and weather patterns.',
    content: 'The best time to visit India depends on which region you want to explore. October to March is ideal for most of India with pleasant weather. North India: Winter (Nov-Feb) is perfect for the Himalayas and Golden Triangle. South India: Can be visited year-round. Kerala: Monsoon (Jun-Aug) is magical but wet. Mountain areas: Summer (Apr-Jun) is best for trekking. Always check local festivals and weather patterns before planning your trip.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Responsible Travel in India',
    author: 'Amit Patel',
    category: 'Guides',
    excerpt: 'Travel responsibly and ensure your journey benefits local communities and preserves India\'s heritage.',
    content: 'Responsible travel means respecting local culture, supporting small businesses, minimizing environmental impact, and contributing to local economies. Stay in locally-owned accommodations, eat at family-run restaurants, buy from local artisans, learn basic local language phrases, dress respectfully, avoid touching sacred objects, and never feed wildlife. By traveling responsibly, you create positive connections with communities and help preserve India\'s natural and cultural heritage.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Indian Cuisine: A Journey for Your Taste Buds',
    author: 'Anjali Verma',
    category: 'Travel Tips',
    excerpt: 'Explore the diverse and flavors of Indian cooking across regions.',
    content: 'Indian cuisine is incredibly diverse with each region offering unique flavors. North India: Rich curries and breads like butter chicken and naan. South India: Spiced rice dishes like dosa and sambar. West India: Vegetarian delicacies and fresh coconut-based curries. East India: Fish-based curries and delicate sweets. Don\'t miss street food like samosas, chaat, and pani puri. Always try local specialties and eat where locals eat for authentic flavors.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Trekking in the Indian Himalayas',
    author: 'Vikram Singh',
    category: 'Guides',
    excerpt: 'Complete guide to trekking adventures in the majestic Himalayas.',
    content: 'The Indian Himalayas offer world-class trekking experiences. Popular trails include Roopkund Trek (challenging), Kedarkantha Trek (moderate), and Chopta Trek (easy). Best season: May-June and September-October. Essential preparation: proper gear, physical fitness, acclimatization. Safety tips: trek with experienced guides, carry water and snacks, inform locals of your route. The rewards are stunning alpine meadows, pristine forests, and life-changing mountain experiences.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Palace Hotels of India',
    author: 'Deepak Sharma',
    category: 'Travel Tips',
    excerpt: 'Stay in royal luxury at converted palaces across India.',
    content: 'Experience royal grandeur by staying in heritage palace hotels. These magnificent properties offer a glimpse into India\'s regal past with modern comforts. Notable palaces: City Palace in Jaipur, Lake Palace in Udaipur, Oberoi Rajvilas, and many more. Each palace tells stories of maharajas and ancient kingdoms. Wake up to stunning architecture, enjoy traditional hospitality, and dine like royalty. These experiences create unforgettable memories and support heritage conservation.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Wildlife Sanctuaries in India',
    author: 'Neha Gupta',
    category: 'Guides',
    excerpt: 'Discover India\'s incredible wildlife and pristine national parks.',
    content: 'India is home to diverse wildlife and protected sanctuaries. Tiger reserves like Ranthambore and Bandhavgarh offer safari experiences. Kaziranga in Assam has the largest rhino population. Periyar in Kerala offers boating safaris. Sundarbans is home to Bengal tigers. Birdwatching hotspots include Keoladeo and Bharatpur. Best time: October to March. Always book through authorized operators and follow wildlife conservation guidelines.',
    createdAt: Timestamp.now()
  },
  {
    title: 'Festival Calendar: Celebrating India',
    author: 'Sunita Kumar',
    category: 'Planning',
    excerpt: 'Experience the vibrant festivals that define Indian culture and spirituality.',
    content: 'India\'s calendar is filled with colorful festivals. Diwali (Oct-Nov): Festival of lights with fireworks and sweets. Holi (Mar-Apr): Festival of colors and joy. Durga Puja (Sep-Oct): Celebrated with grandeur in Bengal. Onam (Aug-Sep): Kerala\'s harvest festival. Pongal (Jan): Tamil harvest festival. Navratri (Sep-Oct): Nine-day festival of dance and culture. Attending festivals offers authentic cultural experiences and warm hospitality from locals.',
    createdAt: Timestamp.now()
  }
]

const teamMembers = [
  {
    name: 'Rajesh Kumar',
    role: 'Lead Travel Consultant',
    email: 'rajesh@indiareisen.com',
    expertise: ['Himalayan Treks', 'Northern India', 'Cultural Tours'],
    bio: 'With 15 years of experience in travel planning, Rajesh specializes in curating authentic experiences in the Himalayas and North India.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Priya Sharma',
    role: 'Kerala Specialist',
    email: 'priya@indiareisen.com',
    expertise: ['Backwater Tours', 'Beach Holidays', 'Ayurveda'],
    bio: 'Priya is passionate about Kerala\'s natural beauty and traditional wellness practices. She creates magical backwater experiences.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Amit Patel',
    role: 'Trekking Guide',
    email: 'amit@indiareisen.com',
    expertise: ['Mountain Trekking', 'Adventure Sports', 'Wildlife'],
    bio: 'Amit is a certified mountain guide with expertise in challenging treks across the Indian Himalayas.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Anjali Verma',
    role: 'Cultural Tour Guide',
    email: 'anjali@indiareisen.com',
    expertise: ['Heritage Sites', 'Cultural Immersion', 'Local Cuisine'],
    bio: 'Anjali brings cultural heritage alive with her deep knowledge of temples, monuments, and local traditions.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Vikram Singh',
    role: 'Operations Manager',
    email: 'vikram@indiareisen.com',
    expertise: ['Logistics', 'Route Planning', 'Risk Management'],
    bio: 'Vikram ensures every journey runs smoothly with meticulous planning and attention to detail.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Deepak Sharma',
    role: 'Luxury Travel Consultant',
    email: 'deepak@indiareisen.com',
    expertise: ['Palace Hotels', 'Private Tours', 'Luxury Experiences'],
    bio: 'Deepak specializes in curating exclusive luxury experiences and heritage palace stays.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Neha Gupta',
    role: 'Wildlife & Nature Guide',
    email: 'neha@indiareisen.com',
    expertise: ['Wildlife Safari', 'Birdwatching', 'Conservation'],
    bio: 'Neha is a passionate wildlife enthusiast who creates unforgettable safari and nature experiences.',
    createdAt: Timestamp.now()
  },
  {
    name: 'Sunita Kumar',
    role: 'Festivals & Events Coordinator',
    email: 'sunita@indiareisen.com',
    expertise: ['Festival Tours', 'Event Planning', 'Cultural Experiences'],
    bio: 'Sunita specializes in creating magical festival experiences and cultural celebrations.',
    createdAt: Timestamp.now()
  }
]

const settings = {
  siteName: 'India Reisen',
  tagline: 'Explore Experience Enchant',
  description: 'Every journey is more than just a trip—it\'s an immersive experience into the rich heritage and timeless charm of India.',
  email: 'team@indiareisen.com',
  phone: '+91 98108 27785',
  address: 'Ghaziabad, Uttar Pradesh, India',
  primaryColor: '#d1356f',
  secondaryColor: '#D4A574',
  facebook: 'indiareisenofficial',
  instagram: '@indiareisen',
  twitter: '@IndiaReisen',
  youtube: '@indiareisen',
  aboutText: 'India Reisen is a luxury bespoke travel company dedicated to crafting unforgettable journeys across India, Nepal, Bhutan, Tibet, and Sri Lanka. With 50+ local partners and 15+ destinations, we create personalized itineraries that connect travelers with authentic cultures, breathtaking landscapes, and spiritual experiences.'
}

async function addContent() {
  try {
    console.log('Adding journeys...')
    for (const journey of journeys) {
      await addDoc(collection(db, 'journeys'), journey)
    }
    console.log('✓ Journeys added')

    console.log('Adding blogs...')
    for (const blog of blogs) {
      await addDoc(collection(db, 'blogs'), blog)
    }
    console.log('✓ Blogs added')

    console.log('Adding team members...')
    for (const member of teamMembers) {
      await addDoc(collection(db, 'team'), member)
    }
    console.log('✓ Team members added')

    console.log('Updating settings...')
    await setDoc(doc(db, 'settings', 'general'), settings)
    console.log('✓ Settings updated')

    console.log('\n✅ All content added successfully!')
  } catch (error) {
    console.error('Error:', error)
  }
}

addContent()
