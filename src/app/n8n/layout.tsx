
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";

export default function N8NLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full flex flex-col items-center overflow-x-hidden bg-background min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
