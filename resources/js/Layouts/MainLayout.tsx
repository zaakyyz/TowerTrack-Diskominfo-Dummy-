import React, { ReactNode } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppBar from '@/Components/AppBar';
import Footer from '@/Components/Footer';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  currentPage?: string;
  headerSlot?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'TowerTrack',
  currentPage = '',
  headerSlot
}) => {
  const { demoReadOnly, demoSurveyCoordinates } = usePage().props as {
    demoReadOnly?: boolean;
    demoSurveyCoordinates?: boolean;
  };
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Head title={title} />

      {/* App Bar */}
      <AppBar currentPage={currentPage} />

      {demoReadOnly && (
        <div role="status" className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
          {demoSurveyCoordinates
            ? 'Demo portofolio: koordinat menara dan FO berasal dari survei. Alamat jalan asli, pemilik, dan rincian izin belum tersedia; kecamatan adalah perkiraan. Formulir dan perubahan data dinonaktifkan.'
            : 'Demo portofolio dengan data fiktif. Pengiriman formulir dan perubahan data dinonaktifkan.'}
        </div>
      )}

      {/* Optional Full Width Header Slot */}
      {headerSlot}

      {/* Main Content */}
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-4 md:px-6 lg:px-8 flex-1 w-full">
        <main className="py-6 sm:py-8">{children}</main>
      </div>

      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
}

export default MainLayout;
