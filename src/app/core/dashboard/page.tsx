"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, PlusCircle, Edit, Trash2, Loader2, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getProjects, deleteProject, Project } from '@/services/projects';
import ProjectForm from '@/components/core/ProjectForm';


export default function CoreDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const projectsFromDb = await getProjects();
      setProjects(projectsFromDb);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar proyectos",
        description: "No se pudieron cargar los proyectos desde la base de datos.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectSaved = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    fetchProjects();
     toast({
      title: "Proyecto guardado",
      description: "Tu proyecto se ha guardado correctamente.",
    });
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  }
  
  const handleAddNew = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  }

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      fetchProjects();
      toast({
        title: "Proyecto eliminado",
        description: "El proyecto se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el proyecto.",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1631] via-[#2a234f] to-[#1a1631]"></div>
      
      <header className="z-10 w-full max-w-7xl flex justify-between items-center py-4 px-4">
        <h1 className="font-headline text-3xl text-primary">CORE Dashboard</h1>
        <Button asChild variant="ghost">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <LogOut className="h-4 w-4" />
            <span>Salir</span>
          </Link>
        </Button>
      </header>

      <main className="z-10 flex-1 w-full max-w-7xl py-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">Gestionar Contenido</CardTitle>
          </CardHeader>
          <CardContent>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Proyectos y Blog</CardTitle>
                  </div>
                   <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                     setIsDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingProject(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Nuevo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
                      </DialogHeader>
                      <ProjectForm project={editingProject} onSave={handleProjectSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Blog</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects.map((project) => (
                          <TableRow key={project.id}>
                             <TableCell>
                              {project.isFeatured && <Star className="h-4 w-4 text-primary" />}
                            </TableCell>
                            <TableCell className="font-medium">{project.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{project.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                               <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(project.id!)}>Eliminar</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
