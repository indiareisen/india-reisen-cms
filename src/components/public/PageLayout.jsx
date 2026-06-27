const PageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
