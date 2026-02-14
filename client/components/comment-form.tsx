// "use client";

// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { Camera, Send, Smile } from "lucide-react";
// import { useSession } from "@/providers/session";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// /**
//  * CommentForm component allows users to submit comments.
//  * It includes an avatar, a text input area, and buttons for sending the comment and adding emojis or images.
//  * The form handles submission and text input management.
//  *
//  * @param {Object} props - The properties for the CommentForm component.
//  * @param {Function} props.handleSubmit - The function to handle form submission.
//  * @param {string} props.text - The current text in the comment input area.
//  * @param {Function} props.setText - The function to update the text state.
//  */

// interface CommentFormProps {
//   handleSubmit: React.FormEventHandler<HTMLFormElement>;
//   text?: string | null;
//   setText?: React.Dispatch<React.SetStateAction<string | null>>;
//   onChange?: (e: React.FormEvent<HTMLDivElement>) => void;
// }

// const hashtagRegex = /(^|\s)(#[^\s#]+)/g;
// const mentionRegex = /(^|\s)(@[^\s@]+)/g;

// const CommentForm = React.forwardRef<HTMLDivElement, CommentFormProps>(
//   ({ handleSubmit, onChange = () => {}, setText = () => {} }, ref) => {
//     const session = useSession();
//     const [entities, setEntities] = useState<
//       {
//         type: "mention" | "hashtag";
//         offset: number;
//         end: number;
//         id?: string;
//         tag?: string;
//         name?: string;
//       }[]
//     >([]);

//     const highlightHashtags = (div: HTMLDivElement) => {
//       const selection = window.getSelection();
//       const range = selection?.getRangeAt(0);
//       const caretOffset = range
//         ? range.startOffset +
//           Array.from(div.childNodes)
//             .slice(0, Array.from(div.childNodes).indexOf(range.startContainer))
//             .reduce((acc, node) => acc + (node.textContent?.length || 0), 0)
//         : 0;

//       const text = div.innerText;

//       // Convert text into HTML with hashtag highlighting
//       const html = text
//         .replace(
//           hashtagRegex,
//           (_, space, tag) =>
//             `${space}<span class="bg-[rgba(8,102,255,0.2)] text-[rgb(8,8,9)] text-[14px] font-normal">${tag}</span>`
//         )
//         .replace(
//           mentionRegex,
//           (_, space, tag) =>
//             `${space}<span class="bg-[rgba(255,193,7,0.2)] text-yellow-700">${tag}</span>`
//         );

//       div.innerHTML = html;

//       // Restore caret position
//       const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null);
//       let currentOffset = 0;
//       let node: Node | null = null;
//       while ((node = walker.nextNode())) {
//         const nodeLength = node.textContent?.length || 0;
//         if (currentOffset + nodeLength >= caretOffset) {
//           const newRange = document.createRange();
//           newRange.setStart(node, caretOffset - currentOffset);
//           newRange.collapse(true);
//           selection?.removeAllRanges();
//           selection?.addRange(newRange);
//           break;
//         }
//         currentOffset += nodeLength;
//       }
//     };
//     return (
//       <form
//         onSubmit={handleSubmit}
//         className="flex w-[calc(100%_-_50px)] gap-2"
//       >
//         <div>
//           <Avatar className="size-6">
//             <AvatarImage
//               src={session?.profileImage?.url || "/images/default-profile.jpeg"}
//             />
//             <AvatarFallback>
//               {session?.fullName?.charAt(0) || "U"}
//             </AvatarFallback>
//           </Avatar>
//         </div>
//         <div className="flex-1 z-[100] flex items-center bg-muted shadow-sm h-[50px] w-full">
//           <div className="flex-1 relative h-full w-[calc(100%_-_100px)]">
//             <div
//               ref={ref}
//               contentEditable
//               role="textbox"
//               aria-multiline="true"
//               dir="ltr"
//               suppressContentEditableWarning
//               data-placeholder={`Comment as ${session?.fullName}`}
//               onInput={(e) => {
//                 const editableDiv = e.currentTarget;
//                 onChange(e);
//                 setText(editableDiv.innerText);
//                 highlightHashtags(editableDiv);

//                 if (
//                   editableDiv.innerText.trim() === "" &&
//                   !editableDiv.querySelector("span")
//                 ) {
//                   if (editableDiv.innerHTML !== "") {
//                     editableDiv.innerHTML = "";
//                   }
//                 }
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   (e.currentTarget as HTMLElement)
//                     .closest("form")
//                     ?.requestSubmit();
//                 }
//               }}
//               className={`
//               block
//               w-full
//               h-full
//               p-2
//               min-h-[50px]
//               max-h-[300px]
//               overflow-y-auto
//               border-none
//               bg-transparent
//               text-sm
//               outline-none
//               cursor-text
//               whitespace-pre-wrap
//               break-words
//               empty:before:content-[attr(data-placeholder)]
//               empty:before:text-muted-foreground
//               empty:before:absolute
//               empty:before:top-2
//               empty:before:left-2
//               empty:before:text-sm
//               empty:before:pointer-events-none
//             `}
//             />
//           </div>

//           {/* <Textarea
//           placeholder={`Comment as ${session?.data?.fullName}`}
//           value={text}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault(); // prevent new line
//               (e.currentTarget as HTMLTextAreaElement)
//                 .form?.requestSubmit(); // ✅ safely submits the form
//             }
//           }}

//           onChange={(e) => setText(e.target.value)}
//           className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm resize-none min-h-[50px] h-[50px]"
//         /> */}
//           <div className="flex gap-1 items-end h-full">
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//             >
//               <Smile className="h-4 w-4" />
//             </Button>
//             <Button
//               type="button"
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//             >
//               <Camera className="h-4 w-4" />
//             </Button>
//             <Button
//               type="submit"
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 rounded-full"
//             >
//               <Send className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </form>
//     );
//   }
// );
// CommentForm.displayName = "CommentForm";

// export default CommentForm;
