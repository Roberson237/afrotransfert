// Progressbarup.jsx

import { motion } from 'framer-motion';

const Circularup = ({ percentage, isLoading = false, size = 120 }) => {
  const radius = 54;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e9ee"
          strokeWidth="8"
        />

        {/* Cercle de progression animé */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#003580"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </svg>

      {/* Contenu central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={percentage}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-center"
        >
          <div className="text-2xl font-bold text-[#0b1f33]">
            {percentage}%
          </div>
          <div className="text-sm text-[#8494a5] mt-1">
            {isLoading ? 'Envoi...' : 'Terminé'}
          </div>
        </motion.div>

        {/* Point d'orbite pendant le chargement */}
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="w-2 h-2 bg-[#009FE3] rounded-full"
              style={{ transform: `translateY(-${size / 2 - 4}px)` }}
            />
          </motion.div>
        )}
      </div>

      {/* Effet de pulsation pendant le chargement */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#009FE3]/30"
          animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default Circularup;