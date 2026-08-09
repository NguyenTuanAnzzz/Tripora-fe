import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-canvas-white font-sans flex justify-center py-20 px-6">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center gap-24">
        
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 max-w-[480px]">
          <div className="mb-12">
            <a href="/">
              <img src="/logo.svg" alt="Tripora" className="h-10 w-auto mb-16" />
            </a>
            <h2 className="text-heading font-light text-graphite mb-2">{title}</h2>
            {subtitle && <p className="text-body text-stone">{subtitle}</p>}
          </div>
          
          {children}
        </div>

        {/* Right side - Travel Hero Image */}
        {/* The user noted the image was too big. Adjusted height to be more proportional. */}
        <div className="hidden lg:block lg:w-1/2 w-full h-[560px] relative rounded-images overflow-hidden bg-pearl">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Travel Destination" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay for contrast as specified in DESIGN.md */}
          <div className="absolute inset-0 bg-carbon-black/20"></div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
