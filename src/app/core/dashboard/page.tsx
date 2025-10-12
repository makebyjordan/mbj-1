

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Star, Youtube, Link2, Folder, Image as ImageIcon, FileCode, Briefcase, Library, Terminal, Palette, BookOpen, Copy, MoreHorizontal, Eye, Pencil, Code, Server, BookCopy, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { getN8NServers, deleteN8NServer, N8NServer } from '@/services/n8n-servers';
import { getAprendePages, deleteAprendePage, duplicateAprendePage, AprendePageData } from '@/services/aprende-pages';
import { getHtmls, deleteHtml, HtmlPage } from '@/services/htmls';
import { getProtocols, deleteProtocol, Protocol } from '@/services/protocols';
import { getNotes, deleteNote, Note } from '@/services/notes';

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
import N8NServerForm from '@/components/core/N8NServerForm';
import AprendePageForm from '@/components/core/AprendePageForm';
import HtmlForm from '@/components/core/HtmlForm';
import ProtocolForm from '@/components/core/ProtocolForm';
import NoteForm from '@/components/core/NoteForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { onSnapshot, collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const [n8nServers, setN8nServers] = useState<N8NServer[]>([]);
  const [aprendePages, setAprendePages] = useState<AprendePageData[]>([]);
  const [htmls, setHtmls] = useState<HtmlPage[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
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
  const [isLoadingN8nServers, setIsLoadingN8nServers] = useState(true);
  const [isLoadingAprendePages, setIsLoadingAprendePages] = useState(true);
  const [isLoadingHtmls, setIsLoadingHtmls] = useState(true);
  const [isLoadingProtocols, setIsLoadingProtocols] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

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
  const [isN8nServerDialogOpen, setIsN8nServerDialogOpen] = useState(false);
  const [isAprendePageFormOpen, setIsAprendePageFormOpen] = useState(false);
  const [isHtmlDialogOpen, setIsHtmlDialogOpen] = useState(false);
  const [isProtocolDialogOpen, setIsProtocolDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);

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
  const [editingN8nServer, setEditingN8nServer] = useState<N8NServer | null>(null);
  const [editingAprendePage, setEditingAprendePage] = useState<AprendePageData | null>(null);
  const [editingHtml, setEditingHtml] = useState<HtmlPage | null>(null);
  const [editingProtocol, setEditingProtocol] = useState<Protocol | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingAprendePage, setDeletingAprendePage] = useState<AprendePageData | null>(null);
  const [viewingProtocol, setViewingProtocol] = useState<Protocol | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => { setIsLoadingProjects(true); try { const data = await getProjects(); setProjects(data); } catch (error) { console.error("Error fetching projects:", error); toast({ variant: "destructive", title: "Error al cargar proyectos" }); } finally { setIsLoadingProjects(false); } };
  const fetchServices = async () => { setIsLoadingServices(true); try { const data = await getServices(); setServices(data); } catch (error) { console.error("Error fetching services:", error); toast({ variant: "destructive", title: "Error al cargar servicios" }); } finally { setIsLoadingServices(false); } };
  const fetchFormations = async () => { setIsLoadingFormations(true); try { const data = await getFormations(); setFormations(data); } catch (error) { console.error("Error fetching formations:", error); toast({ variant: "destructive", title: "Error al cargar formaciones" }); } finally { setIsLoadingFormations(false); } };
  const fetchShorts = async () => { setIsLoadingShorts(true); try { const data = await getShorts(); setShorts(data); } catch (error) { console.error("Error fetching shorts:", error); toast({ variant: "destructive", title: "Error al cargar shorts" }); } finally { setIsLoadingShorts(false); } };
  const fetchLinks = async () => { setIsLoadingLinks(true); try { const data = await getLinks(); setLinks(data); } catch (error) { console.error("Error fetching links:", error); toast({ variant: "destructive", title: "Error al cargar enlaces" }); } finally { setIsLoadingLinks(false); } };
  const fetchLinkCards = async () => { setIsLoadingLinkCards(true); try { const data = await getLinkCards(); setLinkCards(data); } catch (error) { console.error("Error fetching link cards:", error); toast({ variant: "destructive", title: "Error al cargar categorías de enlaces" }); } finally { setIsLoadingLinkCards(false); } };
  const fetchBlogCategories = async () => { setIsLoadingBlogCategories(true); try { const data = await getBlogCategories(); setBlogCategories(data); } catch (error) { console.error("Error fetching blog categories:", error); toast({ variant: "destructive", title: "Error al cargar categorías de blog" }); } finally { setIsLoadingBlogCategories(false); } };
  const fetchPrompts = async () => { setIsLoadingPrompts(true); try { const data = await getPrompts(); setPrompts(data); } catch (error) { console.error("Error fetching prompts:", error); toast({ variant: "destructive", title: "Error al cargar prompts" }); } finally { setIsLoadingPrompts(false); } };
  const fetchDesigns = async () => { setIsLoadingDesigns(true); try { const data = await getDesigns(); setDesigns(data); } catch (error) { console.error("Error fetching designs:", error); toast({ variant: "destructive", title: "Error al cargar diseños" }); } finally { setIsLoadingDesigns(false); } };
  const fetchN8nTemplates = async () => { setIsLoadingN8nTemplates(true); try { const data = await getN8NTemplates(); setN8nTemplates(data); } catch (error) { console.error("Error fetching N8N templates:", error); toast({ variant: "destructive", title: "Error al cargar plantillas N8N" }); } finally { setIsLoadingN8nTemplates(false); } };
  const fetchN8nServers = async () => { setIsLoadingN8nServers(true); try { const data = await getN8NServers(); setN8nServers(data); } catch (error) { console.error("Error fetching N8N servers:", error); toast({ variant: "destructive", title: "Error al cargar servidores N8N" }); } finally { setIsLoadingN8nServers(false); } };
  const fetchHtmls = async () => { setIsLoadingHtmls(true); try { const data = await getHtmls(); setHtmls(data); } catch (error) { console.error("Error fetching HTML pages:", error); toast({ variant: "destructive", title: "Error al cargar páginas HTML" }); } finally { setIsLoadingHtmls(false); } };
  const fetchProtocols = async () => { setIsLoadingProtocols(true); try { const data = await getProtocols(); setProtocols(data); } catch (error) { console.error("Error fetching protocols:", error); toast({ variant: "destructive", title: "Error al cargar protocolos" }); } finally { setIsLoadingProtocols(false); } };
  const fetchNotes = async () => { setIsLoadingNotes(true); try { const data = await getNotes(); setNotes(data); } catch (error) { console.error("Error fetching notes:", error); toast({ variant: "destructive", title: "Error al cargar notas" }); } finally { setIsLoadingNotes(false); } };

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
    fetchN8nServers();
    fetchHtmls();
    fetchProtocols();
    fetchNotes();

    const q = query(collection(db, "aprendePages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => { const pagesData: AprendePageData[] = []; querySnapshot.forEach((doc) => { const data = doc.data(); pagesData.push({ id: doc.id, ...data } as AprendePageData); }); setAprendePages(pagesData); setIsLoadingAprendePages(false); }, (err) => { console.error("Error fetching Aprende Pages in real-time: ", err); toast({ variant: "destructive", title: "Error al cargar páginas" }); setIsLoadingAprendePages(false); } );
    return () => unsubscribe();
  }, []);

  const handleProjectSaved = () => { setIsProjectDialogOpen(false); setEditingProject(null); fetchProjects(); toast({ title: "Guardado" }); };
  const handleServiceSaved = () => { setIsServiceDialogOpen(false); setEditingService(null); fetchServices(); toast({ title: "Servicio guardado" }); };
  const handleFormationSaved = () => { setIsFormationDialogOpen(false); setEditingFormation(null); fetchFormations(); toast({ title: "Formación guardada" }); };
  const handleShortSaved = () => { setIsShortDialogOpen(false); setEditingShort(null); fetchShorts(); toast({ title: "Short guardado" }); };
  const handleLinkSaved = () => { setIsLinkDialogOpen(false); setEditingLink(null); fetchLinks(); toast({ title: "Enlace guardado" }); };
  const handleLinkCardSaved = () => { setIsLinkCardDialogOpen(false); setEditingLinkCard(null); fetchLinkCards(); fetchLinks(); toast({ title: "Categoría de enlace guardada" }); };
  const handleBlogCategorySaved = () => { setIsBlogCategoryDialogOpen(false); setEditingBlogCategory(null); fetchBlogCategories(); fetchProjects(); toast({ title: "Categoría de Blog guardada" }); };
  const handlePromptSaved = () => { setIsPromptDialogOpen(false); setEditingPrompt(null); fetchPrompts(); toast({ title: "Prompt guardado" }); };
  const handleDesignSaved = () => { setIsDesignDialogOpen(false); setEditingDesign(null); fetchDesigns(); toast({ title: "Diseño guardado" }); };
  const handleN8nTemplateSaved = () => { setIsN8nTemplateDialogOpen(false); setEditingN8nTemplate(null); fetchN8nTemplates(); toast({ title: "Plantilla N8N guardada" }); };
  const handleN8nServerSaved = () => { setIsN8nServerDialogOpen(false); setEditingN8nServer(null); fetchN8nServers(); toast({ title: "Servidor N8N guardado" }); };
  const handleHeroSaved = () => { toast({ title: "Hero Actualizado" }); };
  const handleAboutSaved = () => { toast({ title: "'Sobre Mí' Actualizada" }); };
  const handleAprendePageSaved = () => { setIsAprendePageFormOpen(false); setEditingAprendePage(null); /* Real-time handled */ };
  const handleHtmlSaved = () => { setIsHtmlDialogOpen(false); setEditingHtml(null); fetchHtmls(); toast({ title: "Página HTML guardada" }); };
  const handleProtocolSaved = () => { setIsProtocolDialogOpen(false); setEditingProtocol(null); fetchProtocols(); toast({ title: "Protocolo guardado" }); };
  const handleNoteSaved = () => { setIsNoteDialogOpen(false); setEditingNote(null); fetchNotes(); toast({ title: "Nota guardada" }); };

  const handleEditProject = (project: Project) => { setEditingProject(project); setIsProjectDialogOpen(true); };
  const handleAddNewProject = () => { setEditingProject(null); setIsProjectDialogOpen(true); };
  const handleEditService = (service: Service) => { setEditingService(service); setIsServiceDialogOpen(true); };
  const handleAddNewService = () => { setEditingService(null); setIsServiceDialogOpen(true); };
  const handleEditFormation = (formation: Formation) => { setEditingFormation(formation); setIsFormationDialogOpen(true); };
  const handleAddNewFormation = () => { setEditingFormation(null); setIsFormationDialogOpen(true); };
  const handleEditShort = (short: Short) => { setEditingShort(short); setIsShortDialogOpen(true); };
  const handleAddNewShort = () => { setEditingShort(null); setIsShortDialogOpen(true); };
  const handleEditLink = (link: LinkItem) => { setEditingLink(link); setIsLinkDialogOpen(true); };
  const handleAddNewLink = () => { setEditingLink(null); setIsLinkDialogOpen(true); };
  const handleEditLinkCard = (linkCard: LinkCard) => { setEditingLinkCard(linkCard); setIsLinkCardDialogOpen(true); };
  const handleAddNewLinkCard = () => { setEditingLinkCard(null); setIsLinkCardDialogOpen(true); };
  const handleEditBlogCategory = (category: BlogCategory) => { setEditingBlogCategory(category); setIsBlogCategoryDialogOpen(true); };
  const handleAddNewBlogCategory = () => { setEditingBlogCategory(null); setIsBlogCategoryDialogOpen(true); };
  const handleEditPrompt = (prompt: Prompt) => { setEditingPrompt(prompt); setIsPromptDialogOpen(true); };
  const handleAddNewPrompt = () => { setEditingPrompt(null); setIsPromptDialogOpen(true); };
  const handleEditDesign = (design: Design) => { setEditingDesign(design); setIsDesignDialogOpen(true); };
  const handleAddNewDesign = () => { setEditingDesign(null); setIsDesignDialogOpen(true); };
  const handleEditN8nTemplate = (template: N8NTemplate) => { setEditingN8nTemplate(template); setIsN8nTemplateDialogOpen(true); };
  const handleAddNewN8nTemplate = () => { setEditingN8nTemplate(null); setIsN8nTemplateDialogOpen(true); };
  const handleEditN8nServer = (server: N8NServer) => { setEditingN8nServer(server); setIsN8nServerDialogOpen(true); };
  const handleAddNewN8nServer = () => { setEditingN8nServer(null); setIsN8nServerDialogOpen(true); };
  const handleEditHtml = (htmlPage: HtmlPage) => { setEditingHtml(htmlPage); setIsHtmlDialogOpen(true); };
  const handleAddNewHtml = () => { setEditingHtml(null); setIsHtmlDialogOpen(true); };
  const handleEditAprendePage = (page: AprendePageData) => { setEditingAprendePage(page); setIsAprendePageFormOpen(true); };
  const handleAddNewAprendePage = () => { setEditingAprendePage(null); setIsAprendePageFormOpen(true); };
  const handleEditProtocol = (protocol: Protocol) => { setEditingProtocol(protocol); setIsProtocolDialogOpen(true); };
  const handleAddNewProtocol = () => { setEditingProtocol(null); setIsProtocolDialogOpen(true); };
  const handleEditNote = (note: Note) => { setEditingNote(note); setIsNoteDialogOpen(true); };
  const handleAddNewNote = () => { setEditingNote(null); setIsNoteDialogOpen(true); };
  
  const handleDeleteProject = async (projectId: string) => { try { await deleteProject(projectId); fetchProjects(); toast({ title: "Eliminado" }); } catch (error) { console.error("Error deleting project:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteService = async (serviceId: string) => { try { await deleteService(serviceId); fetchServices(); toast({ title: "Servicio eliminado" }); } catch (error) { console.error("Error deleting service:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteFormation = async (formationId: string) => { try { await deleteFormation(formationId); fetchFormations(); toast({ title: "Formación eliminada" }); } catch (error) { console.error("Error deleting formation:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteShort = async (shortId: string) => { try { await deleteShort(shortId); fetchShorts(); toast({ title: "Short eliminado" }); } catch (error) { console.error("Error deleting short:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteLink = async (linkId: string) => { try { await deleteLink(linkId); fetchLinks(); toast({ title: "Enlace eliminado" }); } catch (error) { console.error("Error deleting link:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteLinkCard = async (linkCardId: string) => { try { await deleteLinkCard(linkCardId); fetchLinkCards(); toast({ title: "Categoría de enlace eliminada" }); } catch (error) { console.error("Error deleting link card:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteBlogCategory = async (categoryId: string) => { try { await deleteBlogCategory(categoryId); fetchBlogCategories(); fetchProjects(); toast({ title: "Categoría de blog eliminada" }); } catch (error) { console.error("Error deleting blog category:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeletePrompt = async (promptId: string) => { try { await deletePrompt(promptId); fetchPrompts(); toast({ title: "Prompt eliminado" }); } catch (error) { console.error("Error deleting prompt:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteDesign = async (designId: string) => { try { await deleteDesign(designId); fetchDesigns(); toast({ title: "Diseño eliminado" }); } catch (error) { console.error("Error deleting design:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteN8nTemplate = async (templateId: string) => { try { await deleteN8NTemplate(templateId); fetchN8nTemplates(); toast({ title: "Plantilla N8N eliminada" }); } catch (error) { console.error("Error deleting N8N template:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteN8nServer = async (serverId: string) => { try { await deleteN8NServer(serverId); fetchN8nServers(); toast({ title: "Servidor N8N eliminado" }); } catch (error) { console.error("Error deleting N8N server:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteHtml = async (htmlId: string) => { try { await deleteHtml(htmlId); fetchHtmls(); toast({ title: "Página HTML eliminada" }); } catch (error) { console.error("Error deleting HTML page:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteProtocol = async (protocolId: string) => { try { await deleteProtocol(protocolId); fetchProtocols(); toast({ title: "Protocolo eliminado" }); } catch (error) { console.error("Error deleting protocol:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };
  const handleDeleteNote = async (noteId: string) => { try { await deleteNote(noteId); fetchNotes(); toast({ title: "Nota eliminada" }); } catch (error) { console.error("Error deleting note:", error); toast({ variant: "destructive", title: "Error al eliminar" }); } };

  const handleConfirmDeleteAprendePage = async () => {
    if (!deletingAprendePage) return;
    const result = await deleteAprendePage(deletingAprendePage.id);
    if (result.success) {
      toast({ title: "Página Eliminada" });
    } else {
      toast({ variant: "destructive", title: "Error al Eliminar", description: result.error });
    }
    setDeletingAprendePage(null);
  };
  
  const handleDuplicateAprendePage = async (id: string) => {
    const result = await duplicateAprendePage(id);
    if (result.success) {
      toast({ title: "Página Duplicada" });
    } else {
      toast({ variant: "destructive", title: "Error al Duplicar", description: result.error });
    }
  };

  const handleViewProtocol = (protocol: Protocol) => {
    setViewingProtocol(protocol);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copiado", description: "El texto se ha copiado al portapapeles." });
  };


  return (
    <main className="flex-1 w-full p-4 md:p-8 space-y-8">
        <AprendePageForm isOpen={isAprendePageFormOpen} setIsOpen={setIsAprendePageFormOpen} onFormSubmit={handleAprendePageSaved} pageData={editingAprendePage} />
        <Dialog open={isHtmlDialogOpen} onOpenChange={(isOpen) => { setIsHtmlDialogOpen(isOpen); if (!isOpen) setEditingHtml(null); }}>
            <DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingHtml ? 'Editar' : 'Crear'} Página HTML</DialogTitle></DialogHeader><HtmlForm htmlPage={editingHtml} onSave={handleHtmlSaved} /></DialogContent>
        </Dialog>
        <Dialog open={isProtocolDialogOpen} onOpenChange={(isOpen) => { setIsProtocolDialogOpen(isOpen); if (!isOpen) setEditingProtocol(null); }}>
            <DialogContent className="sm:max-w-[625px] glass-card max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingProtocol ? 'Editar' : 'Crear'} Protocolo</DialogTitle></DialogHeader><ProtocolForm protocol={editingProtocol} onSave={handleProtocolSaved} /></DialogContent>
        </Dialog>
        <Dialog open={isNoteDialogOpen} onOpenChange={(isOpen) => { setIsNoteDialogOpen(isOpen); if (!isOpen) setEditingNote(null); }}>
            <DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingNote ? 'Editar' : 'Crear'} Nota</DialogTitle></DialogHeader><NoteForm note={editingNote} onSave={handleNoteSaved} /></DialogContent>
        </Dialog>
         <AlertDialog open={!!deletingAprendePage} onOpenChange={(isOpen) => !isOpen && setDeletingAprendePage(null)}>
            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleConfirmDeleteAprendePage}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>
        <Dialog open={!!viewingProtocol} onOpenChange={(isOpen) => !isOpen && setViewingProtocol(null)}>
            <DialogContent className="sm:max-w-2xl glass-card max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-primary">{viewingProtocol?.title}</DialogTitle>
                    <DialogDescription>Pasos del protocolo de actuación.</DialogDescription>
                </DialogHeader>
                <div className="prose prose-invert max-w-none">
                    {viewingProtocol?.steps?.map((step, index) => (
                        <div key={index} className="py-4 border-b border-primary/20 relative group">
                            <h4 className="font-bold text-primary">Paso {index + 1}: {step.title}</h4>
                            <p>{step.description}</p>
                             {step.description && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(step.description || '')}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                            {step.imageUrl && <img src={step.imageUrl} alt={`Paso ${index+1}`} className="mt-2 rounded-md max-w-full h-auto" />}
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setViewingProtocol(null)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Tabs defaultValue="pagina" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-13 h-auto">
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
            <TabsTrigger value="htmls">HTMLs</TabsTrigger>
            <TabsTrigger value="protocols">Protocolos</TabsTrigger>
            <TabsTrigger value="notes">Notas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pagina" className="mt-6">
            <Card><CardHeader><CardTitle className="font-headline text-3xl">Página Principal</CardTitle></CardHeader><CardContent className="space-y-8"><Card><CardHeader><CardTitle>Gestionar Hero</CardTitle></CardHeader><CardContent><HeroForm onSave={handleHeroSaved} /></CardContent></Card><Card><CardHeader><CardTitle>Gestionar "Sobre Mí"</CardTitle></CardHeader><CardContent><AboutForm onSave={handleAboutSaved} /></CardContent></Card></CardContent></Card>
          </TabsContent>

          <TabsContent value="servicios" className="mt-6">
             <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Servicios ("Lo que hago")</CardTitle><Dialog open={isServiceDialogOpen} onOpenChange={(isOpen) => { setIsServiceDialogOpen(isOpen); if (!isOpen) setEditingService(null); }}><DialogTrigger asChild><Button onClick={handleAddNewService}><PlusCircle className="mr-2 h-4 w-4" />Añadir Servicio</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingService ? 'Editar' : 'Crear'} Servicio</DialogTitle></DialogHeader><ServiceForm service={editingService} onSave={handleServiceSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingServices ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[50px]">Icono</TableHead><TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{services.map((service) => (<TableRow key={service.id}><TableCell>{service.iconUrl && <img src={service.iconUrl} alt={service.title} className="w-8 h-8" />}</TableCell><TableCell className="font-medium">{service.title}</TableCell><TableCell className="max-w-[300px] truncate">{service.description}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditService(service)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el servicio.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteService(service.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card>
          </TabsContent>
          
          <TabsContent value="proyectos" className="mt-6">
            <Tabs defaultValue="manage-posts"><TabsList className="mb-4"><TabsTrigger value="manage-posts">Gestionar Entradas</TabsTrigger><TabsTrigger value="manage-categories">Gestionar Categorías</TabsTrigger></TabsList><TabsContent value="manage-posts"><Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Proyectos y Blog</CardTitle></div><Dialog open={isProjectDialogOpen} onOpenChange={(isOpen) => { setIsProjectDialogOpen(isOpen); if (!isOpen) setEditingProject(null); }}><DialogTrigger asChild><Button onClick={handleAddNewProject}><PlusCircle className="mr-2 h-4 w-4" />Añadir Nuevo</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingProject ? 'Editar' : 'Crear'}</DialogTitle></DialogHeader><ProjectForm project={editingProject} onSave={handleProjectSaved} availableCategories={blogCategories} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingProjects ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[50px]">Tipo</TableHead><TableHead>Título</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{projects.map((project) => { const category = blogCategories.find(c => c.id === project.categoryId); return (<TableRow key={project.id}><TableCell>{project.type === 'blog' ? <FileCode className="h-5 w-5 text-primary" /> : <Briefcase className="h-5 w-5 text-muted-foreground" />}</TableCell><TableCell className="font-medium">{project.title}</TableCell><TableCell className="text-muted-foreground">{category?.title || 'Sin categoría'}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la entrada.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProject(project.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)})}</TableBody></Table>)}</CardContent></Card></TabsContent><TabsContent value="manage-categories"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Categorías de Blog</CardTitle><Dialog open={isBlogCategoryDialogOpen} onOpenChange={(isOpen) => { setIsBlogCategoryDialogOpen(isOpen); if (!isOpen) setEditingBlogCategory(null); }}><DialogTrigger asChild><Button onClick={handleAddNewBlogCategory}><PlusCircle className="mr-2 h-4 w-4" />Añadir Categoría</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingBlogCategory ? 'Editar' : 'Crear'} Categoría</DialogTitle></DialogHeader><BlogCategoryForm category={editingBlogCategory} onSave={handleBlogCategorySaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingBlogCategories ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[100px]">Imagen</TableHead><TableHead>Título</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{blogCategories.map((category) => (<TableRow key={category.id}><TableCell><ImageIcon className="h-8 w-8 text-muted-foreground" /></TableCell><TableCell className="font-medium">{category.title}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditBlogCategory(category)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la categoría.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBlogCategory(category.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card></TabsContent></Tabs>
          </TabsContent>

          <TabsContent value="formacion" className="mt-6">
            <Tabs defaultValue="certifications"><TabsList className="mb-4"><TabsTrigger value="certifications">Certificaciones</TabsTrigger><TabsTrigger value="courses">Cursos (Aprende)</TabsTrigger><TabsTrigger value="aprende">Aprende</TabsTrigger></TabsList><TabsContent value="certifications"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Certificaciones y Formación</CardTitle><Dialog open={isFormationDialogOpen} onOpenChange={(isOpen) => { setIsFormationDialogOpen(isOpen); if (!isOpen) setEditingFormation(null); }}><DialogTrigger asChild><Button onClick={handleAddNewFormation}><PlusCircle className="mr-2 h-4 w-4" />Añadir Formación</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingFormation ? 'Editar' : 'Crear'} Formación</DialogTitle></DialogHeader><FormationForm formation={editingFormation} onSave={handleFormationSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingFormations ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead>Etiqueta</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{formations.filter(f => !f.tag).map((formation) => (<TableRow key={formation.id}><TableCell className="font-medium">{formation.title}</TableCell><TableCell className="max-w-[300px] truncate">{formation.description}</TableCell><TableCell><Badge variant="secondary">Certificación</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditFormation(formation)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la formación.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteFormation(formation.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card></TabsContent><TabsContent value="courses"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Cursos "Aprende"</CardTitle><Dialog open={isFormationDialogOpen} onOpenChange={(isOpen) => { setIsFormationDialogOpen(isOpen); if (!isOpen) setEditingFormation(null); }}><DialogTrigger asChild><Button onClick={handleAddNewFormation}><PlusCircle className="mr-2 h-4 w-4" />Añadir Curso</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingFormation ? 'Editar' : 'Crear'} Curso</DialogTitle></DialogHeader><FormationForm formation={editingFormation} onSave={handleFormationSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingFormations ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead>Etiqueta</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{formations.filter(f => f.tag).map((formation) => (<TableRow key={formation.id}><TableCell className="font-medium">{formation.title}</TableCell><TableCell className="max-w-[300px] truncate">{formation.description}</TableCell><TableCell><Badge variant="outline">{formation.tag}</Badge></TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditFormation(formation)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el curso.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteFormation(formation.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card></TabsContent><TabsContent value="aprende"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Constructor de Páginas "Aprende"</CardTitle><Button onClick={handleAddNewAprendePage}><PlusCircle className="mr-2 h-4 w-4" />Crear Nueva Página</Button></CardHeader><CardContent>{isLoadingAprendePages ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Código</TableHead><TableHead>Fecha Creación</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{aprendePages.length > 0 ? (aprendePages.map((page) => (<TableRow key={page.id}><TableCell className="font-medium">{page.title}</TableCell><TableCell>{page.code}</TableCell><TableCell>{page.createdAt ? new Date(page.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Abrir menú</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => window.open(`/aprende/view/${page.id}`, '_blank')}><Eye className="mr-2 h-4 w-4" />Ver</DropdownMenuItem><DropdownMenuItem onClick={() => handleDuplicateAprendePage(page.id)}><Copy className="mr-2 h-4 w-4" />Duplicar</DropdownMenuItem><DropdownMenuItem onClick={() => handleEditAprendePage(page)}><Pencil className="mr-2 h-4 w-4" />Editar</DropdownMenuItem><DropdownMenuItem onClick={() => setDeletingAprendePage(page)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))) : (<TableRow><TableCell colSpan={4} className="h-24 text-center">No has creado ninguna página todavía.</TableCell></TableRow>)}</TableBody></Table>)}</CardContent></Card></TabsContent></Tabs>
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <Tabs defaultValue="manage-links"><TabsList className="mb-4"><TabsTrigger value="manage-links">Gestionar Enlaces</TabsTrigger><TabsTrigger value="manage-cards">Gestionar Categorías</TabsTrigger></TabsList><TabsContent value="manage-links"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Enlaces de Interés</CardTitle><Dialog open={isLinkDialogOpen} onOpenChange={(isOpen) => { setIsLinkDialogOpen(isOpen); if (!isOpen) setEditingLink(null); }}><DialogTrigger asChild><Button onClick={handleAddNewLink}><PlusCircle className="mr-2 h-4 w-4" />Añadir Enlace</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingLink ? 'Editar' : 'Crear'} Enlace</DialogTitle></DialogHeader><LinkForm link={editingLink} onSave={handleLinkSaved} availableCards={linkCards} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingLinks ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Etiqueta</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{links.map((link) => { const card = linkCards.find(c => c.id === link.cardId); return (<TableRow key={link.id}><TableCell className="font-medium">{link.title}</TableCell><TableCell><Badge variant="secondary">{link.tag}</Badge></TableCell><TableCell className="text-muted-foreground">{card?.title || 'Sin categoría'}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditLink(link)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el enlace.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteLink(link.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)})}</TableBody></Table>)}</CardContent></Card></TabsContent><TabsContent value="manage-cards"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Categorías de Enlaces</CardTitle><Dialog open={isLinkCardDialogOpen} onOpenChange={(isOpen) => { setIsLinkCardDialogOpen(isOpen); if (!isOpen) setEditingLinkCard(null); }}><DialogTrigger asChild><Button onClick={handleAddNewLinkCard}><PlusCircle className="mr-2 h-4 w-4" />Añadir Categoría</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingLinkCard ? 'Editar' : 'Crear'} Categoría</DialogTitle></DialogHeader><LinkCardForm card={editingLinkCard} onSave={handleLinkCardSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingLinkCards ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[100px]">Imagen</TableHead><TableHead>Título</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{linkCards.map((card) => (<TableRow key={card.id}><TableCell><ImageIcon className="h-8 w-8 text-muted-foreground" /></TableCell><TableCell className="font-medium">{card.title}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditLinkCard(card)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la categoría.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteLinkCard(card.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card></TabsContent></Tabs>
          </TabsContent>
          
          <TabsContent value="shorts" className="mt-6">
              <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>YouTube Shorts</CardTitle><Dialog open={isShortDialogOpen} onOpenChange={(isOpen) => { setIsShortDialogOpen(isOpen); if (!isOpen) setEditingShort(null); }}><DialogTrigger asChild><Button onClick={handleAddNewShort}><PlusCircle className="mr-2 h-4 w-4" />Añadir Short</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingShort ? 'Editar' : 'Crear'} Short</DialogTitle></DialogHeader><ShortForm short={editingShort} onSave={handleShortSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingShorts ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[50px]">Icono</TableHead><TableHead>Título</TableHead><TableHead>Etiquetas</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{shorts.map((short) => (<TableRow key={short.id}><TableCell><Youtube className="h-6 w-6 text-red-600" /></TableCell><TableCell className="font-medium">{short.title}</TableCell><TableCell><div className="flex flex-wrap gap-1 max-w-[250px]">{short.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div></TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditShort(short)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el short.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteShort(short.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
             <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Prompts</CardTitle><Dialog open={isPromptDialogOpen} onOpenChange={(isOpen) => { setIsPromptDialogOpen(isOpen); if (!isOpen) setEditingPrompt(null); }}><DialogTrigger asChild><Button onClick={handleAddNewPrompt}><PlusCircle className="mr-2 h-4 w-4" />Añadir Prompt</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingPrompt ? 'Editar' : 'Crear'} Prompt</DialogTitle></DialogHeader><PromptForm prompt={editingPrompt} onSave={handlePromptSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingPrompts ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[50px]">Icono</TableHead><TableHead>Título</TableHead><TableHead>Descripción</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{prompts.map((prompt) => (<TableRow key={prompt.id}><TableCell><Terminal className="h-5 w-5 text-primary" /></TableCell><TableCell className="font-medium">{prompt.title}</TableCell><TableCell className="max-w-[300px] truncate">{prompt.description}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditPrompt(prompt)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el prompt.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeletePrompt(prompt.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card>
          </TabsContent>
          
          <TabsContent value="galeria" className="mt-6">
            <Card><CardHeader><CardTitle className="font-headline text-3xl">Galería de Imágenes</CardTitle></CardHeader><CardContent><ImageGallery /></CardContent></Card>
          </TabsContent>
          
          <TabsContent value="disenos" className="mt-6">
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="font-headline text-3xl">Diseños</CardTitle><Dialog open={isDesignDialogOpen} onOpenChange={(isOpen) => { setIsDesignDialogOpen(isOpen); if (!isOpen) setEditingDesign(null); }}><DialogTrigger asChild><Button onClick={handleAddNewDesign}><PlusCircle className="mr-2 h-4 w-4" />Añadir Diseño</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingDesign ? 'Editar' : 'Crear'} Diseño</DialogTitle></DialogHeader><DesignForm design={editingDesign} onSave={handleDesignSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingDesigns ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[100px]">Imagen</TableHead><TableHead>Título</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{designs.length > 0 ? designs.map((design) => (<TableRow key={design.id}><TableCell><Image src={design.imageUrl} alt={design.title} width={60} height={60} className="rounded-md object-cover aspect-square" /></TableCell><TableCell className="font-medium">{design.title}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditDesign(design)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el diseño.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteDesign(design.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)) : (<TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No has añadido ningún diseño.</TableCell></TableRow>)}</TableBody></Table>)}</CardContent></Card>
          </TabsContent>

          <TabsContent value="n8n" className="mt-6">
             <Tabs defaultValue="manage-templates"><TabsList className="mb-4"><TabsTrigger value="manage-templates">Plantillas</TabsTrigger><TabsTrigger value="manage-servers">Servidores</TabsTrigger></TabsList><TabsContent value="manage-templates"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="font-headline text-3xl">Plantillas N8N</CardTitle><Dialog open={isN8nTemplateDialogOpen} onOpenChange={(isOpen) => { setIsN8nTemplateDialogOpen(isOpen); if (!isOpen) setEditingN8nTemplate(null); }}><DialogTrigger asChild><Button onClick={handleAddNewN8nTemplate}><PlusCircle className="mr-2 h-4 w-4" />Añadir Plantilla</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{editingN8nTemplate ? 'Editar' : 'Crear'} Plantilla</DialogTitle></DialogHeader><N8NTemplateForm template={editingN8nTemplate} onSave={handleN8nTemplateSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingN8nTemplates ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{n8nTemplates.length > 0 ? n8nTemplates.map((template) => (<TableRow key={template.id}><TableCell className="font-medium">{template.title}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditN8nTemplate(template)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la plantilla.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteN8nTemplate(template.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)) : (<TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No has añadido ninguna plantilla.</TableCell></TableRow>)}</TableBody></Table>)}</CardContent></Card></TabsContent><TabsContent value="manage-servers"><Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Servidores N8N</CardTitle><Dialog open={isN8nServerDialogOpen} onOpenChange={(isOpen) => { setIsN8nServerDialogOpen(isOpen); if (!isOpen) setEditingN8nServer(null); }}><DialogTrigger asChild><Button onClick={handleAddNewN8nServer}><PlusCircle className="mr-2 h-4 w-4" />Añadir Servidor</Button></DialogTrigger><DialogContent className="sm:max-w-[625px] glass-card"><DialogHeader><DialogTitle>{editingN8nServer ? 'Editar' : 'Crear'} Servidor</DialogTitle></DialogHeader><N8NServerForm server={editingN8nServer} onSave={handleN8nServerSaved} /></DialogContent></Dialog></CardHeader><CardContent>{isLoadingN8nServers ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead className="w-[50px]">Icono</TableHead><TableHead>Título</TableHead><TableHead>URL</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{n8nServers.map((server) => (<TableRow key={server.id}><TableCell><Server className="h-5 w-5 text-primary" /></TableCell><TableCell className="font-medium">{server.title}</TableCell><TableCell className="text-muted-foreground truncate max-w-xs">{server.url}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleEditN8nServer(server)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el servidor.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteN8nServer(server.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>))}</TableBody></Table>)}</CardContent></Card></TabsContent></Tabs>
          </TabsContent>

          <TabsContent value="htmls" className="mt-6">
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="font-headline text-3xl">Páginas HTML</CardTitle><Dialog open={isHtmlDialogOpen} onOpenChange={(isOpen) => { setIsHtmlDialogOpen(isOpen); if (!isOpen) setEditingHtml(null); }}><DialogTrigger asChild><Button onClick={handleAddNewHtml}><PlusCircle className="mr-2 h-4 w-4" />Añadir Página HTML</Button></DialogTrigger></Dialog></CardHeader><CardContent>{isLoadingHtmls ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (<Table><TableHeader><TableRow><TableHead>Título</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{htmls.length > 0 ? htmls.map((htmlPage) => (<TableRow key={htmlPage.id}><TableCell className="font-medium">{htmlPage.title}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => window.open(`/htmls/${htmlPage.id}`, '_blank')}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleEditHtml(htmlPage)}><Edit className="h-4 w-4" /></Button><AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la página HTML.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteHtml(htmlPage.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></TableCell></TableRow>)) : (<TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No has añadido ninguna página.</TableCell></TableRow>)}</TableBody></Table>)}</CardContent></Card>
          </TabsContent>

           <TabsContent value="protocols" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Protocolos de Actuación</CardTitle>
                <Button onClick={handleAddNewProtocol}><PlusCircle className="mr-2 h-4 w-4" />Añadir Protocolo</Button>
              </CardHeader>
              <CardContent>
                {isLoadingProtocols ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (
                  <Accordion type="single" collapsible className="w-full">
                    {protocols.map(protocol => (
                      <AccordionItem value={protocol.id!} key={protocol.id}>
                        <Card className="mb-2 glass-card">
                           <AccordionTrigger className="w-full text-left p-4 hover:no-underline">
                             <div className="flex justify-between items-center w-full">
                                <span className="font-headline text-xl">{protocol.title}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleViewProtocol(protocol);}}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleEditProtocol(protocol)}}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará el protocolo.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProtocol(protocol.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                             </div>
                           </AccordionTrigger>
                           <AccordionContent className="p-4 pt-0">
                             <div className="prose prose-invert max-w-none">
                                {protocol.steps?.map((step, index) => (
                                  <div key={index} className="py-4 border-b border-primary/20">
                                      <h4 className="font-bold text-primary">Paso {index + 1}: {step.title}</h4>
                                      <p>{step.description}</p>
                                      {step.imageUrl && <img src={step.imageUrl} alt={`Paso ${index+1}`} className="mt-2 rounded-md max-w-full h-auto" />}
                                  </div>
                                ))}
                             </div>
                           </AccordionContent>
                        </Card>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notas Rápidas</CardTitle>
                <Button onClick={handleAddNewNote}><PlusCircle className="mr-2 h-4 w-4" />Añadir Nota</Button>
              </CardHeader>
              <CardContent>
                {isLoadingNotes ? (<div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Contenido</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {notes.map((note) => (
                        <TableRow key={note.id}>
                          <TableCell className="font-medium">{note.title}</TableCell>
                          <TableCell className="max-w-md truncate">{note.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditNote(note)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                              <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción eliminará la nota.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteNote(note.id!)}>Eliminar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
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
    </main>
  );
}

