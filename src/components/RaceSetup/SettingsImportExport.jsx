import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

const SettingsImportExport = ({ config, setConfig, label = "Paramètres" }) => {
  const fileInputRef = useRef();

  // Exporte le JSON
  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Détection iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      window.open(url, '_blank');
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${label.replace(/\s/g, '_').toLowerCase()}_ekm.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Importe le JSON
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        setConfig(prev => ({ ...prev, ...imported }));
      } catch (err) {
        alert("Fichier invalide !");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-white shadow-lg backdrop-blur border border-primary/30 transition-all duration-150"
      >
        <Download className="w-4 h-4" />
         {label}
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImport}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/80 hover:bg-secondary text-primary shadow-lg backdrop-blur border border-secondary/30 transition-all duration-150"
      >
        <Upload className="w-4 h-4" />
         {label}
      </button>
    </div>
  );
};

export default SettingsImportExport;