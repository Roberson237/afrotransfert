'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFile, FaLock, FaEye, FaEyeSlash, FaCloudDownloadAlt, FaFileAlt, FaExclamationTriangle } from 'react-icons/fa';
import { saveAs } from 'file-saver';

export default function SharePage() {
    const params = useParams();
    const [fileInfo, setFileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [needsPassword, setNeedsPassword] = useState(false);

    useEffect(() => {
        const fetchFileInfo = async () => {
            try {
                const response = await fetch(`/api/share/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setFileInfo(data);
                    setNeedsPassword(data.hasPassword);
                } else {
                    setError(data.error);
                }
            } catch (err) {
                setError('Erreur lors du chargement du fichier');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchFileInfo();
        }
    }, [params.id]);

    const handleDownload = async () => {
        if (needsPassword && !password) return;

        setDownloading(true);
        try {
            const downloadUrl = needsPassword ? `/api/download/${params.id}?password=${encodeURIComponent(password)}` : `/api/download/${params.id}`;

            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            saveAs(blob, fileInfo.fileName);
        } catch (error) {
            console.error('Download failed', error);
            alert('Échec du téléchargement. Vérifiez le mot de passe.');
        } finally {
            setDownloading(false);
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return 'Taille inconnue';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (type) => {
        if (type?.includes('pdf')) return <FaFileAlt className="text-[#c0392b]" size={40} />;
        if (type?.includes('image')) return <FaFile className="text-[#009FE3]" size={40} />;
        if (type?.includes('text')) return <FaFile className="text-[#5b6b7c]" size={40} />;
        return <FaFile className="text-[#003580]" size={40} />;
    };

    if (loading) {
        return (
            <div className="fixed top-0 left-0 z-50 min-h-screen w-full bg-white text-[#0b1f33] flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#e5e9ee] border-t-[#003580] mx-auto mb-5"></div>
                    <h2 className="text-xl font-semibold mb-1">Chargement du fichier...</h2>
                    <p className="text-[#5b6b7c] text-sm">Veuillez patienter</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed top-0 left-0 z-50 min-h-screen w-full bg-white text-[#0b1f33] flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                        <FaExclamationTriangle className="text-red-500" size={24} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Erreur</h2>
                    <p className="text-[#5b6b7c] mb-6 text-sm">{error}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-[#003580] hover:bg-[#002a66] text-white rounded-xl font-medium transition-colors"
                    >
                        Retour
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 z-50 min-h-screen w-full bg-white text-[#0b1f33] flex flex-col items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003580]/5 rounded-2xl mb-5">
                        <FaCloudDownloadAlt className="text-[#003580]" size={28} />
                    </div>
                    <h1 className="text-2xl font-semibold mb-1">Fichier partagé</h1>
                    <p className="text-[#5b6b7c] text-sm">Téléchargez votre fichier en toute sécurité</p>
                </div>

                {/* File Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 mb-4 border border-[#e5e9ee] shadow-sm"
                >
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#f0f2f5]">
                        <div className="shrink-0 w-16 h-16 rounded-xl bg-[#f7f9fb] flex items-center justify-center">
                            {getFileIcon(fileInfo.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-[#0b1f33] truncate mb-1">{fileInfo.fileName}</h3>
                            <div className="flex items-center gap-3 text-[#8494a5] text-sm">
                                <span>{fileInfo.type || 'Type inconnu'}</span>
                                <span>•</span>
                                <span>{formatSize(fileInfo.fileSize)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Password Field */}
                    <AnimatePresence>
                        {needsPassword && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5"
                            >
                                <label className="flex items-center gap-2 text-sm font-medium text-[#0b1f33] mb-2">
                                    <FaLock size={12} className="text-[#8494a5]" />
                                    Mot de passe requis
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Entrez le mot de passe"
                                        className="w-full h-12 px-4 pr-12 border border-[#e5e9ee] rounded-xl text-sm text-[#0b1f33] placeholder-[#8494a5] focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8494a5] hover:text-[#0b1f33] transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Download Button */}
                    <motion.button
                        onClick={handleDownload}
                        disabled={downloading || (needsPassword && !password)}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#003580] hover:bg-[#002a66] disabled:bg-[#c3ccd6] disabled:cursor-not-allowed text-white font-medium text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        whileHover={{ scale: downloading ? 1 : 1.01 }}
                        whileTap={{ scale: downloading ? 1 : 0.98 }}
                    >
                        {downloading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/40 border-t-white"></div>
                                Téléchargement...
                            </>
                        ) : (
                            <>
                                <FaCloudDownloadAlt size={18} />
                                Télécharger le fichier
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.2 } }}
                    className="text-center text-[#8494a5] text-xs"
                >
                    <p>Ce fichier a été partagé en toute sécurité • Téléchargement unique</p>
                </motion.div>
            </motion.div>
        </div>
    );
}