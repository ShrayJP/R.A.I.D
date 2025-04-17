import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?disaster,aid,help')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-white text-center p-10 rounded-2xl backdrop-blur-lg bg-white/10 shadow-2xl max-w-5xl w-full"
      >
        <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
        <img src="/Logo.png" alt="RAID Logo" className="h-20 w-20"/>
          <h1 className="text-4xl md:text-5xl font-bold">
            Resource Allocation for Identified Disasters
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl mb-12 text-gray-200">
          Your comprehensive solution for disaster management and response coordination. 
          We help organizations prepare, respond, and recover from emergencies.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => navigate('/login')}
        >
          Register / Login
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
