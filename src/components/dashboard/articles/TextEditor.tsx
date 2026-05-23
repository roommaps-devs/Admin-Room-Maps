"use client";

import React, { useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  Link as LinkIcon, 
  Eye, 
  Edit2,
  Trash2
} from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TextEditor({
  value,
  onChange,
  placeholder = "Write the article body content here...",
  required = false
}: TextEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value;
    const selection = text.substring(start, end);
    const replacement = before + selection + after;

    onChange(
      text.substring(0, start) +
      replacement +
      text.substring(end)
    );

    // Refocus and set cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selection.length
      );
    }, 0);
  };

  const clearContent = () => {
    if (confirm("Are you sure you want to clear all editor content?")) {
      onChange("");
    }
  };

  // Basic markdown-like simple renderer for real-time preview
  const renderPreview = (md: string) => {
    if (!md.trim()) {
      return `<p class="text-slate-400 dark:text-slate-500 italic text-xs">Nothing to preview yet. Start writing in the editor...</p>`;
    }

    const paragraphs = md.split("\n\n").map(para => para.trim()).filter(Boolean);
    
    return paragraphs.map(para => {
      // Heading 1
      if (para.startsWith("# ")) {
        return `<h1 class="text-lg font-black mt-4 mb-2 tracking-tight text-slate-900 dark:text-white">${para.slice(2)}</h1>`;
      }
      // Heading 2
      if (para.startsWith("## ")) {
        return `<h2 class="text-base font-black mt-3 mb-2 tracking-tight text-slate-800 dark:text-slate-200">${para.slice(3)}</h2>`;
      }
      // Blockquote
      if (para.startsWith("> ")) {
        return `<blockquote class="border-l-4 border-[#FF5211] pl-4 italic text-slate-600 dark:text-slate-400 my-3 bg-[#FF5211]/5 py-2 px-3 rounded-r-xl text-xs">${para.slice(2)}</blockquote>`;
      }
      // Bullet list
      if (para.startsWith("- ") || para.startsWith("* ")) {
        const items = para.split(/\n[-*]\s+/).map(item => item.replace(/^[-*]\s+/, ""));
        return `<ul class="list-disc pl-5 my-2 space-y-1 text-xs text-slate-700 dark:text-slate-300">
          ${items.map(item => `<li>${item}</li>`).join("")}
        </ul>`;
      }

      // Inline styles parsing (Bold, Italic, Link)
      let parsedHTML = para
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-[#FF5211] font-bold hover:underline">$1</a>');

      return `<p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">${parsedHTML}</p>`;
    }).join("");
  };

  // Helper component to render Tooltip button
  const ToolbarButton = ({ 
    label, 
    onClick, 
    children 
  }: { 
    label: string; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={onClick}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-90 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={5}
            className="z-[11000] px-2.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-lg shadow-md uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1 duration-150"
          >
            {label}
            <Tooltip.Arrow className="fill-slate-900 dark:fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );

  return (
    <div className="flex flex-col border border-[#0A0A0A]/5 dark:border-white/10 rounded-2xl overflow-hidden bg-[#FBFBFA] dark:bg-white/[0.01]">
      
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#121214] border-b border-[#0A0A0A]/5 dark:border-white/10">
        
        {/* Formatting actions toolbar (only in edit mode) */}
        {activeTab === "write" ? (
          <div className="flex items-center gap-1.5">
            <ToolbarButton label="Bold" onClick={() => insertFormat("**", "**")}>
              <Bold size={14} />
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => insertFormat("*", "*")}>
              <Italic size={14} />
            </ToolbarButton>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />
            <ToolbarButton label="Heading 1" onClick={() => insertFormat("# ")}>
              <Heading1 size={14} />
            </ToolbarButton>
            <ToolbarButton label="Heading 2" onClick={() => insertFormat("## ")}>
              <Heading2 size={14} />
            </ToolbarButton>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />
            <ToolbarButton label="Blockquote" onClick={() => insertFormat("> ")}>
              <Quote size={14} />
            </ToolbarButton>
            <ToolbarButton label="Bullet List" onClick={() => insertFormat("- ")}>
              <List size={14} />
            </ToolbarButton>
            <ToolbarButton label="Insert Link" onClick={() => insertFormat("[", "](url)")}>
              <LinkIcon size={14} />
            </ToolbarButton>
            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1" />
            <ToolbarButton label="Clear Editor" onClick={clearContent}>
              <Trash2 size={14} className="text-red-500 hover:text-red-600" />
            </ToolbarButton>
          </div>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1.5">
            <Eye size={12} />
            Real-time HTML Preview
          </span>
        )}

        {/* Tab Selector */}
        <div className="flex items-center bg-[#F3F4F6] dark:bg-white/5 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "write"
                ? "bg-white dark:bg-[#121214] shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Edit2 size={12} />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "preview"
                ? "bg-white dark:bg-[#121214] shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Eye size={12} />
            Preview
          </button>
        </div>

      </div>

      {/* Editor Body */}
      <div className="relative">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full h-44 min-h-[160px] p-4 bg-transparent focus:outline-none text-xs font-bold text-slate-800 dark:text-slate-200 placeholder:opacity-40 leading-relaxed resize-none"
          />
        ) : (
          <div 
            className="w-full h-44 min-h-[160px] p-4 overflow-y-auto leading-relaxed border-none prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        )}
      </div>

    </div>
  );
}
