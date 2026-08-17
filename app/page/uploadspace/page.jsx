'use client'
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Framefileinfo from "./Frameshowinfo";
import Circularup from "./Progressbarup";
import { FaCloudUploadAlt } from 'react-icons/fa';
import JSZip from 'jszip';

export default function Uploade() {
  const [uploadState, setUploadState] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  // Fonction pour compresser un dossier en ZIP (drag & drop uniquement)
  const zipFolder = async (files, onProgress) => {
    const zip = new JSZip();
    const folderName = files[0].webkitRelativePath.split('/')[0];

    onProgress(20);

    files.forEach((file) => {
      const relativePath = file.webkitRelativePath;
      zip.file(relativePath, file, {
        compression: "STORE"
      });
    });

    onProgress(60);

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: "STORE",
      compressionOptions: { level: 0 }
    });

    onProgress(90);

    return new File([zipBlob], `${folderName}.zip`, {
      type: 'application/zip',
      lastModified: Date.now()
    });
  };

  // Gestion de la sélection de fichiers/dossiers
  const handleFileSelect = async (files) => {
    let fileToUpload;
    let isFolder = files.length > 1 && files[0].webkitRelativePath;

    if (isFolder) {
      setUploadState('loading');
      setIsCompressing(true);
      setProgress(10);

      try {
        fileToUpload = await zipFolder(Array.from(files), (currentProgress) => {
          setProgress(currentProgress);
        });

        setProgress(95);
        setIsCompressing(false);

      } catch (error) {
        console.error('❌ Erreur lors de la compression:', error);
        setProgress(0);
        setUploadState('idle');
        setIsCompressing(false);
        return;
      }
    } else {
      setUploadState('loading');
      setProgress(0);
      fileToUpload = files[0];

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setProgress(100);
          setSelectedFile(fileToUpload);
          setUploadState('ready');
        } else {
          console.error('Upload failed');
          setUploadState('idle');
          setProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        console.error('Upload error');
        setUploadState('idle');
        setProgress(0);
      });

      xhr.open('POST', '/api/new_file');
      xhr.send(formData);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    event.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;

    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleCloseFrame = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setProgress(0);
    setIsCompressing(false);
  };

  return (
    <div
      className="fixed top-0 left-0 z-50 min-h-screen w-full bg-white text-[#0b1f33] flex flex-col items-center justify-center px-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.doc,.docx,.zip,.exe"
        multiple
      />

      {/* Overlay de drag & drop */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            className="fixed inset-0 bg-[#003580]/95 backdrop-blur-sm z-40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-white text-2xl font-semibold flex flex-col items-center gap-4"
            >
              <FaCloudUploadAlt size={56} />
              Déposez votre fichier ici
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* État initial - Bouton d'upload unique */}
      {uploadState === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="flex flex-col items-center justify-center gap-8 w-full max-w-md"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-[#003580]/5 flex items-center justify-center mb-2">
              <FaCloudUploadAlt size={30} className="text-[#003580]" />
            </div>
            <h1 className="text-2xl font-semibold text-[#0b1f33]">Envoyer un fichier</h1>
            <p className="text-sm text-[#5b6b7c] text-center">
              Sélectionnez un fichier depuis votre appareil ou glissez-le directement ici
            </p>
          </div>

          <motion.button
            onClick={handleFileUploadClick}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#003580] hover:bg-[#002a66] text-white font-medium text-base rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaCloudUploadAlt size={20} />
            Choisir un fichier
          </motion.button>

          <div className="w-full border-t border-[#e5e9ee] pt-4 text-center">
            <p className="text-xs text-[#8494a5]">
              PDF, images, texte, Word, ZIP — 100 Mo maximum
            </p>
            <p className="text-xs text-[#8494a5] mt-1">
              Transfert chiffré et sécurisé
            </p>
          </div>
        </motion.div>
      )}

      {/* État de chargement */}
      {uploadState === 'loading' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="flex flex-col items-center justify-center gap-6"
        >
          <Circularup percentage={progress} isLoading={progress < 100} />

          {selectedFile && progress > 0 && progress < 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-lg font-semibold text-[#003580]">
                {selectedFile.name}
              </p>
              <p className="text-sm text-[#5b6b7c]">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-lg font-medium text-[#0b1f33] mb-2">
              {isCompressing ? `Compression... ${progress}%` :
               progress < 100 ? `Envoi en cours... ${progress}%` : 'Terminé !'}
            </p>
            <div className="w-64 bg-[#e5e9ee] rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-[#009FE3] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* État prêt - Frame avec informations */}
      <AnimatePresence>
        {uploadState === 'ready' && selectedFile && (
          <Framefileinfo
            file={selectedFile}
            onClose={handleCloseFrame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}