import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X, FileImage } from 'lucide-react';

interface UploadZoneProps {
  onFilesUploaded: (files: File[]) => void;
  compact?: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFilesUploaded, compact = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  }, []);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesUploaded(selectedFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${compact ? 'max-w-xl' : 'max-w-3xl'} mx-auto`}>
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl ${compact ? 'p-6 md:p-7' : 'p-8 md:p-10'} text-center transition-all duration-300 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : selectedFiles.length > 0
            ? 'border-emerald-300 bg-emerald-25'
            : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <motion.div
          animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Upload 
            className={`${compact ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-3 md:mb-4 ${
              dragActive ? 'text-emerald-500' : 'text-gray-400'
            }`}
          />
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">
            {dragActive ? 'Drop your cattle images here!' : 'Upload Cattle Images'}
          </h3>
          <p className="text-gray-600 mb-2 md:mb-3">
            Drag and drop your cattle photos or click to browse
          </p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, WebP • Max 10MB per file • Multiple images for better accuracy
          </p>
        </motion.div>

        {dragActive && (
          <motion.div
            className="absolute inset-0 bg-emerald-500/10 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h4 className="text-lg font-semibold text-gray-800">
            Selected Images ({selectedFiles.length})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                className="relative bg-white rounded-lg p-4 shadow-md border border-gray-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start gap-3">
                  <FileImage className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                {file.type.startsWith('image/') && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.button
            onClick={handleUpload}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Analyze {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}
            </span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone;