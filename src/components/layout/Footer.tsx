
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lumbang-primary text-white py-4 text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {currentYear} Presensi Lumbang. Semua Hak Dilindungi.
        </p>
        <p className="text-xs mt-1 opacity-75">Versi: 1.0.0 (Android)</p>
      </div>
    </footer>
  );
};

export default Footer;
