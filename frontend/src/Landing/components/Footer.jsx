const Footer = () => {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
        
        {/* Left: Copyright */}
        <div className="text-sm text-center md:text-left">
          © 2025 Voat Staffing. All rights reserved.
        </div>

        {/* Center: Links */}
        <div className="text-sm space-x-4 text-center">
          <a href="#" className="hover:underline">Terms of Service</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>

        {/* Right: Social Media */}
        <div className="text-sm text-center md:text-right space-x-2">
          <span className="text-gray-400">Follow us on:</span>
          <a href="#" className="text-blue-400 hover:underline">Facebook</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="text-blue-400 hover:underline">Twitter</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="text-blue-400 hover:underline">LinkedIn</a>
          <span className="text-gray-500">|</span>
          <a href="#" className="text-blue-400 hover:underline">Instagram</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
