"use client";

import { cn } from "@/lib/utils";
import type { Entity, Suggestion } from "@/types";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const MOCK_HASHTAGS = [
  "nextjs",
  "react",
  "typescript",
  "genai",
  "firebase",
  "tailwindcss",
  "javascript",
  "webdev",
  "coding",
  "software",
  "ai",
];

const MOCK_MENTIONS: Suggestion[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Peter Jones" },
  { id: "4", name: "Alice Williams" },
  { id: "5", name: "nas" },
  { id: "6", name: "naseem" },
  { id: "7", name: "ReactTeam" },
  { id: "8", name: "NextJS" },
];

const createEntityNode = (
  type: "mention" | "hashtag",
  suggestion: Suggestion
): HTMLSpanElement => {
  const span = document.createElement("span");
  span.className =
    type === "mention"
      ? "text-primary font-semibold bg-primary/10 rounded-md px-1"
      : "bg-[rgba(8,102,255,0.2)] text-[rgb(8,8,9)] text-sm font-normal rounded-md px-1";
  span.contentEditable = "false";
  span.dataset.type = type;
  span.dataset.id = suggestion.id;
  span.dataset.name = suggestion.name;
  span.innerText = type === "mention" ? suggestion.name : `#${suggestion.name}`;
  return span;
};

type Props = React.PropsWithChildren<{
  onChange: (rawText: string, entities: Entity[]) => void;
  initialValue?: string;
  className?: string;
  placeholder?: string;
}>;
export function EntityInput({
  onChange,
  initialValue = "",
  children = null,
  className = "",
  placeholder = "",
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeTokenRef = useRef<{
    type: "mention" | "hashtag";
    word: string;
    range: Range;
  } | null>(null);

  const parseAndSync = useCallback(
    (fromInput = false) => {
      if (!editorRef.current) return;

      let rawText = "";
      const entities: Entity[] = [];
      let offset = 0;

      const newChildNodes: Node[] = [];

      Array.from(editorRef.current.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          if (!fromInput) {
            const parts = node.textContent.split(/(#\w+)/g);
            parts.forEach((part) => {
              if (part.startsWith("#")) {
                const name = part.substring(1);
                const entityNode = createEntityNode("hashtag", {
                  id: name,
                  name,
                });
                newChildNodes.push(entityNode);
                entities.push({
                  type: "hashtag",
                  offset: offset,
                  end: offset + part.length,
                  id: name,
                  name: name,
                  tag: name,
                });
                rawText += part;
                offset += part.length;
              } else if (part) {
                newChildNodes.push(document.createTextNode(part));
                rawText += part;
                offset += part.length;
              }
            });
          } else {
            newChildNodes.push(node.cloneNode(true));
            rawText += node.textContent;
            offset += node.textContent.length;
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.dataset.type) {
            newChildNodes.push(element.cloneNode(true));
            const type = element.dataset.type as "mention" | "hashtag";
            const name = element.dataset.name!;
            const id = element.dataset.id!;
            const textContent = element.textContent || "";

            entities.push({
              type,
              offset,
              end: offset + textContent.length,
              id,
              name,
              tag: type === "hashtag" ? name : undefined,
            });
            rawText += textContent;
            offset += textContent.length;
          } else {
            newChildNodes.push(element.cloneNode(true));
            rawText += element.textContent || "";
            offset += element.textContent?.length || 0;
          }
        }
      });

      const currentHTML = editorRef.current.innerHTML;
      const tempDiv = document.createElement("div");
      newChildNodes.forEach((n) => tempDiv.appendChild(n));
      const newHTML = tempDiv.innerHTML;

      if (currentHTML !== newHTML && !fromInput) {
        const selection = window.getSelection();
        const range =
          selection && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;
        let cursorPosition = -1;

        if (range && editorRef.current.contains(range.startContainer)) {
          const preCursorRange = document.createRange();
          preCursorRange.selectNodeContents(editorRef.current);
          preCursorRange.setEnd(range.startContainer, range.startOffset);
          cursorPosition = preCursorRange.toString().length;
        }

        editorRef.current.innerHTML = "";
        newChildNodes.forEach((n) => editorRef.current!.appendChild(n));

        if (cursorPosition !== -1) {
          try {
            const newRange = document.createRange();
            let charCount = 0;
            let found = false;

            const findAndSet = (n: Node) => {
              if (found) return;
              if (n.nodeType === Node.TEXT_NODE) {
                const textLength = n.textContent?.length || 0;
                if (charCount + textLength >= cursorPosition) {
                  newRange.setStart(n, cursorPosition - charCount);
                  newRange.collapse(true);
                  found = true;
                }
                charCount += textLength;
              } else if (n.nodeType === Node.ELEMENT_NODE) {
                if (n.textContent) {
                  Array.from(n.childNodes).forEach(findAndSet);
                }
              }
            };

            findAndSet(editorRef.current);

            if (found) {
              selection?.removeAllRanges();
              selection?.addRange(newRange);
            }
          } catch (e) {
            console.warn("Could not restore cursor position", e);
          }
        }
      }

      onChange(rawText, entities);
    },
    [onChange]
  );

  useEffect(() => {
    if (editorRef.current && initialValue) {
      editorRef.current.innerText = initialValue;
      parseAndSync();
    }
  }, [initialValue, parseAndSync]);

  const handleInput = async () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorRef.current) return;

    parseAndSync(true);

    const range = selection.getRangeAt(0);
    const { startContainer, startOffset } = range;

    if (startContainer.nodeType !== Node.TEXT_NODE) {
      setShowSuggestions(false);
      return;
    }

    const textBeforeCursor =
      startContainer.textContent?.substring(0, startOffset) || "";
    const matches = textBeforeCursor.match(/([@#])(\w*)$/);

    if (matches) {
      const [, trigger, word] = matches;
      const type = trigger === "@" ? "mention" : "hashtag";

      const tokenRange = document.createRange();
      tokenRange.setStart(
        startContainer,
        textBeforeCursor.length - (word.length + 1)
      );
      tokenRange.setEnd(startContainer, startOffset);
      activeTokenRef.current = { type, word, range: tokenRange };

      setLoading(true);
      setShowSuggestions(true);
      setSuggestions([]);

      try {
        let finalSuggestions: Suggestion[] = [];
        if (type === "mention") {
          finalSuggestions = MOCK_MENTIONS.filter((m) =>
            m.name.toLowerCase().startsWith(word.toLowerCase())
          );
        } else {
          const filteredHashtags = MOCK_HASHTAGS.filter((tag) =>
            tag.toLowerCase().startsWith(word.toLowerCase())
          );
          finalSuggestions = filteredHashtags.map((tag) => ({
            id: tag,
            name: tag,
          }));
        }
        setSuggestions(finalSuggestions);
        if (finalSuggestions.length === 0) {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("AI suggestion failed:", error);
        toast.error("AI Error", {
          description: "Could not fetch suggestions.",
        });
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    } else {
      setShowSuggestions(false);
      activeTokenRef.current = null;
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (!activeTokenRef.current) return;

    const { type, range } = activeTokenRef.current;
    if (type === "mention") {
      const isPicked = MOCK_MENTIONS.find(
        (m) =>
          m.name.toLocaleLowerCase() === suggestion.name.toLocaleLowerCase()
      );
      if (!isPicked) return;
    }
    const entityNode = createEntityNode(type, suggestion);

    range.deleteContents();
    range.insertNode(entityNode);

    const selection = window.getSelection();
    if (selection) {
      const newRange = document.createRange();
      newRange.setStartAfter(entityNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    const space = document.createTextNode("\u00A0");
    const spaceRange = document.createRange();
    spaceRange.setStartAfter(entityNode);
    spaceRange.insertNode(space);

    const finalRange = document.createRange();
    finalRange.setStartAfter(space);
    finalRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(finalRange);

    editorRef.current?.focus();
    setShowSuggestions(false);
    activeTokenRef.current = null;
    parseAndSync();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      showSuggestions &&
      (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")
    ) {
      e.preventDefault();
      // Basic navigation could be implemented here
    }
    if (e.key === "Enter") {
      parseAndSync();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== editorRef.current) {
        setShowSuggestions(false);
      }
      parseAndSync();
    }, 150);
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        className={cn(
          "min-h-[120px] w-full rounded-md border border-input bg-transparent",
          "px-3 py-2 text-base ring-offset-background",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "whitespace-pre-wrap break-words",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
          className
        )}
      />
      {children}
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-card p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {loading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ul className="max-h-40 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="cursor-pointer rounded-sm px-3 py-1.5 text-sm hover:bg-accent"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
