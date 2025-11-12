// components/Navbar.tsx
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NavbarProps {
  isAuthenticated: boolean;
  onCtaClick: () => void; // Function to handle button click
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onCtaClick }) => {
  const router = useRouter();

  // Define the text for the button
  const buttonText = isAuthenticated ? "Go to Home" : "Sign Up";
  
  // The site logo/title, which routes to the landing page
  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full z-10 bg-black bg-opacity-30 backdrop-blur-sm p-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Site Title (Left Side) */}
        <button 
          onClick={handleLogoClick}
          className="text-2xl font-bold text-white tracking-widest hover:text-orange-400 transition"
        >
          Don’t Worry
        </button>

        {/* Action Button (Right Side) */}
        <motion.button
          onClick={onCtaClick}
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255, 165, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold text-sm shadow-lg hover:bg-orange-600 transition duration-300"
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;