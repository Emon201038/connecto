export const TextEditor = ({
  parentRef,
  editorRef,
  position,
  rotation,
  inputText,
  setInputText,
  handleMouseDown,
}: any) => (
  <div className="w-full h-full flex justify-center items-center py-6 overflow-hidden">
    <div
      ref={parentRef}
      className="w-75! border h-full relative overflow-hidden"
      style={{ userSelect: "none", background: "blue" }}
    >
      <p
        className="absolute font-bold opacity-50 z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ display: inputText.trim() ? "none" : "block" }}
      >
        Start typing
      </p>
      <div
        ref={editorRef}
        className="focus:outline-none select-text whitespace-pre-wrap wrap-break-word max-w-[90%] min-w-25 text-center absolute z-20"
        style={{
          position: "absolute",
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        }}
        role="textbox"
        contentEditable
        spellCheck
        aria-multiline
        draggable={!!inputText.trim()}
        onMouseDown={handleMouseDown}
        onInput={(e) => setInputText((e.target as HTMLDivElement).innerText)}
      />
    </div>
  </div>
);
