/**
 * Navegador de Mídia do Dropbox
 * Permite buscar e selecionar imagens/vídeos do Dropbox
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Folder,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  Loader2,
  Search,
  RefreshCw,
  Check,
  AlertCircle,
  CloudOff,
} from "lucide-react";
import { toast } from "sonner";

interface DropboxFile {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  isImage: boolean;
  isVideo: boolean;
  thumbnailUrl?: string;
  size?: number;
  modifiedAt?: string;
}

interface DropboxMediaBrowserProps {
  onSelect?: (files: DropboxFile[]) => void;
  multiple?: boolean;
  acceptTypes?: ("image" | "video")[];
}

export function DropboxMediaBrowser({
  onSelect,
  multiple = false,
  acceptTypes = ["image", "video"],
}: DropboxMediaBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<DropboxFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<DropboxFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Check if Dropbox is connected
  const checkConnection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("dropbox-list", {
        body: { path: "", action: "check" },
      });

      if (error) throw error;

      setIsConnected(data?.connected || false);
      if (data?.connected) {
        await fetchFiles("");
      }
    } catch (err) {
      console.error("Error checking Dropbox connection:", err);
      setIsConnected(false);
      setError("Dropbox não está configurado. Adicione o DROPBOX_ACCESS_TOKEN nas configurações.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch files from Dropbox
  const fetchFiles = async (path: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("dropbox-list", {
        body: { path, action: "list" },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const formattedFiles: DropboxFile[] = (data?.entries || []).map((entry: any) => {
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(entry.name);
        const isVideo = /\.(mp4|mov|avi|webm|mkv)$/i.test(entry.name);
        
        return {
          id: entry.id,
          name: entry.name,
          path: entry.path_display || entry.path_lower,
          type: entry[".tag"] === "folder" ? "folder" : "file",
          isImage,
          isVideo,
          thumbnailUrl: entry.thumbnail_url,
          size: entry.size,
          modifiedAt: entry.client_modified,
        };
      });

      // Filter by accepted types
      const filtered = formattedFiles.filter((f) => {
        if (f.type === "folder") return true;
        if (acceptTypes.includes("image") && f.isImage) return true;
        if (acceptTypes.includes("video") && f.isVideo) return true;
        return false;
      });

      setFiles(filtered);
      setCurrentPath(path);
    } catch (err) {
      console.error("Error fetching Dropbox files:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar arquivos do Dropbox");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to folder
  const navigateToFolder = (path: string) => {
    fetchFiles(path);
  };

  // Go back to parent folder
  const goBack = () => {
    const parentPath = currentPath.split("/").slice(0, -1).join("/");
    fetchFiles(parentPath);
  };

  // Toggle file selection
  const toggleFileSelection = (file: DropboxFile) => {
    if (file.type === "folder") {
      navigateToFolder(file.path);
      return;
    }

    if (multiple) {
      setSelectedFiles((prev) => {
        const isSelected = prev.some((f) => f.id === file.id);
        if (isSelected) {
          return prev.filter((f) => f.id !== file.id);
        }
        return [...prev, file];
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  // Confirm selection
  const confirmSelection = () => {
    if (onSelect && selectedFiles.length > 0) {
      onSelect(selectedFiles);
    }
    setIsOpen(false);
    setSelectedFiles([]);
  };

  // Search files
  const filteredFiles = searchTerm
    ? files.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : files;

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Cloud className="h-4 w-4" />
          Buscar no Dropbox
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            Navegador do Dropbox
          </DialogTitle>
          <DialogDescription>
            Navegue e selecione arquivos do Dropbox para usar no produto
          </DialogDescription>
        </DialogHeader>

        {!isConnected && !isLoading ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CloudOff className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Dropbox não conectado</p>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                Para usar esta funcionalidade, configure o token de acesso do Dropbox
                nas configurações do sistema.
              </p>
              {error && (
                <Badge variant="destructive" className="mt-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {error}
                </Badge>
              )}
              <Button variant="outline" className="mt-4" onClick={checkConnection}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Navigation & Search */}
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                disabled={!currentPath || isLoading}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar arquivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => fetchFiles(currentPath)}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Current Path */}
            <div className="text-sm text-muted-foreground mb-2">
              <span className="font-medium">Pasta:</span> {currentPath || "/"}
            </div>

            {/* Files Grid */}
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Folder className="h-12 w-12 mb-2 opacity-50" />
                  <p>Nenhum arquivo encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFiles.some((f) => f.id === file.id);
                    
                    return (
                      <div
                        key={file.id}
                        className={`relative border rounded-lg p-2 cursor-pointer transition-all hover:border-primary/50 ${
                          isSelected ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                        onClick={() => toggleFileSelection(file)}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        
                        <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden mb-2">
                          {file.type === "folder" ? (
                            <Folder className="h-10 w-10 text-blue-500" />
                          ) : file.thumbnailUrl ? (
                            <img
                              src={file.thumbnailUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : file.isImage ? (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          ) : (
                            <Video className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>
                        
                        <p className="text-xs font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        {file.size && (
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Selection Info */}
            {selectedFiles.length > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length} arquivo(s) selecionado(s)
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedFiles([])}>
                    Limpar
                  </Button>
                  <Button onClick={confirmSelection}>
                    Usar Selecionados
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
