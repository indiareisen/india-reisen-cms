import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8s6UzPqT_BpuKa8eU5jg6",
  authDomain: "india-reisen-cms.firebaseapp.com",
  projectId: "india-reisen-cms",
  storageBucket: "india-reisen-cms.appspot.com",
  messagingSenderId: "862055227943",
  appId: "1:862055227943:web:a4b82cf5df5e9f4e526ab4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const journeys = [
  {
    title: "Golden Triangle: Delhi, Agra & Jaipur",
    description: "Experience India's most iconic destinations - the Taj Mahal, Red Fort, and City Palace",
    destination: "Delhi, Agra, Jaipur",
    duration: 5,
    difficulty: "Easy",
    price: 1299,
    currency: "USD",
    groupSize: "2-8 people",
    highlights: [
      "Taj Mahal sunrise visit",
      "Agra Fort exploration",
      "Jaipur City Palace tour",
      "Hawa Mahal visit",
      "Local bazaar experience"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Delhi", description: "Meet at airport, transfer to hotel, evening city tour" },
      { day: 2, title: "Delhi Heritage", description: "Red Fort, Jama Masjid, Chandni Chowk bazaar" },
      { day: 3, title: "Delhi to Agra", description: "Morning drive to Agra, Taj Mahal sunset view" },
      { day: 4, title: "Agra Exploration", description: "Taj Mahal sunrise, Agra Fort, Itimad-ud-Daulah" },
      { day: 5, title: "Jaipur Experience", description: "Travel to Jaipur, City Palace, Hawa Mahal, local crafts" }
    ],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
    createdAt: Timestamp.now()
  },
  {
    title: "Kerala Backwaters & Spice Gardens",
    description: "Cruise through serene backwaters and explore exotic spice plantations",
    destination: "Kochi, Alleppey, Munnar",
    duration: 6,
    difficulty: "Easy",
    price: 1599,
    currency: "USD",
    groupSize: "2-6 people",
    highlights: [
      "Houseboat cruise on backwaters",
      "Spice garden tour",
      "Tea plantations of Munnar",
      "Chinese fishing nets",
      "Ayurvedic treatments"
    ],
    itinerary: [
      { day: 1, title: "Kochi Arrival", description: "Arrive in Kochi, explore Fort Kochi, Chinese fishing nets" },
      { day: 2, title: "Houseboat Cruise", description: "Full day backwater cruise, sunset dinner on houseboat" },
      { day: 3, title: "Alleppey Exploration", description: "Water sports, village tours, traditional meals" },
      { day: 4, title: "Munnar Journey", description: "Drive to Munnar, tea plantation visit" },
      { day: 5, title: "Spice Gardens", description: "Tour spice plantations, Ayurvedic massage & treatment" },
      { day: 6, title: "Departure", description: "Leisurely morning, departure or extension" }
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    createdAt: Timestamp.now()
  },
  {
    title: "Rajasthan Royal Heritage",
    description: "Explore the palaces, forts, and desert culture of Rajasthan",
    destination: "Jodhpur, Jaisalmer, Udaipur",
    duration: 7,
    difficulty: "Moderate",
    price: 1799,
    currency: "USD",
    groupSize: "2-8 people",
    highlights: [
      "Mehrangarh Fort",
      "Desert safari",
      "Golden Fort of Jaisalmer",
      "Lake Palace Udaipur",
      "Local cultural performances"
    ],
    itinerary: [
      { day: 1, title: "Jodhpur Arrival", description: "Arrive in Jodhpur, explore Blue City" },
      { day: 2, title: "Mehrangarh Fort", description: "Full day at Mehrangarh Fort and museum" },
      { day: 3, title: "Jaisalmer Journey", description: "Travel to Jaisalmer, explore Golden Fort" },
      { day: 4, title: "Desert Safari", description: "Camel safari in the Thar Desert, sunset, folk performance" },
      { day: 5, title: "Jaisalmer Havelis", description: "Explore Patwa Havelis, Sam Sand Dunes" },
      { day: 6, title: "Udaipur", description: "Travel to Udaipur, Lake Palace tour" },
      { day: 7, title: "Udaipur Culture", description: "City Palace, Jagdish Temple, boat ride on Lake Pichola" }
    ],
    image: "https://images.unsplash.com/photo-1607080591413-26ec9580ddf8?w=800",
    createdAt: Timestamp.now()
  }
];

const blogs = [
  {
    title: "10 Must-Do Experiences in India",
    excerpt: "Discover the most unforgettable experiences that define travel in India...",
    content: `India offers countless transformative experiences for travelers. From the spiritual awakening at Varanasi's ghats to the culinary delights of street food in Mumbai, here are 10 must-do experiences:

1. **Sunrise at Taj Mahal** - Witness the world's greatest monument of love at dawn
2. **Backwater Cruise in Kerala** - Float through serene waterways on traditional houseboats
3. **Desert Safari in Rajasthan** - Experience the golden Thar Desert on camelback
4. **Meditate at Rishikesh** - Find inner peace on the banks of the Ganges
5. **Tiger Safari in Ranthambore** - Spot majestic Bengal tigers in their natural habitat
6. **Spice Markets of Goa** - Explore aromatic spice markets and colonial architecture
7. **Himalayan Trek** - Trek through breathtaking mountain landscapes
8. **Ayurvedic Wellness** - Rejuvenate with traditional Ayurvedic treatments
9. **Local Market Exploration** - Immerse yourself in vibrant Indian bazaars
10. **Festival Celebration** - Experience Diwali, Holi, or other colorful festivals

Each experience tells a story of India's rich cultural tapestry.`,
    author: "India Reisen Team",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800",
    category: "Travel Tips",
    createdAt: Timestamp.now()
  },
  {
    title: "Best Time to Visit India: A Seasonal Guide",
    excerpt: "Learn when to visit different regions of India for the perfect experience...",
    content: `Choosing the right time to visit India can make all the difference to your travel experience. Here's our comprehensive seasonal guide:

**October to March - Peak Season**
Best for: Northern India, Rajasthan, Delhi
Weather: Cool, dry, and pleasant (15-30°C)
Why visit: Perfect weather for sightseeing and outdoor activities
Popular routes: Golden Triangle, Rajasthan, North Indian plains

**November to February - Best for Kerala**
Best for: Kerala backwaters, Goa beaches
Weather: Cool and dry (20-30°C)
Why visit: Ideal for houseboat cruises and beach relaxation
Activities: Water sports, ayurveda, beach festivals

**March to May - Summer**
Best for: Hill stations (Munnar, Shimla, Darjeeling)
Weather: Hot in plains, cool in mountains
Why visit: Escape the heat in mountain retreats
Activities: Trekking, tea plantation tours

**June to September - Monsoon**
Best for: Off-beat destinations, budget travelers
Weather: Wet but dramatic landscapes
Why visit: Fewer tourists, lush green scenery, lower prices
Activities: Nature walks, waterfall visits, cultural experiences

**Pro Tips:**
- Avoid July-August for major tourist destinations
- February-March is ideal for Himalayan treks
- October is perfect for most of India
- Plan ahead during Diwali (Oct-Nov) for best prices`,
    author: "Travel Columnist",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    category: "Planning",
    createdAt: Timestamp.now()
  },
  {
    title: "Responsible Travel in India: Our Commitment",
    excerpt: "How we ensure our tours benefit local communities and preserve culture...",
    content: `At India Reisen, we believe in traveling responsibly. Here's how we ensure our journeys make a positive impact:

**Supporting Local Communities**
- We employ local guides who share authentic knowledge
- Our packages directly benefit local businesses
- A portion of profits support community development projects
- We partner with local artisans and craftspeople

**Cultural Preservation**
- We respect sacred sites and local customs
- Our tours educate travelers about cultural significance
- We discourage exploitative animal tourism
- We promote sustainable cultural experiences

**Environmental Conservation**
- We minimize our carbon footprint
- Our tours avoid overtourism hotspots
- We support eco-friendly accommodations
- We practice responsible wildlife viewing

**Ethical Practices**
- Fair wages for all staff and partners
- No child labor or exploitation
- Transparent pricing and operations
- Community consent for all activities

**How You Can Help**
- Learn basic local phrases
- Respect local dress codes
- Support local businesses
- Take your trash with you
- Ask before photographing people
- Give back to communities

Travel is a powerful force for good. Let's use it responsibly.`,
    author: "Sustainability Team",
    image: "https://images.unsplash.com/photo-1504693556077-d4a8c3f52a15?w=800",
    category: "Culture",
    createdAt: Timestamp.now()
  }
];

async function addContent() {
  console.log('🔄 Adding sample journeys and blogs...\n');
  
  try {
    // Add journeys
    console.log('Adding journeys...');
    for (const journey of journeys) {
      const docRef = await addDoc(collection(db, 'journeys'), journey);
      console.log(`✅ ${journey.title}`);
    }
    
    console.log('\nAdding blog posts...');
    for (const blog of blogs) {
      const docRef = await addDoc(collection(db, 'blogs'), blog);
      console.log(`✅ ${blog.title}`);
    }
    
    console.log('\n🎉 All content added successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addContent();
