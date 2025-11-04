import { Link, useLocation } from "react-router-dom";
import { FolderOpen, Files } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <FolderOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">File Organizer</span>
          </Link>

          <div className="flex gap-2">
            <Link
              to="/"
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${isActive('/') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-secondary'
                }
              `}
            >
              Upload
            </Link>
            <Link
              to="/my-files"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${isActive('/my-files') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-secondary'
                }
              `}
            >
              <Files className="w-4 h-4" />
              My Files
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
