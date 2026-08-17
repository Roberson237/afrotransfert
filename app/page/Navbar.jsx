
import { useState } from 'react';
import { FaHome, FaUpload, FaDownload, FaHeadset, FaUser, FaRocket, FaSatellite, FaMicrochip } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [activeItem, setActiveItem] = useState('UPLOAD');
  const [isHovered, setIsHovered] = useState(null);

  const navItems = [
    { id: 'home', label: 'HoMe', icon: FaHome, color: 'from-green-400 to-emerald-600' },
    { id: 'download', label: 'DOWNLOAD', icon: FaDownload, color: 'from-blue-400 to-cyan-600' },
    { id: 'upload', label: 'UPLOAD', icon: FaUpload, color: 'from-purple-400 to-indigo-600' },
    { id: 'signin', label: 'AUTHENTICATE', icon: FaUser, color: 'from-yellow-400 to-amber-600' },
    { id: 'help', label: 'GROUND SUPPORT', icon: FaHeadset, color: 'from-red-400 to-orange-600' }
  ];

  return (
    <motion.div 
      className="absolute top-0 left-0 w-screen h-32 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 shadow-2xl flex justify-between items-center px-12 text-white border-b border-cyan-500/30 z-50 backdrop-blur-md bg-opacity-95"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120, damping: 15 }}
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Animated Scan Line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        animate={{ y: [0, 32, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* NASA/Silicon Valley Logo Section */}
      <motion.div 
        className="flex items-center gap-4 relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {/* Animated Orbital Rings */}
        <motion.div className="relative">
          <motion.div
            className="absolute inset-0 border-2 border-cyan-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border border-cyan-300 rounded-full opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Central Icon with Data Stream */}
          <motion.div
            className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25"
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(6,182,212,0.3)',
                '0 0 40px rgba(6,182,212,0.6)',
                '0 0 20px rgba(6,182,212,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaRocket className="text-white text-lg" />
          </motion.div>
        </motion.div>

        {/* Logo Text with Terminal Effect */}
        <div className="relative">
          <motion.h1 
            className="text-white text-4xl font-mono font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            SENDSEY_OS
          </motion.h1>
          <motion.div
            className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
          
          {/* Status Indicator */}
          <motion.div 
            className="flex items-center gap-2 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-cyan-300 text-xs font-mono">SENDING_READY</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Items - Mission Control Style */}
      <div className="flex items-center gap-6 relative">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          const isHovering = isHovered === item.id;
          
          return (
            <motion.div
              key={item.id}
              className="relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
              onHoverStart={() => setIsHovered(item.id)}
              onHoverEnd={() => setIsHovered(null)}
              onClick={() => setActiveItem(item.id)}
            >
              {/* Connection Line */}
              {index > 0 && (
                <motion.div 
                  className="absolute -left-3 top-1/2 w-3 h-0.5 bg-cyan-500/30"
                  animate={{ opacity: isHovering ? 1 : 0.3 }}
                />
              )}

              {/* Navigation Button */}
              <motion.button
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm font-medium tracking-wide transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/25`
                    : 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/30'
                }`}
                whileHover={{ 
                  y: -2,
                  scale: 1.05,
                  borderColor: 'rgba(6,182,212,0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Icon */}
                <motion.div
                  className="relative"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                  }}
                >
                  <Icon className={`${isActive ? 'text-white' : 'text-cyan-300'} text-base`} />
                  
                  {/* Data Pulse Effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-current"
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <span className={`font-mono ${isActive ? 'text-white font-bold' : 'text-cyan-100'}`}>
                  {item.label}
                </span>

                {/* Status Dot */}
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-green-400' : 'bg-cyan-500/50'
                  }`}
                  animate={{ 
                    scale: isActive ? [1, 1.5, 1] : 1,
                    opacity: isActive ? [1, 0.7, 1] : 0.7
                  }}
                  transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                />
              </motion.button>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 border border-cyan-500/30 rounded px-3 py-2 text-cyan-200 text-xs font-mono whitespace-nowrap shadow-xl"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {item.label.replace('_', ' ')}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-l border-t border-cyan-500/30 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Indicator Beam */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* System Status Bar */}
      <motion.div 
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-xs font-mono text-cyan-300/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center gap-2">
          <FaMicrochip className="text-green-400" />
          <span>fast</span>
        </div>
        <div className="flex items-center gap-2">
          <FaSatellite className="text-blue-400" />
          <span>LINK: secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
      </motion.div>

      {/* Ambient Data Stream Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-cyan-400/10 font-mono text-xs"
            initial={{ x: -100, y: Math.random() * 32 }}
            animate={{ x: '100vw' }}
            transition={{ 
              duration: 15 + i * 5, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear" 
            }}
          >
        Fast sending and secure
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}