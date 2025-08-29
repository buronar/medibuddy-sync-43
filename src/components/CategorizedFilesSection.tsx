import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Edit3,
  Image,
  FileType
} from "lucide-react";
import { useFiles, FileCategory, AttachedFile } from "@/contexts/FilesContext";
import { useToast } from "@/hooks/use-toast";
import { CategorizedFileUpload } from "./CategorizedFileUpload";

interface CategorizedFilesSectionProps {
  consultationId: string;
}

const categoryLabels: Record<FileCategory, string> = {
  receita: 'Receitas',
  exame: 'Exames',
  laudo: 'Laudos',
  solicitacao: 'Solicitações',
  outro: 'Outros'
};

const categoryColors: Record<FileCategory, string> = {
  receita: 'bg-green-100 text-green-800',
  exame: 'bg-blue-100 text-blue-800',
  laudo: 'bg-purple-100 text-purple-800',
  solicitacao: 'bg-orange-100 text-orange-800',
  outro: 'bg-gray-100 text-gray-800'
};

export const CategorizedFilesSection = ({ consultationId }: CategorizedFilesSectionProps) => {
  const { getFilesByConsultation, getFilesByCategory, deleteFile, updateFile } = useFiles();
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all');
  const [editingFile, setEditingFile] = useState<AttachedFile | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<FileCategory>('outro');

  const allFiles = getFilesByConsultation(consultationId);
  const displayFiles = selectedCategory === 'all' 
    ? allFiles 
    : getFilesByCategory(consultationId, selectedCategory);

  const categoryCounts = Object.keys(categoryLabels).reduce((acc, category) => {
    acc[category as FileCategory] = getFilesByCategory(consultationId, category as FileCategory).length;
    return acc;
  }, {} as Record<FileCategory, number>);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: AttachedFile) => {
    const type = file.type.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(type)) {
      return <Image className="h-4 w-4 text-primary" />;
    }
    if (type === 'pdf') {
      return <FileType className="h-4 w-4 text-red-600" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const handleDownloadFile = (file: AttachedFile) => {
    toast({
      title: "Download iniciado",
      description: `Simulando download de ${file.name}`,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    deleteFile(fileId);
    toast({
      title: "Arquivo excluído",
      description: "O arquivo foi removido com sucesso.",
    });
  };

  const handleEditFile = (file: AttachedFile) => {
    setEditingFile(file);
    setNewFileName(file.name.split('.')[0]); // Remove extension for editing
    setNewFileCategory(file.category);
  };

  const handleSaveEdit = () => {
    if (!editingFile) return;

    const fileExtension = editingFile.name.split('.').pop();
    const updatedName = `${newFileName}.${fileExtension}`;

    updateFile(editingFile.id, {
      name: updatedName,
      category: newFileCategory
    });

    toast({
      title: "Arquivo atualizado",
      description: "As alterações foram salvas com sucesso.",
    });

    setEditingFile(null);
    setNewFileName('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Arquivos Anexados ({allFiles.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Anexar Arquivo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showUpload && (
          <CategorizedFileUpload
            consultationId={consultationId}
            onUploadComplete={() => setShowUpload(false)}
          />
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="h-8"
          >
            Todos ({allFiles.length})
          </Button>
          {Object.entries(categoryLabels).map(([category, label]) => {
            const count = categoryCounts[category as FileCategory];
            if (count === 0) return null;
            
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category as FileCategory)}
                className="h-8"
              >
                {label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Files List */}
        {displayFiles.length > 0 ? (
          <div className="space-y-3">
            {displayFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <Badge variant="secondary" className={`text-xs ${categoryColors[file.category]}`}>
                      {categoryLabels[file.category].slice(0, -1)} {/* Remove 's' from plural */}
                    </Badge>
                    <span>{formatDate(file.uploadDate)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditFile(file)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadFile(file)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteFile(file.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              {selectedCategory === 'all' 
                ? 'Nenhum arquivo anexado a esta consulta'
                : `Nenhum arquivo na categoria ${categoryLabels[selectedCategory as FileCategory]}`
              }
            </p>
          </div>
        )}

        {/* Edit File Dialog */}
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Arquivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome do arquivo</label>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="Nome do arquivo"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Select value={newFileCategory} onValueChange={(value: FileCategory) => setNewFileCategory(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label.slice(0, -1)} {/* Remove 's' from plural */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingFile(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};