import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthModal from './google';

const Apppp = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleContinueWithoutSignIn = () => {
    // Logique lorsque l'utilisateur continue sans se connecter
    console.log('User chose to continue without signing in');
    // Redirection vers la page d'accueil ou fonctionnalités basiques
  };

  return (
    <div >
      <motion.button
        onClick={() => setIsAuthModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-violet-700 transition-colors"
      >
        Get Started
      </motion.button>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onContinueWithoutSignIn={handleContinueWithoutSignIn}
      />
    </div>
  );
};

export default Apppp;