import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <FileSearch className="h-8 w-8 text-blue-500 mr-2" />
            <span className="text-xl font-bold text-gray-900">PDF OCR</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Trang chủ
            </Link>
            <Link to="/app" className="text-gray-700 hover:text-blue-500">
              Chuyển đổi
            </Link>
            <Link to="/huong-dan" className="text-gray-700 hover:text-blue-500">
              Hướng dẫn
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-blue-500">
              FAQ
            </Link>
          </nav>
          
          <div>
            <Link to="/app">
              <Button>Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 