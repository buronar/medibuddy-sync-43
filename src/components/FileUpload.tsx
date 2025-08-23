import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileItem, FileType } from "@/components/FileGallery";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video,
  X,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface UploadedFile extends FileItem {
  file: File;
}

interface FileUploadProps {
  onFileUploaded: (file: UploadedFile) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const acceptedTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'video/mp4': ['.mp4']
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): FileType | null => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type === 'video/mp4') return 'video';
    return null;
  };

  const validateFile = (file: File): boolean => {
    const fileType = getFileType(file);
    if (!fileType) return false;
    
    const isValidType = Object.keys(acceptedTypes).includes(file.type);
    return isValidType;
  };

  const simulateUpload = async (file: File): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500 + Math.random() * 1000); // 1.5-2.5s
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (!validateFile(file)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Apenas arquivos JPG, PNG, PDF e MP4 são aceitos.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      await simulateUpload(file);

      const fileType = getFileType(file)!;
      let thumbnail: string | undefined;

      // Criar thumbnail para imagens e vídeos
      if (fileType === 'image' || fileType === 'video') {
        thumbnail = URL.createObjectURL(file);
      }

      const uploadedFile: UploadedFile = {
        id: Date.now() + Math.random(),
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extensão
        type: fileType,
        uploadDate: new Date().toISOString().split('T')[0],
        thumbnail,
        size: formatFileSize(file.size),
        file
      };

      onFileUploaded(uploadedFile);

      toast({
        title: "Arquivo enviado com sucesso!",
        description: `${file.name} foi adicionado à sua galeria.`,
      });

    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Houve um problema ao enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (isUploading) {
    return (
      <Card className="p-8 text-center border-dashed border-2 border-primary">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="font-inter font-semibold text-lg text-foreground">
              Enviando arquivo...
            </h3>
            <p className="text-muted-foreground">
              Aguarde enquanto processamos seu arquivo.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-8 text-center border-dashed border-2 transition-colors ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-inter font-semibold text-lg text-foreground">
            Envie seus arquivos médicos
          </h3>
          <p className="text-muted-foreground max-w-md">
            Arraste e solte ou clique para selecionar arquivos JPG, PNG, PDF ou MP4.
          </p>
        </div>

        <Button 
          onClick={handleButtonClick}
          className="font-inter"
          size="lg"
        >
          <Upload className="mr-2 h-4 w-4" />
          Selecionar Arquivo
        </Button>

        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <ImageIcon className="h-4 w-4" />
            <span>Imagens</span>
          </div>
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>PDFs</span>
          </div>
          <div className="flex items-center space-x-1">
            <Video className="h-4 w-4" />
            <span>Vídeos</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.mp4"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </Card>
  );
};