export const HighlightHashtags = ({ text }: { text: string }) => {
  // Regex to split text while keeping hashtags
  const parts = text.split(/(#[a-zA-Z0-9_]+)/g);

  return (
    <div>
      {parts.map((part, index) => {
        if (part.match(/#[a-zA-Z0-9_]+/)) {
          return (
            <span
              key={index}
              style={{
                color: "rgb(0, 100, 209)",
                fontWeight: 600,
                fontSize: "14px",
              }}
              className="cursor-pointer hover:underline"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
