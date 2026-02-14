import Image from "next/image";

export const reactionEmojis: Record<
  "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY",
  {
    emoji: React.ReactNode;
    bg: string;
    name: string;
    text: string;
    classes: { text: string; bg: string };
  }
> = {
  LIKE: {
    emoji: (
      <Image
        src="/images/like.svg"
        alt="love"
        width={16}
        height={16}
        priority
      />
    ),
    bg: "white",
    text: "#0866FF",
    name: "Like",
    classes: {
      text: "text-[#0866FF]",
      bg: "bg-white",
    },
  },
  CARE: {
    emoji: (
      <Image
        src="/images/care.svg"
        alt="care"
        width={16}
        height={16}
        priority
      />
    ),
    bg: "white",
    name: "Care",
    text: "#887000",
    classes: {
      text: "text-[#887000]",
      bg: "bg-white",
    },
  },
  LOVE: {
    emoji: <Image src="/images/love.svg" alt="love" width={16} height={16} />,
    bg: "white",
    name: "Love",
    text: "#DD2334",
    classes: {
      text: "text-[#DD2334]",
      bg: "bg-white",
    },
  },
  HAHA: {
    emoji: <Image src="/images/haha.svg" alt="haha" width={16} height={16} />,
    bg: "white",
    name: "Haha",
    text: "#887000",
    classes: {
      text: "text-[#887000]",
      bg: "bg-white",
    },
  },
  WOW: {
    emoji: <Image src="/images/wow.svg" alt="wow" width={16} height={16} />,
    bg: "white",
    name: "Wow",
    text: "#887000",
    classes: {
      text: "text-[#887000]",
      bg: "bg-white",
    },
  },
  SAD: {
    emoji: <Image src="/images/sad.svg" alt="sad" width={16} height={16} />,
    bg: "white",
    name: "Sad",
    text: "#887000",
    classes: {
      text: "text-[#887000]",
      bg: "bg-white",
    },
  },
  ANGRY: {
    emoji: <Image src="/images/angry.svg" alt="angry" width={16} height={16} />,
    bg: "white",
    name: "Angry",
    text: "orange",
    classes: {
      text: "text-[#887000]",
      bg: "bg-white",
    },
  },
};
