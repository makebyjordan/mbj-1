
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, PlusCircle, Edit, Trash2, Loader2, Star, Youtube, Link2 } from "lucide-react";
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
  DialogDescription,
} from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getProjects, deleteProject, Project } from '@/services/projects';
import { getServices, deleteService, Service } from '@/services/services';
import { getFormations, deleteFormation, Formation } from '@/services/formation';
import { getShorts, deleteShort, Short } from '@/services/shorts';
import { getLinks, deleteLink, LinkItem } from '@/services/links';
import ProjectForm from '@/components/core/ProjectForm';
import ServiceForm from '@/components/core/ServiceForm';
import FormationForm from '@/components/core/FormationForm';
import ShortForm from '@/components/core/ShortForm';
import LinkForm from '@/components/core/LinkForm';
import ImageGallery from '@/components/core/ImageGallery';
import HeroForm from '@/components/core/HeroForm';
import AboutForm from '@/components/core/AboutForm';
import { Badge } from '@/components/ui/badge';

export default function CoreDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingFormations, setIsLoadingFormations] = useState(true);
  const [isLoadingShorts, setIsLoadingShorts] = useState(true);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isFormationDialogOpen, setIsFormationDialogOpen] = useState(false);
  const [isShortDialogOpen, setIsShortDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [editingShort, setEditingShort] = useState<Short | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const projectsFromDb = await getProjects();
      setProjects(projectsFromDb);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar proyectos",
        description: "No se pudieron cargar los proyectos.",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const servicesFromDb = await getServices();
      setServices(servicesFromDb);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar servicios",
        description: "No se pudieron cargar los servicios.",
      });
    } finally {
      setIsLoadingServices(false);
    }
  }

  const fetchFormations = async () => {
    setIsLoadingFormations(true);
    try {
      const formationsFromDb = await getFormations();
      setFormations(formationsFromDb);
    } catch (error) {
      console.error("Error fetching formations:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar formaciones",
        description: "No se pudieron cargar las formaciones.",
      });
    } finally {
      setIsLoadingFormations(false);
    }
  }

  const fetchShorts = async () => {
    setIsLoadingShorts(true);
    try {
      const shortsFromDb = await getShorts();
      setShorts(shortsFromDb);
    } catch (error) {
      console.error("Error fetching shorts:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar shorts",
        description: "No se pudieron cargar los shorts.",
      });
    } finally {
      setIsLoadingShorts(false);
    }
  }
  
  const fetchLinks = async () => {
    setIsLoadingLinks(true);
    try {
      const linksFromDb = await getLinks();
      setLinks(linksFromDb);
    } catch (error) {
      console.error("Error fetching links:", error);
      toast({
        variant: "destructive",
        title: "Error al cargar enlaces",
        description: "No se pudieron cargar los enlaces.",
      });
    } finally {
      setIsLoadingLinks(false);
    }
  }

  useEffect(() => {
    fetchProjects();
    fetchServices();
    fetchFormations();
    fetchShorts();
    fetchLinks();
  }, []);

  const handleProjectSaved = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    fetchProjects();
     toast({
      title: "Proyecto guardado",
      description: "Tu proyecto se ha guardado correctamente.",
    });
  }

  const handleServiceSaved = () => {
    setIsServiceDialogOpen(false);
    setEditingService(null);
    fetchServices();
     toast({
      title: "Servicio guardado",
      description: "Tu servicio se ha guardado correctamente.",
    });
  }

  const handleFormationSaved = () => {
    setIsFormationDialogOpen(false);
    setEditingFormation(null);
    fetchFormations();
     toast({
      title: "Formación guardada",
      description: "Tu formación se ha guardado correctamente.",
    });
  }
  
  const handleShortSaved = () => {
    setIsShortDialogOpen(false);
    setEditingShort(null);
    fetchShorts();
     toast({
      title: "Short guardado",
      description: "Tu short se ha guardado correctamente.",
    });
  }

  const handleLinkSaved = () => {
    setIsLinkDialogOpen(false);
    setEditingLink(null);
    fetchLinks();
     toast({
      title: "Enlace guardado",
      description: "Tu enlace se ha guardado correctamente.",
    });
  }

  const handleGenericSave = (title: string, description: string) => {
    toast({
     title: title,
     description: description,
   });
 }

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  }
  
  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsProjectDialogOpen(true);
  }
  
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceDialogOpen(true);
  }
  
  const handleAddNewService = () => {
    setEditingService(null);
    setIsServiceDialogOpen(true);
  }

  const handleEditFormation = (formation: Formation) => {
    setEditingFormation(formation);
    setIsFormationDialogOpen(true);
  }

  const handleAddNewFormation = () => {
    setEditingFormation(null);
    setIsFormationDialogOpen(true);
  }
  
  const handleEditShort = (short: Short) => {
    setEditingShort(short);
    setIsShortDialogOpen(true);
  }

  const handleAddNewShort = () => {
    setEditingShort(null);
    setIsShortDialogOpen(true);
  }

  const handleEditLink = (link: LinkItem) => {
    setEditingLink(link);
    setIsLinkDialogOpen(true);
  }

  const handleAddNewLink = () => {
    setEditingLink(null);
    setIsLinkDialogOpen(true);
  }

  const handleDeleteProject = async (projectId: string) => {
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

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      fetchServices();
      toast({
        title: "Servicio eliminado",
        description: "El servicio se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el servicio.",
      });
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    try {
      await deleteFormation(formationId);
      fetchFormations();
      toast({
        title: "Formación eliminada",
        description: "La formación se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting formation:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar la formación.",
      });
    }
  };
  
  const handleDeleteShort = async (shortId: string) => {
    try {
      await deleteShort(shortId);
      fetchShorts();
      toast({
        title: "Short eliminado",
        description: "El short se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting short:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el short.",
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      fetchLinks();
      toast({
        title: "Enlace eliminado",
        description: "El enlace se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error deleting link:", error);
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar el enlace.",
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

      <main className="z-10 flex-1 w-full max-w-7xl py-8 space-y-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-headline text-4xl">Gestionar Contenido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
              <Card>
                <CardHeader>
                    <CardTitle>Gestionar Hero</CardTitle>
                </CardHeader>
                <CardContent>
                    <HeroForm onSave={() => handleGenericSave("Hero Actualizado", "La sección principal se ha guardado correctamente.")} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>Gestionar "Sobre Mí"</CardTitle>
                </CardHeader>
                <CardContent>
                    <AboutForm onSave={() => handleGenericSave("Sección 'Sobre Mí' Actualizada", "La sección se ha guardado correctamente.")} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Servicios ("Lo que hago")</CardTitle>
                   <Dialog open={isServiceDialogOpen} onOpenChange={(isOpen) => {
                     setIsServiceDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingService(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewService}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Servicio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingService ? 'Edita los detalles de tu servicio aquí.' : 'Crea un nuevo servicio para mostrar en tu página.'}
                        </DialogDescription>
                      </DialogHeader>
                      <ServiceForm service={editingService} onSave={handleServiceSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingServices ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Icono</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                             <TableCell>
                               {service.iconUrl && <img src={service.iconUrl} alt={service.title} className="w-8 h-8" />}
                            </TableCell>
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{service.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteService(service.id!)}>Eliminar</AlertDialogAction>
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
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Proyectos y Blog</CardTitle>
                  </div>
                   <Dialog open={isProjectDialogOpen} onOpenChange={(isOpen) => {
                     setIsProjectDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingProject(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewProject}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Nuevo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
                         <DialogDescription className="sr-only">
                            {editingProject ? 'Edita los detalles de tu proyecto o entrada de blog aquí.' : 'Crea un nuevo proyecto o entrada de blog.'}
                        </DialogDescription>
                      </DialogHeader>
                      <ProjectForm project={editingProject} onSave={handleProjectSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingProjects ? (
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
                              <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
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
                                    <AlertDialogAction onClick={() => handleDeleteProject(project.id!)}>Eliminar</AlertDialogAction>
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Formación</CardTitle>
                   <Dialog open={isFormationDialogOpen} onOpenChange={(isOpen) => {
                     setIsFormationDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingFormation(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewFormation}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Formación
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingFormation ? 'Editar Formación' : 'Crear Nueva Formación'}</DialogTitle>
                         <DialogDescription className="sr-only">
                            {editingFormation ? 'Edita los detalles de tu formación aquí.' : 'Crea una nueva entrada de formación.'}
                        </DialogDescription>
                      </DialogHeader>
                      <FormationForm formation={editingFormation} onSave={handleFormationSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingFormations ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {formations.map((formation) => (
                          <TableRow key={formation.id}>
                            <TableCell className="font-medium">{formation.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{formation.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditFormation(formation)}>
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente la formación.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteFormation(formation.id!)}>Eliminar</AlertDialogAction>
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

               <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Enlaces de Interés</CardTitle>
                   <Dialog open={isLinkDialogOpen} onOpenChange={(isOpen) => {
                     setIsLinkDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingLink(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewLink}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Enlace
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingLink ? 'Editar Enlace' : 'Crear Nuevo Enlace'}</DialogTitle>
                         <DialogDescription className="sr-only">
                            {editingLink ? 'Edita los detalles de tu enlace aquí.' : 'Crea un nuevo enlace.'}
                        </DialogDescription>
                      </DialogHeader>
                      <LinkForm link={editingLink} onSave={handleLinkSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingLinks ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Icon</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Etiqueta</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {links.map((link) => (
                          <TableRow key={link.id}>
                             <TableCell>
                              <Link2 className="h-4 w-4 text-primary" />
                            </TableCell>
                            <TableCell className="font-medium">{link.title}</TableCell>
                            <TableCell><Badge variant="secondary">{link.tag}</Badge></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditLink(link)}>
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el enlace.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteLink(link.id!)}>Eliminar</AlertDialogAction>
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

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>YouTube Shorts</CardTitle>
                   <Dialog open={isShortDialogOpen} onOpenChange={(isOpen) => {
                     setIsShortDialogOpen(isOpen);
                     if (!isOpen) {
                       setEditingShort(null);
                     }
                   }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewShort}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Short
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingShort ? 'Editar Short' : 'Crear Nuevo Short'}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingShort ? 'Edita los detalles de tu short aquí.' : 'Añade un nuevo short a tu colección.'}
                        </DialogDescription>
                      </DialogHeader>
                      <ShortForm short={editingShort} onSave={handleShortSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingShorts ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Icono</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Etiquetas</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shorts.map((short) => (
                          <TableRow key={short.id}>
                             <TableCell>
                              <Youtube className="h-6 w-6 text-red-600" />
                            </TableCell>
                            <TableCell className="font-medium">{short.title}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[250px]">
                                {short.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditShort(short)}>
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
                                      Esta acción no se puede deshacer. Esto eliminará permanentemente el short.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteShort(short.id!)}>Eliminar</AlertDialogAction>
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
        
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="font-headline text-4xl">Galería de Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
                <ImageGallery />
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
