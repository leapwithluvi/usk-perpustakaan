import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button 
          key={i}
          variant={i === currentPage ? "outline" : "ghost"} 
          size="sm" 
          onClick={() => onPageChange(i)}
          className={`h-8 w-8 p-0 ${
            i === currentPage 
              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 border-black dark:border-white shadow-md" 
              : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
          }`}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-10 transition-colors">
      <Button 
        variant="ghost" 
        size="sm" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="gap-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>
      
      <div className="flex items-center gap-1">
        {renderPageButtons()}
      </div>

      <Button 
        variant="ghost" 
        size="sm" 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="gap-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-30"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
