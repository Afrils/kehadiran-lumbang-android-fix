
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-lumbang-primary text-white py-4 px-4 md:px-8 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">Presensi Lumbang</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-lumbang-accent"
          >
            <Home className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Beranda</span>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-lumbang-accent"
          >
            <User className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
