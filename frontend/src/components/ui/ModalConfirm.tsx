import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Trash2, Loader2 } from "lucide-react";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "danger",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isLoading = false,
}: ModalConfirmProps) {
  const Icon = type === "danger" ? Trash2 : type === "warning" ? AlertCircle : Info;
  
  // High-contrast, premium color scheme
  const isDanger = type === "danger";
  const iconClasses = isDanger 
    ? "text-red-500 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30" 
    : "text-black dark:text-white bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800";
    
  const primaryBtnClasses = isDanger
    ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
    : "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-zinc-900/10";

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[440px] border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white dark:bg-gray-950 selection:bg-black selection:text-white transition-all duration-300">
        {/* Atelier Overlay Texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[1.08] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] z-0" />
        
        <div className="relative z-10 p-10 py-12 space-y-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className={`h-24 w-24 rounded-[2rem] border flex items-center justify-center transition-all duration-500 ${iconClasses} group`}>
               <Icon className="h-10 w-10 transition-transform duration-500 group-hover:scale-110" />
            </div>
            
            <div className="space-y-4">
              <DialogTitle className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase leading-[0.85] animate-in fade-in slide-in-from-bottom-2 duration-500">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                {description}
              </DialogDescription>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-16 rounded-2xl border-gray-100 dark:border-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-[1.5] h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${primaryBtnClasses}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
