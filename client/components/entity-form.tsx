"use client";

import { cn } from "@/lib/utils";
import type { Entity, Suggestion } from "@/types";
import { Loader2 } from "lucide-react";
import type React from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface EntityInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  getText: () => string;
  getEntities: () => Entity[];
}

interface IEntityFormProps {
  onChange?: (text: string, entities: Entity[]) => void;
  initialValue?: string;
  value?: string;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
}

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
  text: string,
  data: { id: string; name: string },
): HTMLSpanElement => {
  const span = document.createElement("span");
  span.className =
    type === "mention"
      ? "bg-[rgba(8,102,255,0.2)] text-[rgb(8,8,9)] text-[14px] font-normal rounded-none"
      : "bg-[rgba(8,102,255,0.2)] text-[rgb(8,8,9)] text-[14px] font-normal rounded-none";
  span.contentEditable = "false";
  span.dataset.type = type;
  span.dataset.id = data.id;
  span.dataset.name = data.name;
  span.innerText = text;
  return span;
};

const hashtagRegex = /(^|\s)(#[^\s#]+)/g;

const getRawTextAndEntitiesFromDOM = (editor: HTMLDivElement) => {
  let text = "";
  const entities: Entity[] = [];
  let offset = 0;

  editor.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
      offset += (node.textContent || "").length;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const type = element.dataset.type as "mention" | "hashtag" | undefined;
      if (type && (type === "mention" || type === "hashtag")) {
        const textContent = element.textContent || "";
        entities.push({
          type,
          offset,
          end: offset + textContent.length,
          id: element.dataset.id,
          name: element.dataset.name,
          tag: type === "hashtag" ? element.dataset.name : undefined,
        });
        text += textContent;
        offset += textContent.length;
      } else {
        text += node.textContent || "";
        offset += (node.textContent || "").length;
      }
    }
  });
  return { rawText: text, entities };
};

export function EntityInput({
  value,
  entities,
  onChange,
  className = "",
  placeholder = "",
  onSubmit,
  children,
}: {
  value: string;
  entities: Entity[];
  onChange: (text: string, entities: Entity[]) => void;
  className?: string;
  placeholder?: string;
  children?: React.ReactNode;
  onSubmit?: () => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const activeTokenRef = useRef<{
    type: "mention" | "hashtag";
    word: string;
    range: Range;
  } | null>(null);
  const isComposing = useRef(false);
  const isUpdatingFromSuggestion = useRef(false);

  useEffect(() => {
    if (!editorRef.current || isUpdatingFromSuggestion.current) return;

    const { rawText: currentText } = getRawTextAndEntitiesFromDOM(
      editorRef.current,
    );

    // Avoid re-rendering if the text content is the same, which can happen during composition
    if (value === currentText) {
      return;
    }

    const selection = window.getSelection();
    const range =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    let cursorPosition = -1;

    if (range && editorRef.current.contains(range.startContainer)) {
      const preCursorRange = document.createRange();
      preCursorRange.selectNodeContents(editorRef.current);
      try {
        preCursorRange.setEnd(range.startContainer, range.startOffset);
        cursorPosition = preCursorRange.toString().length;
      } catch (e) {
        console.warn("Could not calculate cursor position.", e);
      }
    }

    editorRef.current.innerHTML = "";

    if (value === "") {
      return;
    }

    let lastIndex = 0;
    const sortedEntities = entities
      ? [...entities].sort((a, b) => a.offset - b.offset)
      : [];

    sortedEntities.forEach((entity) => {
      if (entity.offset > lastIndex) {
        editorRef.current!.appendChild(
          document.createTextNode(value.substring(lastIndex, entity.offset)),
        );
      }
      const entityText = value.substring(entity.offset, entity.end);
      const entityNode = createEntityNode(entity.type, entityText, {
        id: entity.id || entity.name || "",
        name: entity.name || "",
      });
      editorRef.current!.appendChild(entityNode);
      lastIndex = entity.end;
    });

    if (lastIndex < value.length) {
      editorRef.current!.appendChild(
        document.createTextNode(value.substring(lastIndex)),
      );
    }

    if (cursorPosition !== -1) {
      try {
        const newRange = document.createRange();
        let charCount = 0;
        const nodeStack: Node[] = [...editorRef.current.childNodes];
        let node: Node | undefined;
        let found = false;

        while (!found && (node = nodeStack.shift())) {
          if (node.nodeType === Node.TEXT_NODE) {
            const textLength = node.textContent?.length || 0;
            if (charCount + textLength >= cursorPosition) {
              newRange.setStart(node, cursorPosition - charCount);
              newRange.collapse(true);
              found = true;
            }
            charCount += textLength;
          } else {
            const element = node as HTMLElement;
            const textLength = element.textContent?.length || 0;
            if (element.childNodes.length > 0) {
              nodeStack.unshift(...Array.from(element.childNodes));
            } else {
              charCount += textLength;
            }
          }
        }

        if (found) {
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        }
      } catch (e) {
        console.warn("Could not restore cursor position", e);
      }
    }
  }, [value, entities]);

  const processInput = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current;

    const { rawText, entities: currentEntities } =
      getRawTextAndEntitiesFromDOM(editor);

    const newEntities: Entity[] = [];

    // Regex to find hashtags that are not already inside a mention entity
    const hashtagRegex = /#(\w+)/g;
    let match;

    // Create a map of mention ranges to avoid creating hashtags inside them
    const mentionRanges = currentEntities
      .filter((e) => e.type === "mention")
      .map((e) => ({ start: e.offset, end: e.end }));

    while ((match = hashtagRegex.exec(rawText)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;

      const isInsideMention = mentionRanges.some(
        (range) => matchStart >= range.start && matchEnd <= range.end,
      );

      if (isInsideMention) continue;

      newEntities.push({
        type: "hashtag",
        offset: match.index,
        end: match.index + match[0].length,
        id: match[1],
        name: match[1],
        tag: match[1],
      });
    }

    const finalEntities = currentEntities
      .filter((e) => e.type === "mention")
      .concat(newEntities);
    finalEntities.sort((a, b) => a.offset - b.offset);

    onChange(rawText, finalEntities);
  };

  const handleInput = async () => {
    if (isComposing.current || isUpdatingFromSuggestion.current) return;
    if (!editorRef.current) return;

    processInput();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

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
        textBeforeCursor.length - (word.length + 1),
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
            m.name.toLowerCase().startsWith(word.toLowerCase()),
          );
        } else {
          const filteredHashtags = MOCK_HASHTAGS.filter((tag) =>
            tag.toLowerCase().startsWith(word.toLowerCase()),
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
        toast("AI Error", {
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
    if (!activeTokenRef.current || !editorRef.current) return;

    isUpdatingFromSuggestion.current = true;
    const { type, range } = activeTokenRef.current;

    range.deleteContents();

    const newEntityText =
      type === "mention" ? suggestion.name : `#${suggestion.name}`;

    const entityNode = createEntityNode(type, newEntityText, {
      id: suggestion.id,
      name: suggestion.name,
    });

    range.insertNode(entityNode);

    const spaceNode = document.createTextNode("\u00A0"); // non-breaking space
    range.setStartAfter(entityNode);
    range.insertNode(spaceNode);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    editorRef.current.focus();

    processInput();

    setShowSuggestions(false);
    activeTokenRef.current = null;

    // Defer resetting the flag to allow the DOM to update
    setTimeout(() => {
      isUpdatingFromSuggestion.current = false;
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      showSuggestions &&
      (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter")
    ) {
      e.preventDefault();
      // Basic navigation could be implemented here
    }
  };

  const handleBlur = () => {
    // Small timeout to allow suggestion click to register before hiding
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        onCompositionStart={() => (isComposing.current = true)}
        onCompositionEnd={() => {
          isComposing.current = false;
          handleInput();
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        data-placeholder={placeholder}
        className={cn(
          "min-h-30 w-full rounded-md",
          "px-3 py-2 text-base",
          "focus-visible:outline-none outline-none ring-0 border-none",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-input",
          "whitespace-pre-wrap wrap-break-word",
          !value &&
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none",
          className,
        )}
      />
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
      {children}
    </div>
  );
}
