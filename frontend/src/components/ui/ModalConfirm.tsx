import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, Trash2 } from "lucide-react";

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
  const Icon = type === "danger" ? Trash2 : type === "warning" ? AlertTriangle : Info;
  const iconColor = type === "danger" ? "text-red-500 bg-red-500/10" : type === "warning" ? "text-amber-500 bg-amber-500/10" : "text-blue-500 bg-blue-500/10";
  const buttonColor = type === "danger" ? "bg-red-500 hover:bg-red-600" : type === "warning" ? "bg-amber-500 hover:bg-amber-600" : "bg-black dark:bg-white dark:text-black hover:opacity-90";

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[400px] border-none shadow-2xl rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-gray-950">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`p-4 rounded-full ${iconColor} animate-in zoom-in duration-300`}>
              <Icon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black tracking-tight text-black dark:text-white uppercase leading-none">
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                {description}
              </DialogDescription>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-14 rounded-2xl border-gray-100 dark:border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 h-14 rounded-2xl text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 transition-all active:scale-95 ${buttonColor}`}
            >
              {isLoading ? "Memproses..." : confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
