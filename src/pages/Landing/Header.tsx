export default function Header() {
  return (
    <div className="">
      <header 
        className=" h-[87px] w-full flex items-center justify-between px-6 shadow-md z-50"
        style={{ backgroundColor: '#FAFEFF' }}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-8 bg-gray-200 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center text-xs text-gray-500 font-medium">
            LOGO
          </div>
          <div className="text-3xl font-bold text-gray-800 tracking-tight">
            Premail
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-9">
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
          >
            Github
          </a>
          <a 
            href="#" 
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
          >
            Tech Stack
          </a>
        </nav>
        
        {/* Auth Section */}
        <div className="flex items-center">
          <a 
            href="#" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200"
          >
            Sign In
          </a>
        </div>
      </header>
    </div>
  );
}