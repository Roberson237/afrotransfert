'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';

export default function DownloadPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handledownload = async () => {
        if (!url) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Impossible de récupérer ce fichier');
            }

            const blob = await response.blob();
            const fileName = url.split('/').pop()?.split('?')[0] || 'fichier';

            saveAs(blob, fileName);
        } catch (err) {
            console.error('Erreur de téléchargement:', err);
            setError('Le téléchargement a échoué. Vérifiez le lien et réessayez.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-[#e5e9ee] shadow-sm p-8"
                >
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-[#003580]/5 flex items-center justify-center mb-4">
                            <FaCloudDownloadAlt size={28} className="text-[#003580]" />
                        </div>
                        <h1 className="text-2xl font-semibold text-[#0b1f33]">
                            Télécharger un fichier
                        </h1>
                        <p className="text-sm text-[#5b6b7c] mt-2">
                            Collez le lien du fichier à récupérer
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-[#0b1f33] mb-2">
                                Lien du fichier
                            </label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://exemple.com/fichier.pdf"
                                className="w-full h-12 px-4 border border-[#e5e9ee] rounded-xl focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] outline-none transition-all text-sm text-[#0b1f33]"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <motion.button
                            onClick={handledownload}
                            disabled={loading || !url}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#003580] hover:bg-[#002a66] disabled:bg-[#c3ccd6] disabled:cursor-not-allowed text-white font-medium text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                            whileHover={{ scale: loading || !url ? 1 : 1.01 }}
                            whileTap={{ scale: loading || !url ? 1 : 0.98 }}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/40 border-t-white"></div>
                            ) : (
                                <FaCloudDownloadAlt size={18} />
                            )}
                            {loading ? 'Téléchargement...' : 'Télécharger le fichier'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}