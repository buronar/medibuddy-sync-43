import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { useFiles, FileCategory } from "@/contexts/FilesContext";
import { useToast } from "@/hooks/use-toast";

interface CategorizedFileUploadProps {
  consultationId: string;
  onUploadComplete?: () => void;
}

const categoryLabels: Record<FileCategory, string> = {
  receita: 'Receita',
  exame: 'Exame',
  laudo: 'Laudo',
  solicitacao: 'Solicitação',
  outro: 'Outro'
};

export const CategorizedFileUpload = ({ 
  consultationId, 
  onUploadComplete 
}: CategorizedFileUploadProps) => {
  const { addFile } = useFiles();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('outro');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!acceptedTypes.includes(fileExtension)) {
        invalidFiles.push(`${file.name} (tipo não suportado)`);
        return;
      }

      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (arquivo muito grande)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Alguns arquivos não foram aceitos",
        description: invalidFiles.join(', '),
        variant: "destructive",
      });
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const simulateUpload = async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    return `https://simulated-storage.example.com/files/${consultationId}/${file.name}`;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of selectedFiles) {
        const simulatedUrl = await simulateUpload(file);
        
        const attachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
          size: file.size,
          url: simulatedUrl,
          uploadDate: new Date(),
          consultationId,
          category: selectedCategory
        };

        addFile(attachedFile);
      }

      toast({
        title: "Upload concluído",
        description: `${selectedFiles.length} arquivo(s) anexado(s) em ${categoryLabels[selectedCategory]}.`,
      });

      setSelectedFiles([]);
      onUploadComplete?.();
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Houve um problema ao anexar os arquivos.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="space-y-3">
        <div>
          <Label htmlFor="category-select" className="text-sm font-medium">
            Categoria do arquivo
          </Label>
          <Select value={selectedCategory} onValueChange={(value: FileCategory) => setSelectedCategory(value)}>
            <SelectTrigger id="category-select" className="mt-1">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Upload className="h-8 w-8 text-primary mx-auto mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium">
                  Clique para selecionar arquivos
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG até 10MB
                </p>
              </Label>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Arquivos selecionados ({selectedFiles.length})
            </h4>
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Enviar Arquivos'}
            </Button>
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg"
              >
                <FileText className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {categoryLabels[selectedCategory]}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(index)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p>
              Os arquivos serão categorizados como <strong>{categoryLabels[selectedCategory]}</strong> e 
              anexados a esta consulta.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};