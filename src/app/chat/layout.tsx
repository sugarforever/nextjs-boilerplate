export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full viewport height since navbar is hidden on chat page
  return (
    <main className="h-dvh overflow-hidden">
      {children}
    </main>
  );
}
