
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { uploadImage, getImages, deleteImage, addImageByUrl, ImageData } from "@/services/images";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UploadCloud, Trash2, Clipboard, Link as LinkIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await getImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar imágenes",
        description: "No se pudieron cargar las imágenes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadImage(file);
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
      });
      fetchImages(); // Refresh the gallery
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error al subir",
        description: "No se pudo subir la imagen.",
      });
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleAddFromUrl = async () => {
    if (!imageUrl) {
        toast({ variant: "destructive", title: "URL vacía", description: "Por favor, introduce una URL." });
        return;
    }
    setIsUploading(true);
    try {
        await addImageByUrl(imageUrl);
        toast({ title: "Imagen añadida", description: "La imagen se ha añadido desde la URL." });
        fetchImages();
        setImageUrl("");
    } catch (error) {
        console.error("Error adding image from URL:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo añadir la imagen desde la URL. Asegúrate de que la URL es válida y accesible." });
    } finally {
        setIsUploading(false);
        setIsUrlDialogOpen(false);
    }
  };

  const handleDelete = async (image: ImageData) => {
    try {
      await deleteImage(image);
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada.",
      });
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar la imagen.",
      });
    }
  };
  
  const handleCopyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copiada",
      description: "La URL de la imagen se ha copiado al portapapeles.",
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div 
                className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:bg-background/50 transition-colors"
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <Input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    disabled={isUploading}
                />
                {isUploading && !imageUrl ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span>Subiendo imagen...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="w-8 h-8" />
                        <span>Haz clic o arrastra para subir una imagen</span>
                        <span className="text-xs">PNG, JPG, GIF, WEBP</span>
                    </div>
                )}
            </div>
             <div className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 flex flex-col justify-center">
                 <p className="text-center text-muted-foreground mb-2">O añade desde una URL</p>
                 <div className="flex gap-2">
                     <Input 
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="bg-background/50"
                        disabled={isUploading}
                     />
                    <AlertDialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button disabled={!imageUrl || isUploading}>Añadir</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Confirmar imagen desde URL?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Se añadirá la siguiente imagen a tu galería. Asegúrate de que la URL es correcta.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            {imageUrl && (
                                <div className="relative w-full h-48 mt-4 rounded-md overflow-hidden border">
                                    <Image src={imageUrl} alt="Vista previa de la URL" layout="fill" objectFit="contain" />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAddFromUrl} disabled={isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Añadir Imagen
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                 </div>
            </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : images.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay imágenes en la galería. ¡Sube la primera!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                   <p className="text-white text-xs truncate">{image.name}</p>
                   <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 hover:text-white" onClick={() => handleCopyToClipboard(image.url)}>
                            <Clipboard className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/50 hover:text-white">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la imagen.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(image)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    