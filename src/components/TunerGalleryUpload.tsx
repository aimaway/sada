import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Camera, Video, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { mockTunerData } from '../data/mockDataGlobal';

export const TunerGalleryUpload: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedType, setSelectedType] = useState<'before' | 'after'>('before');
  const [selectedStage, setSelectedStage] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(files);
    
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      alert('Veuillez sélectionner des fichiers');
      return;
    }

    // Simulate upload
    alert(`Upload de ${uploadedFiles.length} fichier(s) en cours...`);
    setTimeout(() => {
      alert('Upload réussi !');
      navigate('/tuner/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate('/tuner/dashboard')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Galerie</h1>
        </div>
        <p className="text-sm text-slate-600">Ajoutez des photos et vidéos de vos préparations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'photos'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Photos
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'videos'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Vidéos
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Upload Type */}
        {activeTab === 'photos' && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <label className="text-sm font-medium text-slate-700 mb-3 block">Type de photo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedType('before')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'before'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-2">📸</div>
                <p className="text-sm font-medium text-slate-800">Avant</p>
                <p className="text-xs text-slate-500 mt-1">Photo avant préparation</p>
              </button>
              <button
                onClick={() => setSelectedType('after')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedType === 'after'
                    ? 'border-red-500 bg-red-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-2">✨</div>
                <p className="text-sm font-medium text-slate-800">Après</p>
                <p className="text-xs text-slate-500 mt-1">Photo après préparation</p>
              </button>
            </div>
          </div>
        )}

        {/* Stage Selection */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <label className="text-sm font-medium text-slate-700 mb-3 block">Stage de préparation</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          >
            <option value="">Sélectionner un stage</option>
            {mockTunerData.stages.map((stage) => (
              <option key={stage.level} value={stage.name}>
                {stage.name} - {stage.description}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Model */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <label className="text-sm font-medium text-slate-700 mb-3 block">Modèle du véhicule</label>
          <input
            type="text"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Ex: Golf 7 GTI 2019"
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <label className="text-sm font-medium text-slate-700 mb-3 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez la préparation effectuée, les modifications apportées, les performances obtenues..."
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none resize-none"
            rows={4}
          />
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <label className="text-sm font-medium text-slate-700 mb-3 block">
            {activeTab === 'photos' ? 'Photos' : 'Vidéos'}
          </label>
          
          <input
            type="file"
            accept={activeTab === 'photos' ? 'image/*' : 'video/*'}
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="w-full p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-red-500 transition-colors cursor-pointer block"
          >
            {activeTab === 'photos' ? (
              <Camera className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            ) : (
              <Video className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            )}
            <p className="text-sm text-slate-600 text-center">
              Cliquez pour sélectionner des {activeTab === 'photos' ? 'photos' : 'vidéos'}
            </p>
            <p className="text-xs text-slate-500 text-center mt-1">
              {activeTab === 'photos' ? 'JPG, PNG jusqu\'à 10MB' : 'MP4, MOV jusqu\'à 100MB'}
            </p>
          </label>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                {previews.length} fichier(s) sélectionné(s)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
                    {activeTab === 'photos' ? (
                      <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Conseils pour de belles photos</p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• Prenez des photos sous plusieurs angles</li>
                <li>• Assurez-vous d'avoir un bon éclairage</li>
                <li>• Montrez les détails des modifications</li>
                <li>• Pour les vidéos, filmez le véhicule en mouvement si possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploadedFiles.length === 0 || !selectedStage || !vehicleModel}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Uploader {activeTab === 'photos' ? 'les photos' : 'la vidéo'}
        </button>
      </div>
    </div>
  );
};
