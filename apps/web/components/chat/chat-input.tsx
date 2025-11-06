"use client";

import { Plus, UploadCloud, X, Paperclip } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onFilesSelected: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  isDragActive?: boolean;
  isDisabled?: boolean;
  selectedFiles?: Array<{ id: string; name: string }>;
}

export const ChatInput = ({
  value,
  onChange,
  onKeyDown,
  onFilesSelected,
  onFileRemove,
  isDragActive,
  isDisabled,
  selectedFiles = []
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="relative flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex-none rounded-full p-2 transition-colors",
                "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
                isDisabled && "pointer-events-none opacity-50"
              )}
            >
              <Plus className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleFileSelect} className="gap-2">
              <Paperclip className="h-4 w-4" />
              <span>Add photos & files</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative flex-1">
          <div className="relative flex flex-col min-h-[40px]">
            <Input
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything"
              aria-label="Chat message"
              className={cn(
                "border-0 focus-visible:ring-0 px-3",
                selectedFiles.length > 0 ? "pt-8 pb-2" : "py-2"
              )}
              disabled={isDisabled}
            />
            {selectedFiles.length > 0 && (
              <div className="absolute left-0 right-0 top-1 z-10 flex flex-wrap gap-1 px-3">
                {selectedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => onFileRemove?.(file.id)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            onFilesSelected(files);
            e.target.value = "";
          }}
          accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png"
          disabled={isDisabled}
        />
      </div>

      {isDragActive && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-sky-50/90 border-2 border-dashed border-sky-500">
          <div className="text-center">
            <UploadCloud className="h-6 w-6 mx-auto text-sky-500" />
            <p className="mt-1 text-sm font-medium text-sky-600">Drop files to attach</p>
          </div>
        </div>
      )}
    </div>
  );
};