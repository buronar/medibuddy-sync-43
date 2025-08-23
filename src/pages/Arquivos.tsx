import { useState } from "react";
import { FileGallery, type FileItem } from "@/components/FileGallery";
import { FileUpload } from "@/components/FileUpload";

const Arquivos = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);

  const handleDeleteFile = (fileId: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <>
      {/* Upload de Arquivos */}
      <FileUpload onFileUploaded={(file) => setUploadedFiles(prev => [file, ...prev])} />

      {/* Galeria de Arquivos */}
      <FileGallery files={uploadedFiles} onDeleteFile={handleDeleteFile} />
    </>
  );
};

export default Arquivos;