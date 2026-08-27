// Framefileinfo.jsx - Version avec barre de progression
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaTimes, FaCopy, FaCheck, FaShareAlt, FaLink, FaCloudUploadAlt, FaFolder, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; 
import { getFriendlyErrorMessage } from '../../../lib/userFriendlyErrors';

export default function Framefileinfo({ file, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [password, setPassword] = useState('');
    const [expiration, setExpiration] = useState('3');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState('preparing');
    const [shareResult, setShareResult] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [shareFeedback, setShareFeedback] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, [file]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const getFileInfo = () => {
        if (!file) return null;
        
        const name = file.name;
        const ext = '.' + name.split('.').pop()?.toLowerCase();
        const size = (file.size / 1024 / 1024).toFixed(3) + ' MB';
        const type = getFileType(ext);
        
        return { name, type, ext, size };
    };

    const getFileType = (ext) => {
        const types = {
            '.pdf': 'PDF Document',
            '.jpg': 'JPEG Image',
            '.jpeg': 'JPEG Image',
            '.png': 'PNG Image',
            '.gif': 'GIF Image',
            '.txt': 'Text File',
            '.doc': 'Word Document',
            '.docx': 'Word Document',
            '.zip': 'Compressed Folder'
        };
        return types[ext] || 'Unknown File Type';
    };

    const getStageMessage = () => {
        switch(uploadStage) {
            case 'preparing':
                return 'Préparation du fichier...';
            case 'uploading':
                return `Upload en cours (${uploadProgress}%)...`;
            case 'processing':
                return 'Traitement et création du lien...';
            case 'complete':
                return 'Upload terminé !';
            default:
                return 'Upload en cours...';
        }
    };

    const StageIcon = () => {
        switch(uploadStage) {
            case 'preparing':
                return <FaFolder className="text-[#003580]" size={16} />;
            case 'uploading':
                return <FaCloudUploadAlt className="text-[#003580]" size={16} />;
            case 'processing':
                return <FaCog className="text-[#003580]" size={16} />;
            case 'complete':
                return <FaCheck className="text-[#00A651]" size={16} />;
            default:
                return <FaCloudUploadAlt className="text-[#003580]" size={16} />;
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Fichier manquant');
            return;
        }

        setLoading(true);
        setError(null);
        setUploadProgress(0);
        setUploadStage('uploading');
        setShareFeedback('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            if (password) {
                formData.append('password', password);
            }
            
            if (expiration) {
                formData.append('expiration', expiration);
            }

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(percentComplete);
                    if (percentComplete < 50) {
                        setUploadStage('uploading');
                    } else if (percentComplete < 90) {
                        setUploadStage('processing');
                    } else {
                        setUploadStage('complete');
                    }
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        if (result.success) {
                            setUploadProgress(100);
                            setUploadStage('complete');
                            setShareResult({
                                shareUrl: result.shareUrl,
                                fileId: result.fileId,
                                fileName: file.name,
                                fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                                hasPassword: !!password,
                                expiresIn: expiration === 'never' ? 'Jamais' : `${expiration} jours`
                            });
                            setLoading(false);
                        } else {
                            setError(getFriendlyErrorMessage(result?.error, 'Le téléchargement a échoué. Réessayez dans quelques instants.'));
                            setLoading(false);
                            setUploadStage('preparing');
                        }
                    } catch (parseError) {
                        console.error('Erreur parse JSON:', parseError);
                        setError('Le téléchargement a échoué. Réessayez dans quelques instants.');
                        setLoading(false);
                    }
                } else {
                    setError(getFriendlyErrorMessage(`Erreur serveur (${xhr.status})`, 'Le téléchargement a échoué. Réessayez dans quelques instants.'));
                    setLoading(false);
                }
            });

            xhr.addEventListener('error', () => {
                setError('Le service de téléchargement est momentanément indisponible. Réessayez dans quelques instants.');
                setLoading(false);
            });

            xhr.open('POST', '/api/new_file');
            xhr.send(formData);
        } catch (err) {
            console.error('Erreur complète:', err);
            setError('Erreur lors de l\'upload. Vérifiez la console.');
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (shareResult?.shareUrl) {
            navigator.clipboard.writeText(shareResult.shareUrl)
                .then(() => {
                    setCopied(true);
                    setShareFeedback('Lien copié dans le presse-papiers.');
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Erreur lors de la copie:', err);
                    setShareFeedback('Impossible de copier automatiquement. Copiez le lien manuellement.');
                });
        }
    };

    const handleShare = async () => {
        if (shareResult?.shareUrl && navigator.share) {
            try {
                await navigator.share({
                    title: `Partager ${shareResult.fileName}`,
                    text: `Voici le fichier ${shareResult.fileName} partagé via Sendsey`,
                    url: shareResult.shareUrl,
                });
                setShareFeedback('Partage lancé.');
            } catch (err) {
                console.log('Partage annulé ou erreur:', err);
                setShareFeedback('Le partage a été annulé. Vous pouvez copier le lien manuellement.');
            }
            return;
        }

        if (shareResult?.shareUrl) {
            setShareFeedback('L’API de partage n’est pas disponible sur ce navigateur. Copiez le lien ci-dessous.');
            handleCopyLink();
        }
    };

    const fileInfo = getFileInfo();
    if (!fileInfo) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 bg-[#0b1f33]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !shareResult) {
                            handleClose();
                        }
                    }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-[#e5e9ee]"
                        initial={{ opacity: 0, y: -30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-6 py-4 bg-[#003580]">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                {shareResult ? (
                                    <>
                                        <FaLink size={16} /> Lien de partage
                                    </>
                                ) : loading ? (
                                    <>
                                        <FaCloudUploadAlt size={16} /> Upload en cours
                                    </>
                                ) : (
                                    'Envoyer un fichier'
                                )}
                            </h2>
                            {!shareResult && !loading && (
                                <button 
                                    onClick={handleClose} 
                                    className="text-white/80 hover:text-white text-lg transition-colors p-2 rounded-full hover:bg-white/10"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        <div className="p-6 text-[#0b1f33]">
                            {shareResult ? (
                                <div className="py-4">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#003580]/8 rounded-full mb-4">
                                            <FaLink className="text-[#003580] text-xl" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-1">Fichier uploadé avec succès</h3>
                                        <p className="text-[#5b6b7c] text-sm">Votre lien de partage est prêt</p>
                                    </div>

                                    <div className="bg-[#f7f9fb] p-4 rounded-xl mb-6 border border-[#e5e9ee]">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-[#003580]/8 rounded-lg flex items-center justify-center">
                                                <span className="text-[#003580] font-bold text-xs">
                                                    {fileInfo.ext.replace('.', '').toUpperCase().slice(0, 3)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold truncate">{shareResult.fileName}</p>
                                                <p className="text-sm text-[#8494a5]">{shareResult.fileSize}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="bg-white p-2 rounded-lg border border-[#e5e9ee]">
                                                <p className="text-[#8494a5]">Mot de passe</p>
                                                <p className="font-semibold">{shareResult.hasPassword ? 'Activé' : 'Désactivé'}</p>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-[#e5e9ee]">
                                                <p className="text-[#8494a5]">Expiration</p>
                                                <p className="font-semibold">{shareResult.expiresIn}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8 bg-[#f7f9fb] p-6 rounded-xl border border-[#e5e9ee]">
                                        <p className="font-semibold text-[#0b1f33] mb-4 flex items-center gap-2">
                                            <FaLink className="text-[#003580]" size={14} /> Lien de partage
                                        </p>

                                        <div className="bg-white border border-[#e5e9ee] rounded-lg p-4 mb-5 break-all">
                                            <p className="text-xs text-[#8494a5] mb-1">Cliquez pour sélectionner :</p>
                                            <p className="text-sm font-mono font-medium text-[#003580] select-all">{shareResult.shareUrl}</p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <button 
                                                onClick={handleCopyLink}
                                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                                                    copied 
                                                        ? 'bg-[#00A651] hover:bg-[#00A651] text-white' 
                                                        : 'bg-[#003580] hover:bg-[#002a66] text-white'
                                                }`}
                                            >
                                                {copied ? (
                                                    <>
                                                        <FaCheck size={14} /> Copié !
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCopy size={14} /> Copier le lien
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#009FE3] hover:bg-[#0089c7] text-white rounded-xl font-medium transition-colors"
                                            >
                                                <FaShareAlt size={14} /> Partager
                                            </button>
                                        </div>

                                        {shareFeedback && (
                                            <p className="mt-3 text-center text-sm text-[#5b6b7c]">{shareFeedback}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6 border-t border-[#e5e9ee]">
                                        <a
                                            href={shareResult.shareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-[#FEBA02] hover:bg-[#e5a700] text-[#0b1f33] font-semibold rounded-xl transition-colors text-center"
                                        >
                                            Voir le fichier partagé
                                        </a>
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-3 bg-[#f0f2f5] hover:bg-[#e5e9ee] text-[#0b1f33] font-medium rounded-xl transition-colors"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="py-6">
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-medium text-[#0b1f33] flex items-center gap-2">
                                                <StageIcon />
                                                {getStageMessage()}
                                            </span>
                                            <span className="font-semibold text-[#003580]">{Math.round(uploadProgress)}%</span>
                                        </div>
                                        

                                        <div className="w-full bg-[#e5e9ee] rounded-full h-2.5 overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-[#003580] rounded-full"
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.15 }}
                                            />
                                        </div>
                                        
                                        <div className="flex justify-between mt-2 text-xs text-[#8494a5]">
                                            <span>Préparation</span>
                                            <span>Upload</span>
                                            <span>Traitement</span>
                                            <span>Terminé</span>
                                        </div>
                                        
                                        <div className="flex justify-between mt-1">
                                            <div className={`w-2.5 h-2.5 rounded-full ${uploadStage === 'preparing' ? 'bg-[#003580]' : 'bg-[#e5e9ee]'}`}></div>
                                            <div className={`w-2.5 h-2.5 rounded-full ${uploadStage === 'uploading' ? 'bg-[#003580]' : 'bg-[#e5e9ee]'}`}></div>
                                            <div className={`w-2.5 h-2.5 rounded-full ${uploadStage === 'processing' ? 'bg-[#003580]' : 'bg-[#e5e9ee]'}`}></div>
                                            <div className={`w-2.5 h-2.5 rounded-full ${uploadStage === 'complete' ? 'bg-[#00A651]' : 'bg-[#e5e9ee]'}`}></div>
                                        </div>
                                    </div>

                                    <div className="bg-[#f7f9fb] p-4 rounded-xl border border-[#e5e9ee]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 bg-[#003580]/8 rounded-lg flex items-center justify-center">
                                                <span className="text-[#003580] font-bold text-sm">
                                                    {fileInfo.ext.replace('.', '').toUpperCase().slice(0, 3)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold truncate">{fileInfo.name}</p>
                                                <p className="text-sm text-[#8494a5]">{fileInfo.size} • {fileInfo.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center mt-8">
                                        <p className="text-[#8494a5] text-sm">
                                            Ne fermez pas cette fenêtre pendant l'upload...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold text-[#0b1f33] mb-6 border-b border-[#e5e9ee] pb-3">
                                        Informations du fichier
                                    </h3>
                                    
                                    <div className="space-y-1 mb-6">
                                        <div className="flex justify-between items-center py-2.5 border-b border-[#f0f2f5]">
                                            <span className="font-medium text-[#5b6b7c] text-sm">Nom du fichier</span>
                                            <span className="text-[#0b1f33] font-medium truncate max-w-xs text-sm">{fileInfo.name}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2.5 border-b border-[#f0f2f5]">
                                            <span className="font-medium text-[#5b6b7c] text-sm">Type</span>
                                            <span className="text-[#0b1f33] font-medium text-sm">{fileInfo.type}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2.5 border-b border-[#f0f2f5]">
                                            <span className="font-medium text-[#5b6b7c] text-sm">Extension</span>
                                            <span className="text-[#0b1f33] font-medium text-sm">{fileInfo.ext}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center py-2.5 border-b border-[#f0f2f5]">
                                            <span className="font-medium text-[#5b6b7c] text-sm">Taille</span>
                                            <span className="text-[#0b1f33] font-medium text-sm">{fileInfo.size}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block font-medium text-[#0b1f33] mb-2 text-sm">
                                            Protection par mot de passe (optionnel)
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? 'text' : 'password'} 
                                                placeholder="Entrez un mot de passe pour protéger le fichier"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full h-12 border border-[#e5e9ee] rounded-xl px-4 pr-12 focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] outline-none transition-all text-sm"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8494a5] hover:text-[#0b1f33] transition-colors"
                                                onClick={() => setShowPassword(prev => !prev)}
                                            >
                                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block font-medium text-[#0b1f33] mb-2 text-sm">
                                            Expiration du lien (en jours)
                                        </label>
                                        <select
                                            value={expiration}
                                            onChange={(e) => setExpiration(e.target.value)}
                                            className="w-full h-12 border border-[#e5e9ee] rounded-xl px-4 focus:ring-2 focus:ring-[#003580]/20 focus:border-[#003580] outline-none text-sm"
                                        >
                                            <option value="1">1 jour</option>
                                            <option value="3">3 jours</option>
                                            <option value="7">7 jours</option>
                                        </select>
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-3 pt-4">
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-3 bg-[#f0f2f5] hover:bg-[#e5e9ee] text-[#0b1f33] font-medium rounded-xl transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={loading}
                                            className="px-6 py-3 bg-[#003580] hover:bg-[#002a66] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <FaCloudUploadAlt size={16} /> Upload & Partager
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}