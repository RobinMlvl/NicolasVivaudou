
export default function Hero() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Video */}
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/DIAPOSLIM.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay for text readability - much lighter */}
      <div className="absolute inset-0 bg-black/10 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Main Hero Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          {/* You can add hero text content here if needed */}
        </div>
      </div>
    </div>
  );
}