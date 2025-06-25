export default function Header() {
  const handleSignin = () => {
    console.log("signed  in")
  }

  const handleLink = (link: string) => {
    console.log(link);
    if (link === 'github') window.open('https://www.github.com', '_blank')
  }

  return (
    <div 
      className="w-full flex items-center shadow-sm justify-center"
      style={{ backgroundColor: '#FAFEFF' }}
    >
      <header
        className="h-[80px] w-5/6 flex items-center justify-between px-6 z-50"
      >
        {/* Logo Section */}
        <button className="bg-transparent border-none p-0 m-0 cursor-pointer"  onClick={() => {window.location.href = 'https://www.youtube.com'}}>
          <div className="flex items-center gap-1 w-60">
            <img
              src="/premail.png"
              alt="Premail"
              className="w-9 h-8 rounded-md"
            />
            <div className="tracking-tighter text-3xl font-bold text-blue-700 tracking-tight">
              Pre<span className="text-blue-400 font-instrument">mail</span>
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-9">
          <button
            onClick={() => handleLink('github')}
            className="font-inter text-blue-600 hover:text-blue-400 font-medium text-base font-semibold transition-colors duration-200"
          >
            Github
          </button>
          <button
            onClick={() => handleLink('techstack')}
            className="font-inter text-blue-600 hover:text-blue-400 font-medium text-base font-semibold transition-colors duration-200"
          >
            Tech Stack
          </button>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center justify-end w-60">
          <button
            onClick={handleSignin}
            className="bg-transparent border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:border-white hover:text-white px-6 py-3 rounded-3xl font-medium text-base transition-all duration-200">
            Sign In
          </button>
        </div>
      </header>
    </div>
  );
}