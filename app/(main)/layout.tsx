import { AppSidebar } from "../../components/app-sidebar";
import Header from "../../components/layout/Header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="mt-12 text-foreground font-semibold border-border h-[calc(100vh-72px)] overflow-hidden">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
