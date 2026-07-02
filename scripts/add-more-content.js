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

const reviews = [
  {
    name: "Sarah Johnson",
    country: "USA",
    rating: 5,
    title: "The Best Trip of My Life!",
    content: "India Reisen made our Golden Triangle tour absolutely unforgettable. The guides were knowledgeable, accommodations were luxurious, and every detail was perfectly arranged. Highly recommended!",
    journey: "Golden Triangle",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    createdAt: Timestamp.now()
  },
  {
    name: "Michael Chen",
    country: "Singapore",
    rating: 5,
    title: "Authentic Kerala Experience",
    content: "The Kerala backwater cruise was magical. The houseboat, the food, the spice gardens - everything was perfect. India Reisen truly understands how to create authentic, luxurious experiences.",
    journey: "Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    createdAt: Timestamp.now()
  },
  {
    name: "Emma Wilson",
    country: "UK",
    rating: 5,
    title: "Desert Magic in Rajasthan",
    content: "Our Rajasthan tour exceeded all expectations. The desert safari was breathtaking, and the cultural experiences were deeply meaningful. The team handled everything with care and professionalism.",
    journey: "Rajasthan Royal Heritage",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    createdAt: Timestamp.now()
  },
  {
    name: "David Martinez",
    country: "Spain",
    rating: 5,
    title: "Professional and Personalized",
    content: "What impressed me most was how India Reisen personalized our itinerary. They listened to our preferences and adapted everything accordingly. True luxury travel!",
    journey: "Custom Journey",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    createdAt: Timestamp.now()
  },
  {
    name: "Lisa Anderson",
    country: "Australia",
    rating: 5,
    title: "Safe, Comfortable, Unforgettable",
    content: "Traveling in India can be overwhelming, but India Reisen made it feel safe and comfortable. The guides were fantastic, the hotels were beautiful, and the experiences were authentic.",
    journey: "Kerala & Goa Combined",
    image: "https://images.unsplash.com/photo-1516534775068-bb6a4e2c6768?w=200",
    createdAt: Timestamp.now()
  }
];

const teamMembers = [
  {
    name: "Rajesh Kumar",
    role: "Lead Travel Consultant",
    bio: "With 15 years of experience in luxury travel, Rajesh specializes in crafting bespoke itineraries for discerning travelers.",
    expertise: ["Rajasthan", "North India", "Customization"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    email: "rajesh@indiareisen.com",
    createdAt: Timestamp.now()
  },
  {
    name: "Priya Sharma",
    role: "Kerala Specialist",
    bio: "Priya has deep connections throughout Kerala and specializes in creating authentic backwater and cultural experiences.",
    expertise: ["Kerala", "Ayurveda", "Local Culture"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    email: "priya@indiareisen.com",
    createdAt: Timestamp.now()
  },
  {
    name: "Amit Patel",
    role: "Adventure & Trekking Guide",
    bio: "Amit leads our Himalayan treks and adventure tours. His passion for mountains is contagious and his safety record is impeccable.",
    expertise: ["Himalayan Treks", "Adventure", "Photography"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    email: "amit@indiareisen.com",
    createdAt: Timestamp.now()
  },
  {
    name: "Anjali Verma",
    role: "Cultural Experience Manager",
    bio: "Anjali curates meaningful cultural experiences and has partnerships with communities across India.",
    expertise: ["Cultural Tours", "Festivals", "Heritage"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    email: "anjali@indiareisen.com",
    createdAt: Timestamp.now()
  },
  {
    name: "Vikram Singh",
    role: "Logistics & Operations",
    bio: "Vikram ensures every journey runs smoothly. His attention to detail and problem-solving skills are legendary.",
    expertise: ["Operations", "Transportation", "Coordination"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    email: "vikram@indiareisen.com",
    createdAt: Timestamp.now()
  }
];

const moreJourneys = [
  {
    title: "Himalayan Trekking Adventure",
    description: "Trek through pristine Himalayan landscapes and experience mountain villages",
    destination: "Himachal Pradesh, Uttarakhand",
    duration: 8,
    difficulty: "Challenging",
    price: 2199,
    currency: "USD",
    groupSize: "2-6 people",
    highlights: [
      "High altitude trekking",
      "Mountain village homestays",
      "Alpine meadows",
      "Snow-capped peaks",
      "Mountain photography"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Shimla", description: "Arrive in Shimla, acclimatization walk" },
      { day: 2, title: "Trek Start", description: "Begin trek through pine forests" },
      { day: 3, title: "Alpine Meadows", description: "Trek through beautiful meadows, 3800m altitude" },
      { day: 4, title: "High Altitude Camp", description: "Rest day at alpine camp" },
      { day: 5, title: "Peak Summit", description: "Summit day with panoramic views" },
      { day: 6, title: "Descent", description: "Descend to lower altitude" },
      { day: 7, title: "Village Stay", description: "Overnight in mountain village" },
      { day: 8, title: "Return", description: "Return to Shimla, departure" }
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    createdAt: Timestamp.now()
  },
  {
    title: "Nepal: Kathmandu to Pokhara",
    description: "Experience the spiritual heart of Nepal with temples, mountains, and vibrant culture",
    destination: "Kathmandu, Pokhara, Chitwan",
    duration: 7,
    difficulty: "Easy",
    price: 1499,
    currency: "USD",
    groupSize: "2-8 people",
    highlights: [
      "Boudhanath Stupa",
      "Pokhara Lake",
      "Annapurna Views",
      "Chitwan Safari",
      "Mountain flights"
    ],
    itinerary: [
      { day: 1, title: "Kathmandu Arrival", description: "Explore Kathmandu Durbar Square" },
      { day: 2, title: "Sacred Sites", description: "Boudhanath Stupa, Pashupatinath Temple" },
      { day: 3, title: "Pokhara Journey", description: "Travel to Pokhara, lakeside relaxation" },
      { day: 4, title: "Pokhara Exploration", description: "Sarangkot sunrise, boat on Fewa Lake" },
      { day: 5, title: "Chitwan National Park", description: "Jungle safari, river activities" },
      { day: 6, title: "Wildlife Adventure", description: "Elephant rides, bird watching" },
      { day: 7, title: "Return & Departure", description: "Return to Kathmandu, departure" }
    ],
    image: "https://images.unsplash.com/photo-1512100356356-de1d84290e07?w=800",
    createdAt: Timestamp.now()
  },
  {
    title: "Bhutan: Kingdom of Happiness",
    description: "Discover the world's only carbon-negative country with pristine monasteries and valleys",
    destination: "Thimphu, Paro, Punakha",
    duration: 6,
    difficulty: "Moderate",
    price: 2499,
    currency: "USD",
    groupSize: "2-6 people",
    highlights: [
      "Tiger's Nest Monastery",
      "Punakha Dzong",
      "Bhutanese culture",
      "Mountain views",
      "Pristine nature"
    ],
    itinerary: [
      { day: 1, title: "Paro Arrival", description: "Arrive in Paro, explore Paro Dzong" },
      { day: 2, title: "Tiger's Nest", description: "Hike to iconic Tiger's Nest Monastery" },
      { day: 3, title: "Thimphu", description: "Visit capital city, Buddha Point, local markets" },
      { day: 4, title: "Punakha", description: "Travel to Punakha, explore Punakha Dzong" },
      { day: 5, title: "Valley Experience", description: "Rice fields, farmhouse visits, traditional archery" },
      { day: 6, title: "Departure", description: "Return to Paro, international departure" }
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    createdAt: Timestamp.now()
  },
  {
    title: "Goa: Beach & Culture Escape",
    description: "Relax on pristine beaches while exploring Portuguese colonial heritage",
    destination: "Goa",
    duration: 5,
    difficulty: "Easy",
    price: 999,
    currency: "USD",
    groupSize: "2-8 people",
    highlights: [
      "Beach resorts",
      "Portuguese architecture",
      "Spice plantations",
      "Water sports",
      "Nightlife & festivals"
    ],
    itinerary: [
      { day: 1, title: "Goa Arrival", description: "Arrive in Goa, beach orientation" },
      { day: 2, title: "North Goa", description: "Explore Panaji, Old Goa churches, Spice Garden" },
      { day: 3, title: "Beach Day", description: "Relax at beach, water sports, sunset" },
      { day: 4, title: "South Goa", description: "Visit Fort Aguada, Palolem Beach" },
      { day: 5, title: "Departure", description: "Last-minute shopping, departure" }
    ],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    createdAt: Timestamp.now()
  }
];

async function addContent() {
  console.log('🔄 Adding reviews, team members, and more journeys...\n');
  
  try {
    // Add reviews
    console.log('Adding reviews...');
    for (const review of reviews) {
      await addDoc(collection(db, 'reviews'), review);
      console.log(`✅ Review from ${review.name}`);
    }
    
    // Add team members
    console.log('\nAdding team members...');
    for (const member of teamMembers) {
      await addDoc(collection(db, 'team'), member);
      console.log(`✅ ${member.name} - ${member.role}`);
    }
    
    // Add more journeys
    console.log('\nAdding more journeys...');
    for (const journey of moreJourneys) {
      await addDoc(collection(db, 'journeys'), journey);
      console.log(`✅ ${journey.title}`);
    }
    
    console.log('\n🎉 All additional content added successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addContent();
