
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Comment = {
  id: string;
  author: User;
  text: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
};

export type Post = {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  feeling?: string;
};

export type FriendRequest = {
  id: string;
  user: User;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
};

export const currentUser: User = {
  id: 'u0',
  name: 'John Doe',
  avatarUrl: 'https://placehold.co/40x40.png',
};

const sd1993: User = { id: 'u-sd', name: 'SD 1993', avatarUrl: 'https://placehold.co/40x40.png' };
const anamul: User = { id: 'u-anamul', name: 'Anamul Hashan', avatarUrl: 'https://placehold.co/40x40.png' };
const hasibur: User = { id: 'u-hasibur', name: 'MD Hasibur Rahman', avatarUrl: 'https://placehold.co/40x40.png' };
const salek: User = { id: 'u-salek', name: 'Salek Khan', avatarUrl: 'https://placehold.co/40x40.png' };
const mushfik: User = { id: 'u-mushfik', name: 'DP Mushfik', avatarUrl: 'https://placehold.co/40x40.png' };
const picchi: User = { id: 'u-picchi', name: 'Picchi Chele Oni', avatarUrl: 'https://placehold.co/40x40.png' };


export const users: User[] = [
  { id: 'u1', name: 'Alice Johnson', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u2', name: 'Bob Williams', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u3', name: 'Carol White', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u4', name: 'David Green', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u5', name: 'Eve Black', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u6', name: 'Frank Blue', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'u7', name: 'Grace Hall', avatarUrl: 'https://placehold.co/40x40.png' },
  sd1993, anamul, hasibur, salek, mushfik, picchi
];

const post1Comments: Comment[] = [
  {
    id: 'c1-1',
    author: sd1993,
    text: 'শেষ পর্যন্ত বিমানটি ঢাকা এয়ারপোর্টে ল্যান্ডিং করে, কারণ এখনো জানতে পারি নি।',
    timestamp: '1w',
    likes: 7,
    replies: [
      {
        id: 'c1-1-r1',
        author: anamul,
        text: 'SD 1993 Technical সমস্যার কারণে ল্যান্ড করে। তারপর জরুরীভাবে সমস্যা সমাধান করে রাত ৯ টার পরে আবার উড্ডয়ন করে দোহার উদ্দেশ্য। এবং রাতেই পৌঁছে যায়। উল্লেখ্য যে এই বিমানটি আমি রিফুয়েলিং করি।',
        timestamp: '6d',
        likes: 19,
        replies: [
          {
            id: 'c1-1-r1-1',
            author: sd1993,
            text: 'Anamul Hashan ধন্যবাদ ভাই। ভালো থাকবেন।',
            timestamp: '5d',
            likes: 5,
            replies: []
          },
          {
            id: 'c1-1-r1-2',
            author: hasibur,
            text: 'Anamul Hashan great work!',
            timestamp: '5d',
            likes: 2,
            replies: []
          }
        ]
      },
      {
        id: 'c1-1-r2',
        author: hasibur,
        text: 'SD 1993 বস এগুলো আমরা প্রবাস থেকে কেমনে কোন এপের মাধ্যমে দেখব। 🙏',
        timestamp: '1w',
        likes: 2,
        replies: []
      },
      {
        id: 'c1-1-r3',
        author: salek,
        text: 'SD 1993 alhamdulliah',
        timestamp: '1w',
        likes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'c1-2',
    author: mushfik,
    text: 'Male hocche Maldives er Capital 😉',
    timestamp: '6d',
    likes: 9,
    replies: []
  },
  {
    id: 'c1-3',
    author: picchi,
    text: 'ভাই আমার মনে হয় বিমান টা নোয়াখালী এয়ারপোর্টে নামবে 😂',
    timestamp: '6d',
    likes: 0,
    replies: []
  }
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: sd1993,
    content: 'Just enjoying a beautiful day at the park! What a wonderful way to unwind and connect with nature. 🌳☀️',
    imageUrl: 'https://placehold.co/680x450.png',
    likes: 128,
    comments: post1Comments,
    shares: 15,
    timestamp: '2h ago',
    feeling: '😄 Feeling happy',
  },
  {
    id: 'p2',
    author: users[1],
    content: "Just finished a great book! Highly recommend 'The Midnight Library' to anyone looking for a thought-provoking read. #bookworm #reading",
    likes: 72,
    comments: [],
    shares: 5,
    timestamp: '5h ago',
  },
  {
    id: 'p3',
    author: users[2],
    content: "My new painting is finally complete! I've been working on this for weeks. Let me know what you think!",
    imageUrl: 'https://placehold.co/680x850.png',
    likes: 256,
    comments: [],
    shares: 12,
    timestamp: '1d ago',
  },
  {
    id: 'p4',
    author: users[3],
    content: "Exploring the city and found this hidden gem of a cafe. The coffee is amazing! ☕️ #citylife #coffee",
    likes: 98,
    comments: [],
    shares: 3,
    timestamp: '2d ago',
  },
];

export const friendRequests: FriendRequest[] = [
  { id: 'fr1', user: users[4] },
  { id: 'fr2', user: users[5] },
];

const messages: { [key: string]: Message[] } = {
  'c1': [
    { id: 'm1', senderId: 'u1', text: 'Hey, how is it going?', timestamp: '10:00 AM' },
    { id: 'm2', senderId: 'u0', text: 'Doing well, thanks! How about you?', timestamp: '10:01 AM' },
    { id: 'm3', senderId: 'u1', text: 'Pretty good! Working on the new project.', timestamp: '10:01 AM' },
    { id: 'm4', senderId: 'u0', text: 'That sounds exciting! I just pushed my latest changes.', timestamp: '10:02 AM' },
    { id: 'm5', senderId: 'u1', text: 'Great, I\'ll check them out!', timestamp: '10:03 AM' },
  ],
  'c2': [
    { id: 'm6', senderId: 'u2', text: 'Did you see the game last night?', timestamp: 'Yesterday' },
    { id: 'm7', senderId: 'u0', text: 'Yeah, it was a nail-biter!', timestamp: 'Yesterday' },
  ],
  'c3': [
    { id: 'm8', senderId: 'u3', text: 'Let\'s catch up soon.', timestamp: '3 days ago' }
  ],
  'c4': [
    { id: 'm9', senderId: 'u4', text: 'Lunch tomorrow?', timestamp: '2 days ago' }
  ]
};

export const conversations: Conversation[] = [
  {
    id: 'c1',
    participants: [currentUser, users[0]],
    messages: messages['c1'],
    unreadCount: 2,
  },
  {
    id: 'c2',
    participants: [currentUser, users[1]],
    messages: messages['c2'],
    unreadCount: 0,
  },
  {
    id: 'c3',
    participants: [currentUser, users[2]],
    messages: messages['c3'],
    unreadCount: 0,
  },
  {
    id: 'c4',
    participants: [currentUser, users[3]],
    messages: messages['c4'],
    unreadCount: 1,
  },
  {
    id: 'c5',
    participants: [currentUser, users[4]],
    messages: [],
    unreadCount: 0,
  },
  {
    id: 'c6',
    participants: [currentUser, users[5]],
    messages: [{ id: 'm10', senderId: 'u6', text: 'Project deadline is approaching!', timestamp: '4 days ago' }],
    unreadCount: 0,
  }
];
