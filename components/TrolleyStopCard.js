import { motion } from 'framer-motion';
import { FiMapPin, FiClock } from 'react-icons/fi';

export default function TrolleyStopCard({ stop }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-xl shadow-md p-4 mb-3"
    >
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <FiMapPin className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium">{stop.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <FiClock className="mr-1" />
            <span>Next trolley: {stop.nextArrival}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
