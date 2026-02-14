export const users = [
  {
    id: 1,
    name: "Emdadul Hoque Emon",
    phone: "+8801787286529",
    email: "emdadul2580@gmail.com",
    password: "123456",
    posts: [1],
    friends: [2, 3],
    followers: [2, 3, 4],
  },
  {
    id: 2,
    name: "Alice Johnson",
    phone: "+1234567890",
    email: "alice.johnson@example.com",
    password: "alice123",
    posts: [2],
    friends: [1, 3],
    followers: [1, 3],
  },
  {
    id: 3,
    name: "Bob Smith",
    phone: "+0987654321",
    email: "bob.smith@example.com",
    password: "bob123",
    posts: [],
    friends: [1, 2],
    followers: [1],
  },
  {
    id: 4,
    name: "Charlie Brown",
    phone: "+1122334455",
    email: "charlie.brown@example.com",
    password: "charlie123",
    posts: [],
    friends: [],
    followers: [1, 2],
  },
  {
    id: 5,
    name: "David Williams",
    phone: "+7788990011",
    email: "david.williams@example.com",
    password: "david123",
    posts: [],
    friends: [],
    followers: []
  },
  { id: 6, name: "Emma Wilson", phone: "+2233445566", email: "emma.wilson@example.com", password: "emma123", posts: [], friends: [], followers: [] },
  { id: 7, name: "Sophia Martinez", phone: "+5566778899", email: "sophia.martinez@example.com", password: "sophia123", posts: [], friends: [], followers: [] },
  { id: 8, name: "Daniel Lee", phone: "+1122112233", email: "daniel.lee@example.com", password: "daniel123", posts: [], friends: [], followers: [] },
  { id: 9, name: "Olivia Clark", phone: "+3322114455", email: "olivia.clark@example.com", password: "olivia123", posts: [], friends: [], followers: [] },
  { id: 10, name: "William Davis", phone: "+9988776655", email: "william.davis@example.com", password: "william123", posts: [], friends: [], followers: [] },
]

export const posts = [
  {
    id: 1,
    title: "How to master in Next.js",
    image: "https://picsum.photos/id/70/500/300",
    author: 1,
    reactions: [
      {
        id: 1,
        type: "like",
        user: 2,
      },
      {
        id: 2,
        type: "love",
        user: 3,
      }
    ],
    comments: [
      {
        id: 1,
        comment: "Very useful course!",
        user: 2,
        reactions: [
          {
            id: 1,
            type: "like",
            user: 1,
          },
          {
            id: 2,
            type: "love",
            user: 3,
          }
        ]
      },
      {
        id: 2,
        comment: "Thanks for sharing!",
        user: 3,
        reactions: [
          {
            id: 3,
            type: "like",
            user: 2,
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Understanding JavaScript Closures",
    image: "https://picsum.photos/id/2/500/300",
    author: 2,
    reactions: [
      {
        id: 3,
        type: "clap",
        user: 1,
      }
    ],
    comments: [
      {
        id: 3,
        comment: "Great explanation!",
        user: 1,
        reactions: [
          {
            id: 4,
            type: "like",
            user: 2,
          }
        ]
      }
    ]
  }
];

export const conversations = [
  {
    id: 1,
    users: [
      1,
      4
    ],
    messages: [
      { id: 1, sender: 1, receiver: 4, message: "Hello Charlie, how are you?", type: "text", createdAt: "2024-11-08T10:15:30Z", status: "unseen" },
      { id: 2, sender: 4, receiver: 1, message: "I'm good, how about you?", type: "text", createdAt: "2024-11-08T10:16:00Z", status: "seen" }
    ]
  },
  {
    id: 2,
    users: [
      1,
      3
    ],
    messages: [
      { id: 3, sender: 1, receiver: 3, message: "Hey Bob! Are you joining the Next.js workshop?", type: "text", createdAt: "2024-11-08T09:00:00Z", status: "unseen" },
      { id: 4, sender: 3, receiver: 1, message: "Yes, I’ll be there!", type: "text", createdAt: "2024-11-08T09:05:00Z", status: "seen" }
    ]
  },
  {
    id: 3,
    users: [
      2,
      5
    ],
    messages: [
      { id: 5, sender: 2, receiver: 5, message: "Hi David, how’s work?", type: "text", createdAt: "2024-11-08T08:30:00Z", status: "unseen" },
      { id: 6, sender: 5, receiver: 2, message: "Pretty busy, but going well!", type: "text", createdAt: "2024-11-08T08:32:00Z", status: "seen" }
    ]
  },
  {
    id: 4,
    users: [
      3,
      6
    ],
    messages: [
      { id: 7, sender: 3, receiver: 6, message: "Hey Emma, did you check the latest project update?", type: "text", createdAt: "2024-11-08T11:00:00Z", status: "seen" },
      { id: 8, sender: 6, receiver: 3, message: "Yes, looks great!", type: "text", createdAt: "2024-11-08T11:05:00Z", status: "seen" }
    ]
  },
  {
    id: 5,
    users: [
      1,
      7
    ],
    messages: [
      { id: 9, sender: 1, receiver: 7, message: "Hey Sophia, long time no see!", type: "text", createdAt: "2024-11-08T12:10:00Z", status: "unseen" },
      { id: 10, sender: 7, receiver: 1, message: "Yeah, how have you been?", type: "text", createdAt: "2024-11-08T12:12:00Z", status: "unseen" }
    ]
  },
  {
    id: 6,
    users: [
      2,
      8
    ],
    messages: [
      { id: 11, sender: 2, receiver: 8, message: "Daniel, can you send me the files?", type: "text", createdAt: "2024-11-08T13:00:00Z", status: "seen" },
      { id: 12, sender: 8, receiver: 2, message: "Sure, sending them now.", type: "text", createdAt: "2024-11-08T13:05:00Z", status: "seen" }
    ]
  },
  {
    id: 7,
    users: [
      3,
      9
    ],
    messages: [
      { id: 13, sender: 3, receiver: 9, message: "Olivia, are we meeting at 5 PM?", type: "text", createdAt: "2024-11-08T14:00:00Z", status: "unseen" },
      { id: 14, sender: 9, receiver: 3, message: "Yes, see you then!", type: "text", createdAt: "2024-11-08T14:05:00Z", status: "seen" }
    ]
  },
  {
    id: 8,
    users: [
      4,
      10
    ],
    messages: [
      { id: 15, sender: 4, receiver: 10, message: "William, are you available for a call?", type: "text", createdAt: "2024-11-08T15:00:00Z", status: "seen" },
      { id: 16, sender: 10, receiver: 4, message: "Yes, let's talk in 10 minutes.", type: "text", createdAt: "2024-11-08T15:05:00Z", status: "seen" }
    ]
  },
  {
    id: 9,
    users: [
      5,
      6
    ],
    messages: [
      { id: 17, sender: 5, receiver: 6, message: "Emma, can you review my report?", type: "text", createdAt: "2024-11-08T16:00:00Z", status: "unseen" },
      { id: 18, sender: 6, receiver: 5, message: "Yes, I’ll check it now.", type: "text", createdAt: "2024-11-08T16:05:00Z", status: "seen" }
    ]
  },
  {
    id: 10,
    users: [
      7,
      8
    ],
    messages: [
      { id: 19, sender: 7, receiver: 8, message: "Hey Daniel, let’s meet up soon!", type: "text", createdAt: "2024-11-08T17:00:00Z", status: "unseen" },
      { id: 20, sender: 8, receiver: 7, message: "Absolutely! Let’s plan it.", type: "text", createdAt: "2024-11-08T17:05:00Z", status: "seen" }
    ]
  }
];
