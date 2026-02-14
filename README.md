# Connecto - a social media Project

A full-stack connecto built with Next.js (client) and Node.js/Express (server), featuring social networking, groups, posts, friends, authentication, and admin analytics.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Client (Next.js)](#client-nextjs)
- [Server (Node.js/Express)](#server-nodejsexpress)
- [Key Modules](#key-modules)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- User registration, login, and 2FA authentication
- Profile management (about, work, education, places, contact info)
- Friend requests, suggestions, and management
- Groups: create, join, post, and manage
- Posts: create, react, comment, share, privacy controls
- Admin dashboard with analytics
- Real-time messaging (mocked in db)
- Responsive UI with Next.js and Tailwind CSS

---

## Project Structure

```
.vscode/           # Editor settings
client/            # Next.js frontend
  src/             # Source code
  public/          # Static assets
  fonts/           # Custom fonts
  .env*            # Environment configs
  package.json     # Client dependencies
server/            # Node.js backend
  src/             # Source code
  .env*            # Environment configs
  package.json     # Server dependencies
.vercel/           # Vercel deployment config
```

---

## Client (Next.js)

- Located in [`client/`](client/)
- Uses [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- Main pages: Home, Profile, Friends, Groups, Admin
- UI components: Avatar, Card, Button, PostCard, CreatePostCard, etc.
- State management: Redux Toolkit ([`client/src/redux`](client/src/redux))
- API calls: GraphQL via custom hooks ([`client/src/redux/features`](client/src/redux/features))
- Authentication: NextAuth ([`client/src/auth.ts`](client/src/auth.ts))
- Example: Profile About page ([`client/src/app/(main)/profile/about/page.tsx`](<client/src/app/(main)/profile/about/page.tsx>))

---

## Server (Node.js/Express)

- Located in [`server/`](server/)
- GraphQL API ([`server/src/app/graphql`](server/src/app/graphql))
- MongoDB models: User, Post, Group, Session, Friendship
- Services: Auth, User, Friend, Group, Post ([`server/src/app/modules`](server/src/app/modules))
- Query builder for filtering, searching, pagination ([`server/src/app/lib/queryBuilder.ts`](server/src/app/lib/queryBuilder.ts))
- Example: User service ([`server/src/app/modules/user/user.service.ts`](server/src/app/modules/user/user.service.ts))

---

## Key Modules

### User

- Model: [`server/src/app/modules/user/user.model.ts`](server/src/app/modules/user/user.model.ts)
- Interface: [`server/src/app/modules/user/user.interface.ts`](server/src/app/modules/user/user.interface.ts)
- Service: [`server/src/app/modules/user/user.service.ts`](server/src/app/modules/user/user.service.ts)
- GraphQL: [`server/src/app/modules/user/user.gql`](server/src/app/modules/user/user.gql)

### Auth

- Service: [`server/src/app/modules/auth/auth.service.ts`](server/src/app/modules/auth/auth.service.ts)
- 2FA, session management

### Post

- Model: [`server/src/app/modules/post/post.model.ts`](server/src/app/modules/post/post.model.ts)
- Interface: [`server/src/app/modules/post/post.interface.ts`](server/src/app/modules/post/post.interface.ts)
- Service: [`server/src/app/modules/post/post.service.ts`](server/src/app/modules/post/post.service.ts)

### Group

- Model: [`server/src/app/modules/groups/group.model.ts`](server/src/app/modules/groups/group.model.ts)
- Interface: [`server/src/app/modules/groups/group.interface.ts`](server/src/app/modules/groups/group.interface.ts)
- Service: [`server/src/app/modules/groups/group.service.ts`](server/src/app/modules/groups/group.service.ts)

### Friend

- Service: [`server/src/app/modules/friend/friend.service.ts`](server/src/app/modules/friend/friend.service.ts)
- Friend requests, suggestions, and management

---

## Environment Variables

- Client: [`client/.env`](client/.env), [`client/.env.example`](client/.env.example)
- Server: [`server/.env`](server/.env), [`server/.env.example`](server/.env.example)

---

## Getting Started

### Client

```sh
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Server

```sh
cd server
npm install
npm run dev
```

Server runs on configured port (see `.env`)

---

## API Overview

- GraphQL endpoint: `/graphql`
- Example queries:
  - Get users: `users(page: 1, pageSize: 10)`
  - Get posts: `posts(page: 1, pageSize: 10)`
  - Get friends: `myFriends(page: 1, limit: 10)`
  - Register: `register(email, password, ...)`
  - Create group: `createGroup(input: { name, privacy })`

See [client/src/redux/features](client/src/redux/features) for API usage.

---

## Deployment

- Deploy client and server separately or together
- Vercel recommended for client ([Next.js deployment](https://nextjs.org/docs/app/building-your-application/deploying))
- See [client/README.md](client/README.md) for more

---

## License

MIT License

---

For more details, see the source files linked
