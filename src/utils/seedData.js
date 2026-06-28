import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const seedSampleData = async () => {
  const journeys = [
    {
      title: 'Golden Triangle',
      description: 'Experience the iconic triangle of Delhi, Agra, and Jaipur. Visit the Taj Mahal, explore ancient monuments, and immerse yourself in vibrant Indian culture.',
      price: 45000,
      duration: '5 days',
      location: 'Delhi, Agra, Jaipur',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657db1d4e?w=800&h=600&fit=crop',
      highlights: ['Taj Mahal', 'Red Fort', 'City Palace', 'Hawa Mahal'],
      createdAt: serverTimestamp()
    },
    {
      title: 'Kerala Backwaters',
      description: 'Cruise through serene backwaters, stay in traditional houseboats, and explore pristine beaches. A truly unique experience in South India.',
      price: 55000,
      duration: '6 days',
      location: 'Kochi, Alleppey, Kumarakom',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      highlights: ['Houseboat Cruise', 'Backwater Villages', 'Chinese Fishing Nets', 'Spice Markets'],
      createdAt: serverTimestamp()
    },
    {
      title: 'Rajasthan Desert Adventure',
      description: 'Discover the golden deserts of Rajasthan. Camel safaris, palace tours, and sunset dunes await in this magical land of maharajas.',
      price: 52000,
      duration: '7 days',
      location: 'Jaipur, Jodhpur, Jaisalmer',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      highlights: ['Mehrangarh Fort', 'Jaisalmer Fort', 'Sam Sand Dunes', 'Royal Palace'],
      createdAt: serverTimestamp()
    },
    {
      title: 'Himalayan Escape',
      description: 'Trek through misty mountains, visit serene temples, and experience the tranquility of the Himalayas. Perfect for nature lovers.',
      price: 48000,
      duration: '8 days',
      location: 'Shimla, Manali, Dharamshala',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      highlights: ['Mountain Trekking', 'Buddhist Monasteries', 'Rohtang Pass', 'Local Villages'],
      createdAt: serverTimestamp()
    }
  ];

  const blogs = [
    {
      title: 'Top 10 Travel Tips for India',
      author: 'India Reisen Team',
      content: 'Traveling to India for the first time? Here are our top 10 essential tips to make your journey smooth and unforgettable. From packing tips to cultural etiquette, we cover everything you need to know. Learn about the best time to visit, how to navigate public transport, and where to find authentic local experiences.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      excerpt: 'Essential tips for your first India trip',
      createdAt: serverTimestamp()
    },
    {
      title: 'Why Taj Mahal is a Must-Visit',
      author: 'Travel Blogger',
      content: 'The Taj Mahal is more than just a monument—it\'s a symbol of eternal love and architectural brilliance. Built by Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this UNESCO World Heritage site attracts millions of visitors each year. Discover its fascinating history, best times to visit, and insider tips for the perfect experience.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657db1d4e?w=800&h=600&fit=crop',
      excerpt: 'Discover the magic of the Taj Mahal',
      createdAt: serverTimestamp()
    },
    {
      title: 'Kerala: God\'s Own Country',
      author: 'Adventure Seeker',
      content: 'Kerala, located in South India, is truly God\'s own country. With its lush green backwaters, pristine beaches, and warm hospitality, Kerala offers a perfect blend of natural beauty and cultural richness. From houseboat cruises to spice plantation visits, explore all the reasons why Kerala should be on your travel bucket list.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      excerpt: 'Explore the beauty of Kerala backwaters',
      createdAt: serverTimestamp()
    },
    {
      title: 'Rajasthan: Land of Kings and Colors',
      author: 'Culture Enthusiast',
      content: 'Rajasthan, the land of kings, is a treasure trove of history, culture, and vibrant traditions. From the magnificent forts and palaces to the colorful markets and desert landscapes, Rajasthan offers an unforgettable experience. Learn about the rich heritage, local crafts, traditional clothing, and the famous hospitality of the Rajasthani people.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      excerpt: 'Experience the royal grandeur of Rajasthan',
      createdAt: serverTimestamp()
    }
  ];

  try {
    console.log('Adding sample journeys...');
    for (const journey of journeys) {
      await addDoc(collection(db, 'itineraries'), journey);
    }
    console.log('✅ Journeys added successfully');

    console.log('Adding sample blogs...');
    for (const blog of blogs) {
      await addDoc(collection(db, 'blogs'), blog);
    }
    console.log('✅ Blogs added successfully');

    return { success: true, message: 'Sample data added!' };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error: error.message };
  }
};
