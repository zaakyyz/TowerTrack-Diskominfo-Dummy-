import React from 'react';
import CrestOnBrand from './CrestOnBrand';

/**
 * The gold rule above the copyright bar is gone. It was the last ceremonial
 * use of Sun Gold anywhere in the product, and a single yellow line under an
 * otherwise entirely maroon footer read as a leftover rather than as
 * ceremony. The divider it provided is still there, in white at low alpha,
 * which separates the bar without introducing a second hue.
 */
const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-primary text-white">
      {/* Header with Logo and Title */}
      <div className="px-4 sm:px-6 lg:px-8 py-[27px] sm:py-8 border-b border-white/15">
        <div className="flex items-center justify-center gap-3">
          <CrestOnBrand alt="Logo Kabupaten Semarang" className="w-16 sm:w-20" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            TowerTrack
          </h2>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {/* Alamat */}
            <div className="text-center">
              <h4 className="mb-2 font-semibold text-white">Alamat</h4>
              <p className="leading-relaxed text-white/85">
                Jalan Diponegoro Nomor 14, Kec. Ungaran Barat,<br />
                Kabupaten Semarang, Jawa Tengah, 50511
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <h4 className="mb-2 font-semibold text-white">Email</h4>
              <a
                href="mailto:kominfo@semarangkab.go.id"
                className="rounded text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                kominfo@semarangkab.go.id
              </a>
            </div>

            {/* Telepon */}
            <div className="text-center">
              <h4 className="mb-2 font-semibold text-white">Telepon</h4>
              <div className="space-y-1 text-white/85">
                <p>Telp: (024) 6920104</p>
                <p>Faks: (024) 6929192</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/15 bg-brand-900 py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-1">
          <p className="text-white/85">
            © 2025 | Pemerintah Kabupaten Semarang
          </p>
          <p className="text-white/70">
            Powered By <span className="font-semibold text-white/90">DISKOMINFO</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
