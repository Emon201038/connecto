import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useLazyQuery, gql } from "@apollo/client";
import { Textarea } from "../app/components/ui/textarea";
import { useSession } from "@/providers/session";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../app/components/ui/avatar";
import { Badge } from "../app/components/ui/badge";
import { X, Hash, AtSign, TrendingUp } from "lucide-react";

// import {
//   GET_HASHTAG_SUGGESTIONS,
//   GET_TRENDING_HASHTAGS,
//   SEARCH_USERS,
//   GET_FRIENDS,
// } from "@/graphql/queries";

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: {
    url: string;
    pub_id: string;
  };
}

interface Hashtag {
  id: string;
  tag: string;
  usageCount: number;
  lastUsed: string;
}

interface EnhancedInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
  showTrending?: boolean;
  showFriends?: boolean;
  onMentionsChange?: (mentions: User[]) => void;
  onHashtagsChange?: (hashtags: string[]) => void;
}

export default function EnhancedInputWithMentionsHashtags({
  value,
  onChange,
  placeholder,
  className = "",
  maxHeight = "200px",
  showTrending = false,
  showFriends = false,
  onMentionsChange,
  onHashtagsChange,
}: EnhancedInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionType, setSuggestionType] = useState<"hashtag" | "mention">(
    "hashtag",
  );
  const [hashtagSuggestions, setHashtagSuggestions] = useState<string[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<Hashtag[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [mentions, setMentions] = useState<User[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const session = useSession();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // const [fetchHashtagSuggestions] = useLazyQuery(GET_HASHTAG_SUGGESTIONS, {
  //   fetchPolicy: "no-cache",
  // });

  // const [fetchTrendingHashtags] = useLazyQuery(GET_TRENDING_HASHTAGS, {
  //   fetchPolicy: "cache-first",
  // });

  // const [searchUsers] = useLazyQuery(SEARCH_USERS, {
  //   fetchPolicy: "no-cache",
  // });

  // const [getFriends] = useLazyQuery(GET_FRIENDS, {
  //   fetchPolicy: "cache-first",
  // });

  // Fetch trending hashtags and friends on mount
  // useEffect(() => {
  //   if (showTrending) {
  //     fetchTrendingHashtags().then(({ data }) => {
  //       if (data?.trendingHashtags) {
  //         setTrendingHashtags(data.trendingHashtags);
  //       }
  //     });
  //   }

  //   if (showFriends) {
  //     getFriends().then(({ data }) => {
  //       if (data?.friends?.users) {
  //         setFriends(data.friends.users);
  //       }
  //     });
  //   }
  // }, [showTrending, showFriends, fetchTrendingHashtags, getFriends]);

  // Handle hashtag and mention detection
  // useEffect(() => {
  //   // Check for hashtag
  //   const hashtagMatch = value.match(/(?:^|\s)#(\w*)$/);
  //   if (hashtagMatch) {
  //     const partialTag = hashtagMatch[1];
  //     setSuggestionType("hashtag");
  //     if (partialTag.length > 0) {
  //       fetchHashtagSuggestions({ variables: { partial: partialTag } }).then(
  //         ({ data }) => {
  //           if (data?.hashtagSuggestions) {
  //             setHashtagSuggestions(data.hashtagSuggestions);
  //             setShowSuggestions(true);
  //             setSelectedSuggestionIndex(0);
  //           }
  //         }
  //       );
  //     } else {
  //       setHashtagSuggestions([]);
  //       setShowSuggestions(false);
  //     }
  //     return;
  //   }

  //   // Check for mention
  //   const mentionMatch = value.match(/(?:^|\s)@(\w*)$/);
  //   if (mentionMatch) {
  //     const partialUsername = mentionMatch[1];
  //     setSuggestionType("mention");
  //     if (partialUsername.length > 0) {
  //       searchUsers({ variables: { search: partialUsername } }).then(
  //         ({ data }) => {
  //           if (data?.users?.users) {
  //             setUserSuggestions(data.users.users);
  //             setShowSuggestions(true);
  //             setSelectedSuggestionIndex(0);
  //           }
  //         }
  //       );
  //     } else {
  //       setUserSuggestions(friends);
  //       setShowSuggestions(true);
  //       setSelectedSuggestionIndex(0);
  //     }
  //     return;
  //   }

  //   setShowSuggestions(false);
  // }, [value, friends, fetchHashtagSuggestions, searchUsers]);

  // Extract hashtags and mentions from text
  useEffect(() => {
    const hashtagMatches = value.match(/#(\w+)/g) || [];
    const mentionMatches = value.match(/@(\w+)/g) || [];

    const newHashtags = hashtagMatches.map((tag) => tag.slice(1));
    const newMentions = mentionMatches.map((mention) => mention.slice(1));

    // Only update if hashtags actually changed
    if (JSON.stringify(newHashtags) !== JSON.stringify(hashtags)) {
      setHashtags(newHashtags);
      onHashtagsChange?.(newHashtags);
    }

    // Only update mentions if they actually changed
    const currentMentions = mentions.filter((mention) =>
      newMentions.includes(mention.username),
    );

    if (
      JSON.stringify(currentMentions.map((m) => m.id).sort()) !==
      JSON.stringify(mentions.map((m) => m.id).sort())
    ) {
      setMentions(currentMentions);
      onMentionsChange?.(currentMentions);
    }
  }, [value, hashtags, mentions, onHashtagsChange, onMentionsChange]);

  // Handle hashtag and mention clicks
  const handleHashtagClick = (tag: string) => {
    // Navigate to hashtag page or search
    // You can implement navigation here
  };

  const handleMentionClick = (username: string) => {
    // Navigate to user profile
    // You can implement navigation here
  };

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showSuggestions) return;

      if (suggestionType === "hashtag") {
        if (hashtagSuggestions.length === 0) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev < hashtagSuggestions.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev > 0 ? prev - 1 : hashtagSuggestions.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            insertHashtag(hashtagSuggestions[selectedSuggestionIndex]);
            break;
          case "Escape":
            setShowSuggestions(false);
            break;
        }
      } else {
        if (userSuggestions.length === 0) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev < userSuggestions.length - 1 ? prev + 1 : 0,
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev > 0 ? prev - 1 : userSuggestions.length - 1,
            );
            break;
          case "Enter":
            e.preventDefault();
            insertMention(userSuggestions[selectedSuggestionIndex]);
            break;
          case "Escape":
            setShowSuggestions(false);
            break;
        }
      }
    },
    [
      showSuggestions,
      suggestionType,
      hashtagSuggestions,
      userSuggestions,
      selectedSuggestionIndex,
    ],
  );

  const insertHashtag = (tag: string) => {
    const newText = value.replace(/(?:^|\s)#(\w*)$/, (m) => {
      const prefix = m.startsWith(" ") ? " " : "";
      return `${prefix}#${tag} `;
    });

    onChange(newText);
    setShowSuggestions(false);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPosition = newText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  };

  const insertMention = (user: User) => {
    const newText = value.replace(/(?:^|\s)@(\w*)$/, (m) => {
      const prefix = m.startsWith(" ") ? " " : "";
      return `${prefix}@${user.username} `;
    });

    onChange(newText);
    setShowSuggestions(false);

    if (!mentions.some((m) => m.id === user.id)) {
      const newMentions = [...mentions, user];
      setMentions(newMentions);
      onMentionsChange?.(newMentions);
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPosition = newText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  };

  const insertTrendingHashtag = (tag: string) => {
    const newText = value + (value.endsWith(" ") ? "" : " ") + `#${tag} `;
    onChange(newText);

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPosition = newText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  };

  const insertFriendMention = (user: User) => {
    const newText =
      value + (value.endsWith(" ") ? "" : " ") + `@${user.username} `;
    onChange(newText);

    if (!mentions.some((m) => m.id === user.id)) {
      const newMentions = [...mentions, user];
      setMentions(newMentions);
      onMentionsChange?.(newMentions);
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
      const newPosition = newText.length;
      textareaRef.current.setSelectionRange(newPosition, newPosition);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Render text with clickable hashtags and mentions
  const renderInteractiveText = (text: string) => {
    if (!text) return [];

    // Split text into parts (hashtags, mentions, and regular text)
    const parts = [];
    let lastIndex = 0;

    // Find all hashtags and mentions
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;

    let match;
    const matches = [];

    // Collect all hashtag matches
    while ((match = hashtagRegex.exec(text)) !== null) {
      matches.push({
        type: "hashtag",
        start: match.index,
        end: match.index + match[0].length,
        content: match[0],
        tag: match[1],
        username: "",
      });
    }

    // Collect all mention matches
    while ((match = mentionRegex.exec(text)) !== null) {
      matches.push({
        type: "mention",
        start: match.index,
        end: match.index + match[0].length,
        content: match[0],
        username: match[1],
        tag: "",
      });
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build parts array
    for (const match of matches) {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.start),
          tag: "",
          username: "",
        });
      }

      // Add match
      parts.push(match);
      lastIndex = match.end;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
        tag: "",
        username: "",
      });
    }

    return parts;
  };

  const currentSuggestions =
    suggestionType === "hashtag" ? hashtagSuggestions : userSuggestions;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          placeholder={
            placeholder || `What's on your mind, ${session?.fullName}?`
          }
          className={`relative resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 text-base ${className}`}
          style={{ minHeight: "100px", maxHeight }}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
        />

        {/* Interactive text overlay */}
        {value && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              padding: "inherit",
              fontFamily: "inherit",
              fontSize: "inherit",
              lineHeight: "inherit",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {renderInteractiveText(value)?.map((part, index) => {
              if (part.type === "text") {
                return <span key={index}>{part.content}</span>;
              } else if (part.type === "hashtag") {
                return (
                  <span
                    key={index}
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => handleHashtagClick(part?.tag as string)}
                  >
                    {part.content}
                  </span>
                );
              } else if (part.type === "mention") {
                return (
                  <span
                    key={index}
                    className="text-purple-600 font-medium cursor-pointer hover:underline"
                    onClick={() => handleMentionClick(part.username)}
                  >
                    {part.content}
                  </span>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && currentSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {suggestionType === "hashtag"
            ? // Hashtag suggestions
              hashtagSuggestions.map((tag, index) => (
                <div
                  key={tag}
                  className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 hover: ${
                    index === selectedSuggestionIndex ? "bg-blue-50" : ""
                  }`}
                  onClick={() => insertHashtag(tag)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <Hash className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">#{tag}</span>
                </div>
              ))
            : // User suggestions
              userSuggestions.map((user, index) => (
                <div
                  key={user.id}
                  className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-3 hover: ${
                    index === selectedSuggestionIndex ? "bg-blue-50" : ""
                  }`}
                  onClick={() => insertMention(user)}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={
                        user.profilePicture?.url ||
                        "/images/default-profile.jpeg"
                      }
                    />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.fullName}
                    </div>
                    <div className="text-gray-500 text-xs">
                      @{user.username}
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Trending hashtags */}
      {showTrending && trendingHashtags.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Trending hashtags
          </p>
          <div className="flex flex-wrap gap-2">
            {trendingHashtags.slice(0, 8).map((hashtag) => (
              <Badge
                key={hashtag.id}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={() => insertTrendingHashtag(hashtag.tag)}
              >
                #{hashtag.tag}
                <span className="ml-1 text-xs text-blue-500">
                  {hashtag.usageCount}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Friends suggestions */}
      {showFriends && friends.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <AtSign className="w-4 h-4 text-purple-500" />
            Quick mention friends
          </p>
          <div className="flex flex-wrap gap-2">
            {friends.slice(0, 6).map((friend) => (
              <Badge
                key={friend.id}
                variant="outline"
                className="cursor-pointer hover:bg-purple-50 text-purple-600 border-purple-200"
                onClick={() => insertFriendMention(friend)}
              >
                <Avatar className="w-4 h-4 mr-1">
                  <AvatarImage
                    src={
                      friend.profilePicture?.url ||
                      "/images/default-profile.jpeg"
                    }
                  />
                  <AvatarFallback className="text-xs">
                    {friend.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {friend.fullName}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
