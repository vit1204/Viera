export default function TaskDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full overflow-hidden bg-background">
      {children}
    </div>
  );
}
