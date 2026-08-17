// selecttime.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { FaCrown, FaClock, FaChevronDown } from 'react-icons/fa';

const AdvancedTimeSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [dropdownDirection, setDropdownDirection] = useState('up');
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const timeOptions = [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      days: i + 1,
      label: `${i + 1} Day${i + 1 > 1 ? 's' : ''}`,
      hours: (i + 1) * 24,
      type: 'standard',
      color: `hsl(${i * 36}, 70%, 50%)`
    })),
    {
      id: 11,
      days: 11,
      label: '11 Days+ PREMIUM',
      hours: 264,
      type: 'premium',
      color: 'linear-gradient(135deg, #FFD700, #FFA500)'
    }
  ];

  // Déterminer la direction du dropdown
  useEffect(() => {
    const checkSpace = () => {
      if (triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        
        // Si peu d'espace en bas, afficher vers le haut
        setDropdownDirection(spaceBelow < 300 ? 'up' : 'down');
      }
    };

    checkSpace();
    window.addEventListener('resize', checkSpace);
    return () => window.removeEventListener('resize', checkSpace);
  }, []);

  // Animation GSAP pour les items
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('.time-item');
      gsap.fromTo(items, 
        { 
          opacity: 0, 
          y: dropdownDirection === 'up' ? 20 : -20,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [isOpen, dropdownDirection]);

  const handleSelect = (option) => {
    if (option.type !== 'premium') {
      setSelectedTime(option);
      setIsOpen(false);
      
      if (triggerRef.current) {
        gsap.to(triggerRef.current, {
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
      }
    }
  };

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownVariants = {
    up: {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 20, scale: 0.95 }
    },
    down: {
      initial: { opacity: 0, y: -20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -20, scale: 0.95 }
    }
  };

  return (
    <div className="relative w-80">
      {/* Trigger Button */}
      <motion.button
        ref={triggerRef}
        onClick={handleTriggerClick}
        className="w-full flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-2xl hover:border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        whileHover={{ 
          scale: 1.02,
          y: -2
        }}
        whileTap={{ scale: 0.98 }}
        animate={{
          borderColor: isOpen ? '#3B82F6' : selectedTime ? '#10B981' : '#E5E7EB',
          background: isOpen ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.95)'
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-blue-600"
          >
            <FaClock size={20} />
          </motion.div>
          <div className="text-left">
            <motion.span 
              className="text-gray-700 font-semibold block text-lg"
              key={selectedTime?.id}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              {selectedTime ? selectedTime.label : 'Choose your time'}
            </motion.span>
            {selectedTime && (
              <motion.span 
                className="text-gray-500 text-sm block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {selectedTime.hours} hours
              </motion.span>
            )}
          </div>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="text-gray-400 group-hover:text-blue-600"
        >
          <FaChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content - Position vers le haut */}
            <motion.div
              ref={dropdownRef}
              className={`absolute ${
                dropdownDirection === 'up' 
                  ? 'bottom-full mb-3' 
                  : 'top-full mt-3'
              } left-0 right-0 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-80`}
              variants={dropdownVariants[dropdownDirection]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ 
                duration: 0.3,
                type: "spring",
                damping: 25
              }}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaClock className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Select Duration</h3>
                    <p className="text-gray-600 text-sm">Choose how long your link will stay active</p>
                  </div>
                </div>
              </div>

              {/* Options List */}
              <div className="overflow-y-auto p-4" style={{ maxHeight: '250px' }}>
                <div className="grid gap-2">
                  {timeOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelect(option)}
                      disabled={option.type === 'premium'}
                      className={`time-item w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                        option.type === 'premium'
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 cursor-not-allowed'
                          : 'hover:scale-105 border-transparent hover:border-blue-200 cursor-pointer'
                      } ${
                        selectedTime?.id === option.id 
                          ? 'bg-blue-50 border-blue-300 shadow-lg' 
                          : 'bg-white/80 hover:bg-white'
                      }`}
                      whileHover={option.type !== 'premium' ? { 
                        scale: 1.02,
                        y: -2
                      } : {}}
                      whileTap={option.type !== 'premium' ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon/Circle */}
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                            option.type === 'premium' 
                              ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                              : ''
                          }`}
                          style={
                            option.type !== 'premium' 
                              ? { background: option.color }
                              : {}
                          }
                          whileHover={{ 
                            scale: 1.1,
                            rotate: option.type === 'premium' ? [0, -10, 10, 0] : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {option.type === 'premium' ? (
                            <FaCrown className="text-white text-lg" />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {option.days}
                            </span>
                          )}
                        </motion.div>

                        {/* Text Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-lg ${
                              option.type === 'premium' 
                                ? 'text-orange-600' 
                                : 'text-gray-800'
                            }`}>
                              {option.label}
                            </span>
                            {option.type === 'premium' && (
                              <motion.span
                                className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full"
                                animate={{ 
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity 
                                }}
                              >
                                PREMIUM
                              </motion.span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            option.type === 'premium' 
                              ? 'text-orange-500' 
                              : 'text-gray-600'
                          }`}>
                            {option.type === 'premium' 
                              ? 'Upgrade for extended duration' 
                              : `${option.hours} hours of access`
                            }
                          </p>
                        </div>

                        {/* Checkmark for selected */}
                        {selectedTime?.id === option.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-center text-gray-600 text-sm">
                  💡 Longer durations available with Premium
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export { AdvancedTimeSelect };