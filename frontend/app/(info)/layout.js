import InfoSidebar from "@/components/layout/InfoSidebar";
import InfoHeader from "@/components/layout/InfoHeader";

export default function InfoLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <InfoHeader />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <InfoSidebar />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
