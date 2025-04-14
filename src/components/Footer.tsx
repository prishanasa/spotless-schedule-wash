
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-laundry-700 text-white">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-white"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M12 8a2 2 0 0 0-2 2" />
                <circle cx="12" cy="12" r="4" />
                <path d="m16 16-1-1" />
              </svg>
              <span className="ml-2 text-xl font-bold">WashWise</span>
            </div>
            <p className="text-laundry-100 text-sm">
              Smart laundry management system for modern living. Book, track, and manage your laundry with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-laundry-200 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-laundry-200 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-laundry-200 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-laundry-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/booking" className="hover:text-white">Book a Slot</Link></li>
              <li><a href="#services" className="hover:text-white">Services</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-laundry-200">
              <li><a href="#" className="hover:text-white">Regular Wash</a></li>
              <li><a href="#" className="hover:text-white">Heavy Duty Wash</a></li>
              <li><a href="#" className="hover:text-white">Delicate Wash</a></li>
              <li><a href="#" className="hover:text-white">Express Wash</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-laundry-200">
              <li>123 Laundry Avenue</li>
              <li>City, State 12345</li>
              <li>info@washwise.com</li>
              <li>(123) 456-7890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-laundry-600 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-laundry-200 text-sm">
            © {new Date().getFullYear()} WashWise. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-laundry-200">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
