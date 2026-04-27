export default function TaskDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-background">
      {children}
    </div>
  );
}
