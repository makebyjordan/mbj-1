
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, LayoutGrid, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl = "https://firebasestorage.googleapis.com/v0/b/studio-7212735275-82dc4.firebasestorage.app/o/gallery%2F1758072438075_logo-mbj.png?alt=media&token=3b0f7574-c410-4a78-995e-f9ff88032f64";

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1a1631] via-[#2a234f] to-[#1a1631] z-0"></div>

        <SidebarProvider>
            <div className="relative z-10 flex w-full">
                <Sidebar>
                    <SidebarHeader>
                        <div className="flex items-center gap-2">
                             <Image
                                src={logoUrl}
                                alt="Logo Make By Jordan"
                                width={30}
                                height={30}
                                className="h-20 w-auto"
                                quality={100}
                                priority
                            />
                            <h1 className="font-headline text-3xl text-primary group-data-[collapsible=icon]:hidden">CORE</h1>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarMenu>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="/core/dashboard" tooltip="Dashboard">
                                    <LayoutGrid />
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>

                    <SidebarFooter>
                        <SidebarMenu>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="/" tooltip="Salir">
                                    <LogOut />
                                    <span>Salir al sitio web</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                
                <div className="flex-1">
                    <header className="flex h-16 items-center justify-between px-4 md:px-8 border-b border-primary/20">
                         <div className="flex items-center gap-4">
                            <SidebarTrigger className="md:hidden"/>
                            <h1 className="font-headline text-2xl text-foreground">Panel de Control</h1>
                        </div>
                        <Button asChild variant="ghost">
                            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Home className="h-4 w-4" />
                                <span>Ir al Sitio</span>
                            </Link>
                        </Button>
                    </header>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    </div>
  );
}


    