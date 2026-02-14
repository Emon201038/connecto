import Image from "next/image";

export const reactionEmojis: Record<string, React.ReactNode> = {
  LIKE: (
    <Image src="/images/like.svg" alt="love" width={16} height={16} priority />
  ),
  CARE: (
    <Image src="/images/care.svg" alt="love" width={16} height={16} priority />
  ),
  LOVE: (
    <Image src="/images/love.svg" alt="love" width={16} height={16} priority />
  ),
  HAHA: (
    <Image src="/images/haha.svg" alt="haha" width={16} height={16} priority />
  ),
  WOW: (
    <Image src="/images/wow.svg" alt="wow" width={16} height={16} priority />
  ),
  SAD: (
    <Image src="/images/sad.svg" alt="sad" width={16} height={16} priority />
  ),
  ANGRY: (
    <Image
      src="/images/angry.svg"
      alt="angry"
      width={16}
      height={16}
      priority
    />
  ),
};

export const images = {
  alarm: 1,
  clock: 2,
  male_face: 3,
  logo: 4,
  payment_card: 5,
  videos: 6,
  instagram: 8,
  games: 9,
  message: 10,
  music: 11,
  minus: 12,
  flag: 13,
  add_camera: 14,
  thread: 16,
  swap_h: 17,
  swap_v: 18,
  audio_playing: 19,
  save: 20,
  trash: 21,
  analytics: 22,
  notification: 23,
  bookmark: 24,
  live_steam: 25,
  bag: 26,
  birthday: 27,
  warning: 31,
  success: 32,
  comment: 37,
  black: 38,
  send: 42,
  friend_request: 43,
  double_user: 44,
  gift: 46,
  group: 47,
  headphone: 48,
  video_blue: 52,
  link: 53,
  store: 54,
  announcement: 61,
  edit: 64,
  call_rejected: 65,
  galary: 66,
  location: 67,
  play: 68,
  poke: 69,
  relationship: 75,
  send_2: 77,
  shild: 79,
};
