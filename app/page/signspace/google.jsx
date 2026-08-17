'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Cross2Icon, EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { signIn } from 'next-auth/react';

import {New_User} from './action';
import { authenticateUser } from './auth';
import { redirect} from 'next/navigation';




const AuthModal = ({ isOpen, onClose, onContinueWithoutSignIn }) => {
  
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleGoogleAuth = () => {
    setIsLoading(true);
    signIn('google', { callbackUrl: '/page/uploadspace' });
  };

   

  
   async function handleContinueWithoutSignIn() {
      redirect('page/uploadspace/');
    };
  
  async function User_new(formData){
    await New_User(formData);
    
      redirect('/page/uploadspace/');
};
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 400,
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                  variants={backdropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                />
              </Dialog.Overlay>
              
              <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                <Dialog.Content asChild>
                  <motion.div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {/* Message de succès */}
                    <AnimatePresence>
                      {showSuccessMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute top-0 left-0 right-0 bg-green-500 text-white py-3 px-4 text-center font-medium z-10"
                        >
                          {successMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* En-tête minimaliste */}
                    <div className="relative p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                          Welcome to Sendsey
                        </Dialog.Title>
                        <Dialog.Close asChild>
                          <motion.button 
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Cross2Icon className="w-4 h-4" />
                          </motion.button>
                        </Dialog.Close>
                      </div>
                    </div>

                    <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="p-6">
                      <Tabs.List className="flex space-x-6 mb-8">
                        {[
                          { value: 'login', label: 'Sign in' },
                          { value: 'register', label: 'Sign up' }
                        ].map((tab) => (
                          <Tabs.Trigger
                            key={tab.value}
                            value={tab.value}
                            className="pb-2 text-sm font-medium transition-all relative data-[state=active]:text-gray-900 data-[state=active]:font-semibold text-gray-500 hover:text-gray-700"
                          >
                            {tab.label}
                            {activeTab === tab.value && (
                              <motion.div
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                layoutId="activeTab"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.2 }}
                              />
                            )}
                          </Tabs.Trigger>
                        ))}
                      </Tabs.List>

                      {/* Bouton Google épuré */}
                      <motion.button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-all duration-200 mb-6"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className={isLoading ? 'text-gray-400' : ''}>
                          {isLoading ? 'Connecting...' : 'Continue with Google'}
                        </span>
                      </motion.button>

                      {/* Divider simple */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-3 bg-white text-gray-500 text-sm">or</span>
                        </div>
                      </div>

                      {/* Formulaire de connexion */}
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        setLoginLoading(true);
                        setLoginError('');
                        const formData = new FormData(e.target);
                        try {
                          await authenticateUser(formData);
                        } catch (error) {
                          if (error.message !== 'NEXT_REDIRECT') {
                            setLoginError(error.message || 'Login failed');
                          }
                        } finally {
                          setLoginLoading(false);
                        }
                      }}>
                      <Tabs.Content value="login" className="space-y-4">
                        {loginError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {loginError}
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your email" name='emc'
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                              placeholder="Enter your password" name='passc'
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                              {showPassword ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: loginLoading ? 1 : 1.01 }}
                          whileTap={{ scale: loginLoading ? 1 : 0.99 }}
                          disabled={loginLoading}
                          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          type="submit"
                        >
                          {loginLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                          {loginLoading ? 'Signing in...' : 'Sign in'}
                        </motion.button>
                      </Tabs.Content>
                      </form>
                      {/* Formulaire d'inscription */}
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        setRegisterLoading(true);
                        setRegisterError('');
                        const formData = new FormData(e.target);
                        try {
                          await New_User(formData);
                        } catch (error) {
                          if (error.message !== 'NEXT_REDIRECT') {
                            setRegisterError(error.message || 'Registration failed');
                          }
                        } finally {
                          setRegisterLoading(false);
                        }
                      }}>
                      <Tabs.Content value="register" className="space-y-4">
                        {registerError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {registerError}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First name
                            </label>
                            <input
                              type="text" name='fn'
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="First name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last name
                            </label>
                            <input
                              type="text" name='ln'
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              placeholder="Last name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email" name='en'
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"} name='pass'
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                              placeholder="Create a password"
                              required
                              minLength="8"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                              {showPassword ? <EyeOpenIcon className="w-4 h-4" /> : <EyeClosedIcon className="w-4 h-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            8+ characters with letters and numbers
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: registerLoading ? 1 : 1.01 }}
                          whileTap={{ scale: registerLoading ? 1 : 0.99 }}
                          disabled={registerLoading}
                          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          type='submit'
                        >
                          {registerLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                          {registerLoading ? 'Creating account...' : 'Create account'}
                        </motion.button>
                      </Tabs.Content>
                      </form>

                      {/* Option "Continue without signing in" */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                       <motion.button 
                          onClick={handleContinueWithoutSignIn}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors border border-gray-300 rounded-lg hover:border-gray-400"
                        >
                          Continue without account
                        </motion.button>
                        
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Limited access to basic features
                        </p>
                      </div>
                    </Tabs.Root>

                    {/* Footer légal */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-center text-xs text-gray-600">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-gray-900 hover:text-gray-700 font-medium underline">
                          Terms
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-900 hover:text-gray-700 font-medium underline">
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </div>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AuthModal;