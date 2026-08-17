// Dans votre App.jsx ou router
// NotFoundPage.jsx
'use client'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaUpload, FaExclamationTriangle, FaClock, File } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        
        {/* En-tête avec logo */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 0.3 }}
            >
              <File className="text-white text-xl" />
            </motion.div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              sendsey
            </span>
          </Link>
        </motion.div>

        {/* Contenu principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100"
        >
          {/* Icône d'erreur animée */}
          <motion.div
            className="relative mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          >
            <div className="relative inline-block">
              <motion.div
                className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center shadow-lg mx-auto"
                animate={{ 
                  rotate: [0, -2, 2, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaExclamationTriangle className="text-orange-500 text-3xl" />
              </motion.div>
              
              {/* Animation de pulsation */}
              <motion.div
                className="absolute inset-0 border-2 border-orange-200 rounded-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            </div>
          </motion.div>

          {/* Titre et message */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            File Not Found
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            The file you're looking for doesn't exist or the link has expired.
          </motion.p>

          {/* Message d'explication */}
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 text-blue-700">
              <FaClock className="text-blue-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">Links expire for security</p>
                <p className="text-xs text-blue-600/80 mt-1">
                  File links automatically expire after their time limit
                </p>
              </div>
            </div>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link to="/" className="w-full sm:w-auto">
              <motion.button
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaHome className="text-lg" />
                Back to Homepage
              </motion.button>
            </Link>
            
            <Link to="/upload" className="w-full sm:w-auto">
              <motion.button
                className="w-full flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white hover:bg-blue-50"
                whileHover={{ 
                  scale: 1.02,
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUpload className="text-lg" />
                Upload New File
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 text-sm text-gray-600 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Secure & Private</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              Files are automatically deleted after expiration for your privacy
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Time Limited</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              Download links expire after 1 hour to 7 days based on settings
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Easy Sharing</h4>
            <p className="text-gray-600 text-xs leading-relaxed">
              Upload and share files securely with expiration controls
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <p className="text-gray-400 text-sm mb-2">
            Need help? <a href="/contact" className="text-blue-600 hover:text-blue-700 font-medium underline">Contact Support</a>
          </p>
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} Sendsey. Secure file sharing made simple.
          </p>
        </motion.div>
      </div>
    </div>
  );
}