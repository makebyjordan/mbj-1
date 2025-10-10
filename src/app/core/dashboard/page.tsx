
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Star, Youtube, Link2, Folder, Image as ImageIcon, FileCode, Briefcase, Library, Terminal, Palette, BookOpen, Copy } from "lucide-react";
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
import { getLinkCards, deleteLinkCard, LinkCard } from '@/services/link-cards';
import { getBlogCategories, deleteBlogCategory, BlogCategory } from '@/services/blog-categories';
import { getPrompts, deletePrompt, Prompt } from '@/services/prompts';
import { getDesigns, deleteDesign, Design } from '@/services/designs';
import { getN8NTemplates, deleteN8NTemplate, N8NTemplate } from '@/services/n8n-templates';

import ProjectForm from '@/components/core/ProjectForm';
import ServiceForm from '@/components/core/ServiceForm';
import FormationForm from '@/components/core/FormationForm';
import ShortForm from '@/components/core/ShortForm';
import LinkForm from '@/components/core/LinkForm';
import LinkCardForm from '@/components/core/LinkCardForm';
import BlogCategoryForm from '@/components/core/BlogCategoryForm';
import PromptForm from '@/components/core/PromptForm';
import ImageGallery from '@/components/core/ImageGallery';
import HeroForm from '@/components/core/HeroForm';
import AboutForm from '@/components/core/AboutForm';
import DesignForm from '@/components/core/DesignForm';
import N8NTemplateForm from '@/components/core/N8NTemplateForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoreDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [linkCards, setLinkCards] = useState<LinkCard[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [n8nTemplates, setN8nTemplates] = useState<N8NTemplate[]>([]);
  
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingFormations, setIsLoadingFormations] = useState(true);
  const [isLoadingShorts, setIsLoadingShorts] = useState(true);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isLoadingLinkCards, setIsLoadingLinkCards] = useState(true);
  const [isLoadingBlogCategories, setIsLoadingBlogCategories] = useState(true);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true);
  const [isLoadingN8nTemplates, setIsLoadingN8nTemplates] = useState(true);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isFormationDialogOpen, setIsFormationDialogOpen] = useState(false);
  const [isShortDialogOpen, setIsShortDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isLinkCardDialogOpen, setIsLinkCardDialogOpen] = useState(false);
  const [isBlogCategoryDialogOpen, setIsBlogCategoryDialogOpen] = useState(false);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [isDesignDialogOpen, setIsDesignDialogOpen] = useState(false);
  const [isN8nTemplateDialogOpen, setIsN8nTemplateDialogOpen] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [editingShort, setEditingShort] = useState<Short | null>(null);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editingLinkCard, setEditingLinkCard] = useState<LinkCard | null>(null);
  const [editingBlogCategory, setEditingBlogCategory] = useState<BlogCategory | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [editingN8nTemplate, setEditingN8nTemplate] = useState<N8NTemplate | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const projectsFromDb = await getProjects();
      setProjects(projectsFromDb);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({ variant: "destructive", title: "Error al cargar proyectos", description: "No se pudieron cargar los proyectos." });
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
      toast({ variant: "destructive", title: "Error al cargar servicios", description: "No se pudieron cargar los servicios." });
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
      toast({ variant: "destructive", title: "Error al cargar formaciones", description: "No se pudieron cargar las formaciones." });
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
      toast({ variant: "destructive", title: "Error al cargar shorts", description: "No se pudieron cargar los shorts." });
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
      toast({ variant: "destructive", title: "Error al cargar enlaces", description: "No se pudieron cargar los enlaces." });
    } finally {
      setIsLoadingLinks(false);
    }
  }

  const fetchLinkCards = async () => {
    setIsLoadingLinkCards(true);
    try {
      const linkCardsFromDb = await getLinkCards();
      setLinkCards(linkCardsFromDb);
    } catch (error) {
      console.error("Error fetching link cards:", error);
      toast({ variant: "destructive", title: "Error al cargar categorías de enlaces", description: "No se pudieron cargar las categorías de enlaces." });
    } finally {
      setIsLoadingLinkCards(false);
    }
  }

  const fetchBlogCategories = async () => {
    setIsLoadingBlogCategories(true);
    try {
      const categoriesFromDb = await getBlogCategories();
      setBlogCategories(categoriesFromDb);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
      toast({ variant: "destructive", title: "Error al cargar categorías de blog", description: "No se pudieron cargar las categorías de blog." });
    } finally {
      setIsLoadingBlogCategories(false);
    }
  }

   const fetchPrompts = async () => {
    setIsLoadingPrompts(true);
    try {
      const promptsFromDb = await getPrompts();
      setPrompts(promptsFromDb);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast({ variant: "destructive", title: "Error al cargar prompts", description: "No se pudieron cargar los prompts." });
    } finally {
      setIsLoadingPrompts(false);
    }
  }
  
  const fetchDesigns = async () => {
    setIsLoadingDesigns(true);
    try {
      const designsFromDb = await getDesigns();
      setDesigns(designsFromDb);
    } catch (error) {
      console.error("Error fetching designs:", error);
      toast({ variant: "destructive", title: "Error al cargar diseños", description: "No se pudieron cargar los diseños." });
    } finally {
      setIsLoadingDesigns(false);
    }
  }

  const fetchN8nTemplates = async () => {
    setIsLoadingN8nTemplates(true);
    try {
        const templatesFromDb = await getN8NTemplates();
        setN8nTemplates(templatesFromDb);
    } catch (error) {
        console.error("Error fetching N8N templates:", error);
        toast({ variant: "destructive", title: "Error al cargar plantillas N8N", description: "No se pudieron cargar las plantillas N8N." });
    } finally {
        setIsLoadingN8nTemplates(false);
    }
  }

  useEffect(() => {
    fetchProjects();
    fetchServices();
    fetchFormations();
    fetchShorts();
    fetchLinks();
    fetchLinkCards();
    fetchBlogCategories();
    fetchPrompts();
    fetchDesigns();
    fetchN8nTemplates();
  }, []);

  const handleProjectSaved = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    fetchProjects();
     toast({ title: "Guardado", description: "La entrada se ha guardado correctamente." });
  }

  const handleServiceSaved = () => {
    setIsServiceDialogOpen(false);
    setEditingService(null);
    fetchServices();
     toast({ title: "Servicio guardado", description: "Tu servicio se ha guardado correctamente." });
  }

  const handleFormationSaved = () => {
    setIsFormationDialogOpen(false);
    setEditingFormation(null);
    fetchFormations();
     toast({ title: "Formación guardada", description: "Tu formación se ha guardado correctamente." });
  }
  
  const handleShortSaved = () => {
    setIsShortDialogOpen(false);
    setEditingShort(null);
    fetchShorts();
     toast({ title: "Short guardado", description: "Tu short se ha guardado correctamente." });
  }

  const handleLinkSaved = () => {
    setIsLinkDialogOpen(false);
    setEditingLink(null);
    fetchLinks();
     toast({ title: "Enlace guardado", description: "Tu enlace se ha guardado correctamente." });
  }

  const handleLinkCardSaved = () => {
    setIsLinkCardDialogOpen(false);
    setEditingLinkCard(null);
    fetchLinkCards();
    fetchLinks(); // Re-fetch links in case a card title changed
     toast({ title: "Categoría de enlace guardada", description: "La categoría se ha guardado correctamente." });
  }

  const handleBlogCategorySaved = () => {
    setIsBlogCategoryDialogOpen(false);
    setEditingBlogCategory(null);
    fetchBlogCategories();
    fetchProjects(); 
     toast({ title: "Categoría de Blog guardada", description: "La categoría se ha guardado correctamente." });
  }

  const handlePromptSaved = () => {
    setIsPromptDialogOpen(false);
    setEditingPrompt(null);
    fetchPrompts();
    toast({ title: "Prompt guardado", description: "Tu prompt se ha guardado correctamente." });
  }

  const handleDesignSaved = () => {
    setIsDesignDialogOpen(false);
    setEditingDesign(null);
    fetchDesigns();
    toast({ title: "Diseño guardado", description: "Tu diseño se ha guardado correctamente." });
  }

  const handleN8nTemplateSaved = () => {
    setIsN8nTemplateDialogOpen(false);
    setEditingN8nTemplate(null);
    fetchN8nTemplates();
    toast({ title: "Plantilla N8N guardada", description: "Tu plantilla se ha guardado correctamente." });
  }

  const handleHeroSaved = () => {
    toast({ title: "Hero Actualizado", description: "La sección principal se ha guardado correctamente." });
  }

  const handleAboutSaved = () => {
    toast({ title: "Sección 'Sobre Mí' Actualizada", description: "La sección se ha guardado correctamente." });
  }

  const handleEditProject = (project: Project) => { setEditingProject(project); setIsProjectDialogOpen(true); }
  const handleAddNewProject = () => { setEditingProject(null); setIsProjectDialogOpen(true); }
  const handleEditService = (service: Service) => { setEditingService(service); setIsServiceDialogOpen(true); }
  const handleAddNewService = () => { setEditingService(null); setIsServiceDialogOpen(true); }
  const handleEditFormation = (formation: Formation) => { setEditingFormation(formation); setIsFormationDialogOpen(true); }
  const handleAddNewFormation = () => { setEditingFormation(null); setIsFormationDialogOpen(true); }
  const handleEditShort = (short: Short) => { setEditingShort(short); setIsShortDialogOpen(true); }
  const handleAddNewShort = () => { setEditingShort(null); setIsShortDialogOpen(true); }
  const handleEditLink = (link: LinkItem) => { setEditingLink(link); setIsLinkDialogOpen(true); }
  const handleAddNewLink = () => { setEditingLink(null); setIsLinkDialogOpen(true); }
  const handleEditLinkCard = (linkCard: LinkCard) => { setEditingLinkCard(linkCard); setIsLinkCardDialogOpen(true); }
  const handleAddNewLinkCard = () => { setEditingLinkCard(null); setIsLinkCardDialogOpen(true); }
  const handleEditBlogCategory = (category: BlogCategory) => { setEditingBlogCategory(category); setIsBlogCategoryDialogOpen(true); }
  const handleAddNewBlogCategory = () => { setEditingBlogCategory(null); setIsBlogCategoryDialogOpen(true); }
  const handleEditPrompt = (prompt: Prompt) => { setEditingPrompt(prompt); setIsPromptDialogOpen(true); }
  const handleAddNewPrompt = () => { setEditingPrompt(null); setIsPromptDialogOpen(true); }
  const handleEditDesign = (design: Design) => { setEditingDesign(design); setIsDesignDialogOpen(true); }
  const handleAddNewDesign = () => { setEditingDesign(null); setIsDesignDialogOpen(true); }
  const handleEditN8nTemplate = (template: N8NTemplate) => { setEditingN8nTemplate(template); setIsN8nTemplateDialogOpen(true); }
  const handleAddNewN8nTemplate = () => { setEditingN8nTemplate(null); setIsN8nTemplateDialogOpen(true); }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      fetchProjects();
      toast({ title: "Eliminado", description: "La entrada se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar la entrada." });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      fetchServices();
      toast({ title: "Servicio eliminado", description: "El servicio se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el servicio." });
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    try {
      await deleteFormation(formationId);
      fetchFormations();
      toast({ title: "Formación eliminada", description: "La formación se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting formation:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar la formación." });
    }
  };
  
  const handleDeleteShort = async (shortId: string) => {
    try {
      await deleteShort(shortId);
      fetchShorts();
      toast({ title: "Short eliminado", description: "El short se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting short:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el short." });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      fetchLinks();
      toast({ title: "Enlace eliminado", description: "El enlace se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting link:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el enlace." });
    }
  };

  const handleDeleteLinkCard = async (linkCardId: string) => {
    try {
      await deleteLinkCard(linkCardId);
      fetchLinkCards();
      toast({ title: "Categoría de enlace eliminada", description: "La categoría se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting link card:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar la categoría." });
    }
  };

  const handleDeleteBlogCategory = async (categoryId: string) => {
    try {
      await deleteBlogCategory(categoryId);
      fetchBlogCategories();
      fetchProjects();
      toast({ title: "Categoría de blog eliminada", description: "La categoría se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting blog category:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar la categoría." });
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      await deletePrompt(promptId);
      fetchPrompts();
      toast({ title: "Prompt eliminado", description: "El prompt se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el prompt." });
    }
  };

  const handleDeleteDesign = async (designId: string) => {
    try {
      await deleteDesign(designId);
      fetchDesigns();
      toast({ title: "Diseño eliminado", description: "El diseño se ha eliminado correctamente." });
    } catch (error) {
      console.error("Error deleting design:", error);
      toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar el diseño." });
    }
  };

  const handleDeleteN8nTemplate = async (templateId: string) => {
    try {
        await deleteN8NTemplate(templateId);
        fetchN8nTemplates();
        toast({ title: "Plantilla N8N eliminada", description: "La plantilla se ha eliminado correctamente." });
    } catch (error) {
        console.error("Error deleting N8N template:", error);
        toast({ variant: "destructive", title: "Error al eliminar", description: "No se pudo eliminar la plantilla." });
    }
  };

  return (
    <main className="flex-1 w-full p-4 md:p-8 space-y-8">
        <Tabs defaultValue="pagina" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto">
            <TabsTrigger value="pagina">Página Principal</TabsTrigger>
            <TabsTrigger value="servicios">Servicios</TabsTrigger>
            <TabsTrigger value="proyectos">Proyectos/Blog</TabsTrigger>
            <TabsTrigger value="formacion">Formación</TabsTrigger>
            <TabsTrigger value="links">Enlaces</TabsTrigger>
            <TabsTrigger value="shorts">Shorts</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="galeria">Galería</TabsTrigger>
            <TabsTrigger value="disenos">Diseños</TabsTrigger>
            <TabsTrigger value="n8n">N8N</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pagina" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Página Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                  <Card>
                    <CardHeader>
                        <CardTitle>Gestionar Hero</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HeroForm onSave={handleHeroSaved} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                        <CardTitle>Gestionar "Sobre Mí"</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AboutForm onSave={handleAboutSaved} />
                    </CardContent>
                  </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="servicios" className="mt-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Servicios ("Lo que hago")</CardTitle>
                   <Dialog open={isServiceDialogOpen} onOpenChange={(isOpen) => { setIsServiceDialogOpen(isOpen); if (!isOpen) setEditingService(null); }}>
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
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
                             <TableCell>{service.iconUrl && <img src={service.iconUrl} alt={service.title} className="w-8 h-8" />}</TableCell>
                            <TableCell className="font-medium">{service.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{service.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}><Edit className="h-4 w-4" /></Button>
                               <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el servicio.</AlertDialogDescription>
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
          </TabsContent>
          
          <TabsContent value="proyectos" className="mt-6">
            <Tabs defaultValue="manage-posts">
                <TabsList className="mb-4">
                    <TabsTrigger value="manage-posts">Gestionar Entradas</TabsTrigger>
                    <TabsTrigger value="manage-categories">Gestionar Categorías</TabsTrigger>
                </TabsList>
                <TabsContent value="manage-posts">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                        <div><CardTitle>Proyectos y Blog</CardTitle></div>
                        <Dialog open={isProjectDialogOpen} onOpenChange={(isOpen) => { setIsProjectDialogOpen(isOpen); if (!isOpen) setEditingProject(null); }}>
                            <DialogTrigger asChild>
                            <Button onClick={handleAddNewProject}><PlusCircle className="mr-2 h-4 w-4" />Añadir Nuevo</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px] glass-card max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingProject ? 'Editar' : 'Crear Nuevo'}</DialogTitle>
                                <DialogDescription className="sr-only">{editingProject ? 'Edita los detalles de tu proyecto o entrada de blog aquí.' : 'Crea un nuevo proyecto o entrada de blog.'}</DialogDescription>
                            </DialogHeader>
                            <ProjectForm project={editingProject} onSave={handleProjectSaved} availableCategories={blogCategories} />
                            </DialogContent>
                        </Dialog>
                        </CardHeader>
                        <CardContent>
                        {isLoadingProjects ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : (
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead className="w-[50px]">Tipo</TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => {
                                const category = blogCategories.find(c => c.id === project.categoryId);
                                return (
                                <TableRow key={project.id}>
                                    <TableCell>{project.type === 'blog' ? <FileCode className="h-5 w-5 text-primary" /> : <Briefcase className="h-5 w-5 text-muted-foreground" />}</TableCell>
                                    <TableCell className="font-medium">{project.title}</TableCell>
                                    <TableCell className="text-muted-foreground">{category?.title || 'Sin categoría'}</TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente la entrada.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteProject(project.id!)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    </TableCell>
                                </TableRow>
                                )})}
                            </TableBody>
                            </Table>
                        )}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="manage-categories">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Categorías de Blog</CardTitle>
                            <Dialog open={isBlogCategoryDialogOpen} onOpenChange={(isOpen) => { setIsBlogCategoryDialogOpen(isOpen); if (!isOpen) setEditingBlogCategory(null); }}>
                                <DialogTrigger asChild><Button onClick={handleAddNewBlogCategory}><PlusCircle className="mr-2 h-4 w-4" />Añadir Categoría</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] glass-card">
                                <DialogHeader>
                                    <DialogTitle>{editingBlogCategory ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
                                    <DialogDescription className="sr-only">{editingBlogCategory ? 'Edita los detalles de la categoría aquí.' : 'Crea una nueva categoría para tu blog.'}</DialogDescription>
                                </DialogHeader>
                                <BlogCategoryForm category={editingBlogCategory} onSave={handleBlogCategorySaved} />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                          {isLoadingBlogCategories ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">Imagen</TableHead>
                                  <TableHead>Título</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {blogCategories.map((category) => (
                                  <TableRow key={category.id}>
                                     <TableCell><ImageIcon className="h-8 w-8 text-muted-foreground" /></TableCell>
                                    <TableCell className="font-medium">{category.title}</TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditBlogCategory(category)}><Edit className="h-4 w-4" /></Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteBlogCategory(category.id!)}>Eliminar</AlertDialogAction>
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
                </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="formacion" className="mt-6">
            <Tabs defaultValue="certifications">
                <TabsList className="mb-4">
                    <TabsTrigger value="certifications">Certificaciones</TabsTrigger>
                    <TabsTrigger value="courses">Cursos (Aprende)</TabsTrigger>
                </TabsList>
                <TabsContent value="certifications">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Certificaciones y Formación</CardTitle>
                            <Dialog open={isFormationDialogOpen} onOpenChange={(isOpen) => { setIsFormationDialogOpen(isOpen); if (!isOpen) setEditingFormation(null); }}>
                                <DialogTrigger asChild><Button onClick={handleAddNewFormation}><PlusCircle className="mr-2 h-4 w-4" />Añadir Formación</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] glass-card">
                                <DialogHeader>
                                    <DialogTitle>{editingFormation ? 'Editar Formación' : 'Crear Nueva Formación'}</DialogTitle>
                                    <DialogDescription className="sr-only">{editingFormation ? 'Edita los detalles de tu formación aquí.' : 'Crea una nueva entrada de formación.'}</DialogDescription>
                                </DialogHeader>
                                <FormationForm formation={editingFormation} onSave={handleFormationSaved} />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                        {isLoadingFormations ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : (
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Etiqueta</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formations.filter(f => !f.tag).map((formation) => (
                                <TableRow key={formation.id}>
                                    <TableCell className="font-medium">{formation.title}</TableCell>
                                    <TableCell className="max-w-[300px] truncate">{formation.description}</TableCell>
                                    <TableCell><Badge variant="secondary">Certificación</Badge></TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditFormation(formation)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente la formación.</AlertDialogDescription>
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
                </TabsContent>
                <TabsContent value="courses">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Cursos "Aprende"</CardTitle>
                             <Dialog open={isFormationDialogOpen} onOpenChange={(isOpen) => { setIsFormationDialogOpen(isOpen); if (!isOpen) setEditingFormation(null); }}>
                                <DialogTrigger asChild><Button onClick={handleAddNewFormation}><PlusCircle className="mr-2 h-4 w-4" />Añadir Curso</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] glass-card">
                                <DialogHeader>
                                    <DialogTitle>{editingFormation ? 'Editar Curso' : 'Crear Nuevo Curso'}</DialogTitle>
                                    <DialogDescription className="sr-only">{editingFormation ? 'Edita los detalles de tu curso aquí.' : 'Crea un nuevo curso.'}</DialogDescription>
                                </DialogHeader>
                                <FormationForm formation={editingFormation} onSave={handleFormationSaved} />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                         {isLoadingFormations ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                        ) : (
                            <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Título</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Etiqueta</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {formations.filter(f => f.tag).map((formation) => (
                                <TableRow key={formation.id}>
                                    <TableCell className="font-medium">{formation.title}</TableCell>
                                    <TableCell className="max-w-[300px] truncate">{formation.description}</TableCell>
                                    <TableCell><Badge variant="outline">{formation.tag}</Badge></TableCell>
                                    <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEditFormation(formation)}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el curso.</AlertDialogDescription>
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
                </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <Tabs defaultValue="manage-links">
                <TabsList className="mb-4">
                    <TabsTrigger value="manage-links">Gestionar Enlaces</TabsTrigger>
                    <TabsTrigger value="manage-cards">Gestionar Categorías</TabsTrigger>
                </TabsList>

                <TabsContent value="manage-links">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Enlaces de Interés</CardTitle>
                            <Dialog open={isLinkDialogOpen} onOpenChange={(isOpen) => { setIsLinkDialogOpen(isOpen); if (!isOpen) setEditingLink(null); }}>
                                <DialogTrigger asChild><Button onClick={handleAddNewLink}><PlusCircle className="mr-2 h-4 w-4" />Añadir Enlace</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] glass-card">
                                <DialogHeader>
                                    <DialogTitle>{editingLink ? 'Editar Enlace' : 'Crear Nuevo Enlace'}</DialogTitle>
                                    <DialogDescription className="sr-only">{editingLink ? 'Edita los detalles de tu enlace aquí.' : 'Crea un nuevo enlace.'}</DialogDescription>
                                </DialogHeader>
                                <LinkForm link={editingLink} onSave={handleLinkSaved} availableCards={linkCards} />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                          {isLoadingLinks ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Título</TableHead>
                                  <TableHead>Etiqueta</TableHead>
                                  <TableHead>Categoría</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {links.map((link) => {
                                  const card = linkCards.find(c => c.id === link.cardId);
                                  return (
                                  <TableRow key={link.id}>
                                    <TableCell className="font-medium">{link.title}</TableCell>
                                    <TableCell><Badge variant="secondary">{link.tag}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground">{card?.title || 'Sin categoría'}</TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditLink(link)}><Edit className="h-4 w-4" /></Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el enlace.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteLink(link.id!)}>Eliminar</AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TableCell>
                                  </TableRow>
                                )})}
                              </TableBody>
                            </Table>
                          )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="manage-cards">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Categorías de Enlaces</CardTitle>
                            <Dialog open={isLinkCardDialogOpen} onOpenChange={(isOpen) => { setIsLinkCardDialogOpen(isOpen); if (!isOpen) setEditingLinkCard(null); }}>
                                <DialogTrigger asChild><Button onClick={handleAddNewLinkCard}><PlusCircle className="mr-2 h-4 w-4" />Añadir Categoría</Button></DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] glass-card">
                                <DialogHeader>
                                    <DialogTitle>{editingLinkCard ? 'Editar Categoría' : 'Crear Nueva Categoría'}</DialogTitle>
                                    <DialogDescription className="sr-only">{editingLinkCard ? 'Edita los detalles de la categoría aquí.' : 'Crea una nueva categoría para tus enlaces.'}</DialogDescription>
                                </DialogHeader>
                                <LinkCardForm card={editingLinkCard} onSave={handleLinkCardSaved} />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                          {isLoadingLinkCards ? (
                            <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">Imagen</TableHead>
                                  <TableHead>Título</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {linkCards.map((card) => (
                                  <TableRow key={card.id}>
                                     <TableCell><ImageIcon className="h-8 w-8 text-muted-foreground" /></TableCell>
                                    <TableCell className="font-medium">{card.title}</TableCell>
                                    <TableCell className="text-right">
                                      <Button variant="ghost" size="icon" onClick={() => handleEditLinkCard(card)}><Edit className="h-4 w-4" /></Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría.</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteLinkCard(card.id!)}>Eliminar</AlertDialogAction>
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
                </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="shorts" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>YouTube Shorts</CardTitle>
                   <Dialog open={isShortDialogOpen} onOpenChange={(isOpen) => { setIsShortDialogOpen(isOpen); if (!isOpen) setEditingShort(null); }}>
                    <DialogTrigger asChild><Button onClick={handleAddNewShort}><PlusCircle className="mr-2 h-4 w-4" />Añadir Short</Button></DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingShort ? 'Editar Short' : 'Crear Nuevo Short'}</DialogTitle>
                        <DialogDescription className="sr-only">{editingShort ? 'Edita los detalles de tu short aquí.' : 'Añade un nuevo short a tu colección.'}</DialogDescription>
                      </DialogHeader>
                      <ShortForm short={editingShort} onSave={handleShortSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingShorts ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
                             <TableCell><Youtube className="h-6 w-6 text-red-600" /></TableCell>
                            <TableCell className="font-medium">{short.title}</TableCell>
                            <TableCell><div className="flex flex-wrap gap-1 max-w-[250px]">{short.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditShort(short)}><Edit className="h-4 w-4" /></Button>
                               <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el short.</AlertDialogDescription>
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
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Prompts</CardTitle>
                   <Dialog open={isPromptDialogOpen} onOpenChange={(isOpen) => { setIsPromptDialogOpen(isOpen); if (!isOpen) setEditingPrompt(null); }}>
                    <DialogTrigger asChild>
                       <Button onClick={handleAddNewPrompt}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Prompt
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] glass-card">
                      <DialogHeader>
                        <DialogTitle>{editingPrompt ? 'Editar Prompt' : 'Crear Nuevo Prompt'}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {editingPrompt ? 'Edita los detalles de tu prompt aquí.' : 'Crea un nuevo prompt para compartir.'}
                        </DialogDescription>
                      </DialogHeader>
                      <PromptForm prompt={editingPrompt} onSave={handlePromptSaved} />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {isLoadingPrompts ? (
                    <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
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
                        {prompts.map((prompt) => (
                          <TableRow key={prompt.id}>
                             <TableCell><Terminal className="h-5 w-5 text-primary" /></TableCell>
                            <TableCell className="font-medium">{prompt.title}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{prompt.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEditPrompt(prompt)}><Edit className="h-4 w-4" /></Button>
                               <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el prompt.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeletePrompt(prompt.id!)}>Eliminar</AlertDialogAction>
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
          </TabsContent>
          
          <TabsContent value="galeria" className="mt-6">
            <Card>
              <CardHeader>
                  <CardTitle className="font-headline text-3xl">Galería de Imágenes</CardTitle>
              </CardHeader>
              <CardContent>
                  <ImageGallery />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="disenos" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-3xl">Diseños</CardTitle>
                <Dialog open={isDesignDialogOpen} onOpenChange={(isOpen) => { setIsDesignDialogOpen(isOpen); if (!isOpen) setEditingDesign(null); }}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddNewDesign}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Añadir Diseño
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] glass-card">
                    <DialogHeader>
                      <DialogTitle>{editingDesign ? 'Editar Diseño' : 'Crear Nuevo Diseño'}</DialogTitle>
                      <DialogDescription className="sr-only">
                        {editingDesign ? 'Edita los detalles de tu diseño aquí.' : 'Añade un nuevo diseño a tu colección.'}
                      </DialogDescription>
                    </DialogHeader>
                    <DesignForm design={editingDesign} onSave={handleDesignSaved} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingDesigns ? (
                  <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Imagen</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {designs.length > 0 ? designs.map((design) => (
                        <TableRow key={design.id}>
                          <TableCell>
                            <Image
                              src={design.imageUrl}
                              alt={design.title}
                              width={60}
                              height={60}
                              className="rounded-md object-cover aspect-square"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{design.title}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditDesign(design)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente el diseño.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDesign(design.id!)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            Aún no has añadido ningún diseño.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="n8n" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline text-3xl">Plantillas N8N</CardTitle>
                <Dialog open={isN8nTemplateDialogOpen} onOpenChange={(isOpen) => { setIsN8nTemplateDialogOpen(isOpen); if (!isOpen) setEditingN8nTemplate(null); }}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddNewN8nTemplate}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Añadir Plantilla
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px] glass-card max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingN8nTemplate ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}</DialogTitle>
                      <DialogDescription className="sr-only">
                        {editingN8nTemplate ? 'Edita los detalles de tu plantilla aquí.' : 'Añade una nueva plantilla N8N a tu colección.'}
                      </DialogDescription>
                    </DialogHeader>
                    <N8NTemplateForm template={editingN8nTemplate} onSave={handleN8nTemplateSaved} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoadingN8nTemplates ? (
                  <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {n8nTemplates.length > 0 ? n8nTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.title}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditN8nTemplate(template)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente la plantilla.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteN8nTemplate(template.id!)}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                            Aún no has añadido ninguna plantilla N8N.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
    </main>
  );
}
