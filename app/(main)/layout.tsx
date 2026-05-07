import { AppSidebar } from "../../components/app-sidebar";
import Header from "../../components/layout/Header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen overflow-scroll">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full h-full overflow-hidden">
          <Header />
          <div className="flex-1 text-foreground font-semibold border-border">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
