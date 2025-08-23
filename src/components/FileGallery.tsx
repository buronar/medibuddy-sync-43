import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Play, 
  Calendar,
  FolderOpen,
  Trash2
} from "lucide-react";

export type FileType = "image" | "pdf" | "video";

export interface FileItem {
  id: number;
  name: string;
  type: FileType;
  uploadDate: string;
  thumbnail?: string;
  size?: string;
}

interface FileGalleryProps {
  files?: FileItem[];
  onDeleteFile?: (fileId: number) => void;
}

// Mock data para demonstração
const mockFiles: FileItem[] = [
  {
    id: 1,
    name: "Exame de Sangue - Hemograma",
    type: "pdf",
    uploadDate: "2024-01-20",
    size: "2.3 MB"
  },
  {
    id: 2,
    name: "Radiografia Tórax",
    type: "image",
    uploadDate: "2024-01-18",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    size: "1.8 MB"
  },
  {
    id: 3,
    name: "Receita Cardiologista",
    type: "pdf",
    uploadDate: "2024-01-15",
    size: "850 KB"
  },
  {
    id: 4,
    name: "Ultrassom Abdominal",
    type: "video",
    uploadDate: "2024-01-12",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    size: "15.2 MB"
  },
  {
    id: 5,
    name: "Ressonância Magnética",
    type: "image",
    uploadDate: "2024-01-10",
    thumbnail: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
    size: "3.4 MB"
  },
  {
    id: 6,
    name: "Laudo Oftalmológico",
    type: "pdf",
    uploadDate: "2024-01-08",
    size: "1.2 MB"
  },
  {
    id: 7,
    name: "Ecocardiograma",
    type: "video",
    uploadDate: "2024-01-05",
    thumbnail: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=300&fit=crop",
    size: "22.8 MB"
  },
  {
    id: 8,
    name: "Tomografia Computadorizada",
    type: "image",
    uploadDate: "2024-01-03",
    thumbnail: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
    size: "4.1 MB"
  }
];

const EmptyState = () => (
  <Card className="p-12 text-center border-dashed border-2 border-muted col-span-full">
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-accent rounded-full">
        <FolderOpen className="h-12 w-12 text-accent-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="font-inter font-semibold text-lg text-foreground">
          Nenhum arquivo encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Você ainda não possui arquivos salvos. Comece fazendo upload de seus exames, receitas e documentos médicos.
        </p>
      </div>
    </div>
  </Card>
);

const EmptySection = ({ type }: { type: FileType }) => {
  const messages = {
    image: "Nenhuma imagem enviada ainda.",
    pdf: "Nenhum PDF enviado ainda.",
    video: "Nenhum vídeo enviado ainda."
  };

  return (
    <div className="col-span-full p-8 text-center text-muted-foreground">
      <p>{messages[type]}</p>
    </div>
  );
};

const FileCard = ({ file, onDelete }: { file: FileItem; onDelete?: (fileId: number) => void }) => {
  const { toast } = useToast();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-primary" />;
      case "pdf":
        return <FileText className="h-5 w-5 text-destructive" />;
      case "video":
        return <Video className="h-5 w-5 text-secondary" />;
    }
  };

  const getTypeColor = (type: FileType) => {
    switch (type) {
      case "image":
        return "bg-primary/10 text-primary";
      case "pdf":
        return "bg-destructive/10 text-destructive";
      case "video":
        return "bg-secondary/10 text-secondary";
    }
  };

  return (
    <Card className="group transition-all duration-200 hover:shadow-md overflow-hidden">
      <div className="aspect-square relative bg-muted/30">
        {file.type === "image" && file.thumbnail ? (
          <img 
            src={file.thumbnail} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : file.type === "video" && file.thumbnail ? (
          <div className="relative w-full h-full">
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="p-3 bg-white/90 rounded-full">
                <Play className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 bg-background rounded-full border">
              {getFileIcon(file.type)}
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className={`text-xs ${getTypeColor(file.type)}`}>
            {file.type.toUpperCase()}
          </Badge>
        </div>

        {/* Botão de delete - aparece no hover */}
        {onDelete && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file.id);
                toast({
                  title: "Arquivo removido",
                  description: "Arquivo removido com sucesso",
                });
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-inter font-medium text-sm text-foreground line-clamp-2 leading-tight">
            {file.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(file.uploadDate)}</span>
            </div>
            {file.size && (
              <span className="font-mono">{file.size}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FileGallery = ({ files = mockFiles, onDeleteFile }: FileGalleryProps) => {
  // Ordenar arquivos por data (mais recente primeiro)
  const sortedFiles = [...files].sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  // Agrupar arquivos por tipo
  const groupedFiles = {
    image: sortedFiles.filter(file => file.type === "image"),
    pdf: sortedFiles.filter(file => file.type === "pdf"),
    video: sortedFiles.filter(file => file.type === "video")
  };

  const sectionTitles = {
    image: "Imagens",
    pdf: "PDFs", 
    video: "Vídeos"
  };

  const sectionIcons = {
    image: <ImageIcon className="h-5 w-5" />,
    pdf: <FileText className="h-5 w-5" />,
    video: <Video className="h-5 w-5" />
  };

  // Se não há arquivos, mostrar estado vazio
  if (sortedFiles.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(Object.keys(groupedFiles) as FileType[]).map((type) => {
        const filesOfType = groupedFiles[type];
        
        return (
          <div key={type} className="space-y-4">
            {/* Título da seção */}
            <div className="flex items-center gap-2">
              {sectionIcons[type]}
              <h2 className="font-inter font-semibold text-lg text-foreground">
                {sectionTitles[type]}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {filesOfType.length}
              </Badge>
            </div>

            {/* Grid de arquivos ou estado vazio */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filesOfType.length === 0 ? (
                <EmptySection type={type} />
              ) : (
                filesOfType.map((file) => (
                  <FileCard 
                    key={file.id} 
                    file={file} 
                    onDelete={onDeleteFile}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};