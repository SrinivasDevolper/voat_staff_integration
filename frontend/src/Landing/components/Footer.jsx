import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#0a2540] text-gray-200 py-4  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          
            <div className="flex flex-col items-start">
            <img
              src="/MANAHIRE.png"
              alt="MANAHIRE Logo"
              className="w-64 mb-6"         />
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Empowering your career and hiring journey.<br />
              Connecting talent with opportunity.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 transition-colors duration-200 hover:scale-105">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="bg-gray-900 hover:bg-gray-800 text-white rounded-full p-2.5 transition-colors duration-200 hover:scale-105">
                <FaXTwitter size={16} />
              </a>
              <a href="#" className="bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2.5 transition-colors duration-200 hover:scale-105">
                <FaLinkedinIn size={16} />
              </a>
              <a href="#" className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-2.5 transition-colors duration-200 hover:scale-105">
                <FaInstagram size={16} />
              </a>
            </div>
          </div>        {/* Logo & Social */}


          {/* About */}
          <div className="mt-6 sm:mt-0">
            <h4 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">About</h4>
            <ul className="space-y-3.5 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Company</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Team</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Careers</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="mt-6 sm:mt-0">
            <h4 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3.5 text-sm">
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">Support</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors duration-200 block">FAQs</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-6 sm:mt-0">
            <h4 className="text-lg font-semibold mb-5 text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex flex-col">
                <span className="text-gray-400 mb-1">Email:</span>
                <a href="mailto:support@manahire.com" className="hover:text-blue-300 transition-colors duration-200">support@manahire.com</a>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-400 mb-1">Phone:</span>
                <a href="tel:+911234567890" className="hover:text-blue-300 transition-colors duration-200">+91 12345 67890</a>
              </li>
              <li className="flex flex-col">
                <span className="text-gray-400 mb-1">Address:</span>
                <span>Hyderabad, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-3 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} MANAHIRE. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;