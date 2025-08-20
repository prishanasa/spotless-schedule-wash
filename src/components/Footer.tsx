
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-laundry-700 text-white">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <span className="ml-2 text-xl font-bold">Hostel LaundryLink</span>
            </div>
            <p className="text-laundry-100 text-sm">
              Smart laundry management system for hostel students. Never wait for your laundry again.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-laundry-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/auth" className="hover:text-white">Student Login</Link></li>
              <li><a href="#live-status" className="hover:text-white">Live Status</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-laundry-600 mt-10 pt-6 text-center">
          <p className="text-laundry-200 text-sm">
            © {new Date().getFullYear()} Hostel LaundryLink. Making laundry easier for students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
