
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lumbang-primary text-white py-4 text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">
          &copy; {currentYear} Presensi Lumbang. Semua Hak Dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
