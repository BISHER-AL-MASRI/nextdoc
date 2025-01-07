"use client";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";

export default function Home() {
  const textareaRefs = useRef<HTMLTextAreaElement[]>([]);

  function createNewPage(key: string, initialContent: string = "") {
    return (
      <textarea
        key={key}
        ref={(el) => {
          if (el) textareaRefs.current.push(el);
        }}
        className="w-full h-[10in] border rounded-md p-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
        placeholder="Start typing your document..."
        defaultValue={initialContent}
        onInput={handleInput}
      />
    );
  }

  function findSplitIndex(text: string): number {
    const match = text.match(/.*?[.?!](\s|$)/g);
  
    if (match && match.length > 0) {
      return text.lastIndexOf(match[match.length - 1]) + match[match.length - 1].length;
    }
  
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace !== -1) {
      return lastSpace;
    }
  
    return Math.floor(text.length / 2);
  }
  
  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLTextAreaElement;
    const overflow = target.scrollHeight > target.clientHeight;
  
    if (overflow) {
      const text = target.value;
  
      const splitIndex = findSplitIndex(text);
  
      if (splitIndex === -1) {
        console.error("Unable to find a suitable split point.");
        return;
      }
  
      const textForNextPage = text.slice(splitIndex).trim();
      target.value = text.slice(0, splitIndex).trim();
  
      const currentPageIndex = textareaRefs.current.findIndex((ref) => ref === target);
  
      if (currentPageIndex !== -1 && textareaRefs.current[currentPageIndex + 1]) {
        const nextPage = textareaRefs.current[currentPageIndex + 1];
        if (nextPage) {
          nextPage.value = textForNextPage + nextPage.value;
          nextPage.focus();
          nextPage.setSelectionRange(nextPage.value.length, nextPage.value.length);
          return;
        }
      }
  
      const newPage = createNewPage(Date.now().toString(), textForNextPage);
      setPages((prevPages) => [...prevPages, newPage]);
  
      setTimeout(() => {
        textareaRefs.current[textareaRefs.current.length - 1]?.focus();
        textareaRefs.current[textareaRefs.current.length - 1]?.setSelectionRange(textareaRefs.current[textareaRefs.current.length - 1].value.length, textareaRefs.current[textareaRefs.current.length - 1].value.length);
      }, 0);
    }
  }
  

  const [pages, setPages] = useState([createNewPage(Date.now().toString())]);

  return (
    <div className="flex flex-col h-screen">
      {/* Menubar */}
      <Menubar className="bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <Input className="w-auto h-full border-none rounded-md p-4" placeholder="Document Title" />
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Open</MenubarItem>
            <MenubarItem>Save</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Zoom In</MenubarItem>
            <MenubarItem>Zoom Out</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Document */}
      <div className="p-4 flex justify-center flex-col items-center">
        <div className="w-[8.5in] h-auto shadow-m p-4 space-y-4">
          {pages.map((page) => page)}
        </div>
      </div>

    </div>
  );
}
