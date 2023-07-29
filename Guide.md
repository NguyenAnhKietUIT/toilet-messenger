# Environment setup

- Open terminal and write: `create-next-app@lates --typescript --tailwind`
- ESLint --> Yes, others --> No

# Auth

## Auth setup

- Move `page.tsx` into a new folder called `(site)`
- The parentheses will be treated as the root directory so the path will not be affected

## Auth UI

- Open terminal and write:

  - `npm install react-icons react-hook-form clsx`
  - `npm install @tailwindcss/forms`

- Open `tailwind.config.js` and write:
  ```typescript
  require('@tailwindcss/forms')({
    strategy: 'class',
  });
  ```

## MongoDB

### Prisma setup

- Open terminal and write:
  - `npm install -D prisma`
  - `npx prisma init`
- In file `.env` change path to database: `mongodb://127.0.0.1:27017/toilet_messenger_dev`
- Build models (Collection) then run: `npx prisma db push`

### NextAuth setup

- Open terminal and write:
  - `npm install next-auth @prisma/client @next-auth/prisma-adapter bcrypt`
  - `npm install -D @types/bcrypt`

# Register Functionality

# Login Functionality and Social Login (Google and Github)

# Layout

## Sidebar

## Navigation

# Screen

## Users

## Conversations

## Conversation Creation

# Message

## Creation

## Image upload

# Profile Drawer

# Setting

## Functionality

## Modal Component

# Functionality

## Group chat

## Image Modal

## Loading states

# Realtime

# Deploy
