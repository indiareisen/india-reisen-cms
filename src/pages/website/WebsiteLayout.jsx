import Header from './Header';
import Footer from './Footer';

const WebsiteLayout = ({ children, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header setActiveTab={setActiveTab} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
