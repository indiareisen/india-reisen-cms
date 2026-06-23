import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import JourneysPage from './pages/JourneysPage';
import ContactPage from './pages/ContactPage';

const WebsiteLayout = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Homepage />;
      case 'journeys': return <JourneysPage />;
      case 'contact': return <ContactPage />;
      default: return <Homepage />;
    }
  };

  return (
    <div>
      <Header setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
