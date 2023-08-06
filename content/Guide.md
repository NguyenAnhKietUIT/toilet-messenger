# Definition

## `'use client'`

`Marks source files whose components execute on the client.`

`Files using 'use client':`

```typescript
import ProfileDrawer from '@/app/conversations/[conversationId]/components/ProfileDrawer';
import ConfirmModal from '@/app/conversations/[conversationId]/components/ConfirmModal';
import MessageInput from '@/app/conversations/[conversationId]/components/MessageInput';
import ImageModal from '@/app/conversations/[conversationId]/components/ImageModal';
import MessageBox from '@/app/conversations/[conversationId]/components/MessageBox';
import ConversationList from '@/app/conversations/components/ConversationList';
import ConversationBox from '@/app/conversations/components/ConversationBox';
import Header from '@/app/conversations/[conversationId]/components/Header';
import GroupChatModal from '@/app/conversations/components/GroupChatModal';
import Body from '@/app/conversations/[conversationId]/components/Body';
import Form from '@/app/conversations/[conversationId]/components/Form';
import AuthSocialButton from '@/app/(site)/components/AuthSocialButton';
import DesktopSidebar from '@/app/components/sidebar/DesktopSidebar';
import SettingsModal from '@/app/components/sidebar/SettingsModal';
import MobileFooter from '@/app/components/sidebar/MobileFooter';
import DesktopItem from '@/app/components/sidebar/DesktopItem';
import MobileItem from '@/app/components/sidebar/MobileItem';
import ToasterContext from '@/app/context/ToasterContext';
import ActiveStatus from '@/app/components/ActiveStatus';
import LoadingModal from '@/app/components/LoadingModal';
import AuthForm from '@/app/(site)/components/AuthForm';
import AvatarGroup from '@/app/components/AvatarGroup';
import UserList from '@/app/users/components/UserList';
import UserBox from '@/app/users/components/UserBox';
import Select from '@/app/components/inputs/Select';
import AuthContext from '@/app/context/AuthContext';
import Input from '@/app/components/inputs/Input';
import Avatar from '@/app/components/Avatar';
im/* The `useEffect` hook is used to perform side effects in a React component. In this case, it is
used to subscribe to Pusher channels and bind event handlers for new conversations, conversation
updates, and conversation removals. */
port Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
page.tsx from app/ConversationsLayout
```

# Describe function

## Layout of app

### `AuthContext.tsx`

`Manage the authentication session state`

```tsx
'use client';

/* The line `import { SessionProvider } from 'next-auth/react';` is importing the `SessionProvider`
component from the `next-auth/react` library. This component is used to manage the authentication
session state in Next.js applications. */
import { SessionProvider } from 'next-auth/react';

/* The `interface AuthContextProps` is defining the type of the `props` object that the `AuthContext`
component expects to receive. In this case, it specifies that the `children` prop should be of type
`React.ReactNode`. This means that the `children` prop can accept any valid React node as its value,
such as JSX elements, strings, or numbers. */
interface AuthContextProps {
  children: React.ReactNode;
}

/**
 * The AuthContext function is a wrapper component that provides authentication context to its children
 * components.
 * @param {AuthContextProps}  - The `AuthContext` function takes in a single parameter called
 * `children`, which is of type `AuthContextProps`.
 * @returns The AuthContext component is returning the children wrapped in a SessionProvider component.
 */
function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthContext;
```

### `ToasterContext.tsx`

`Accept show toaster`

```ts
'use client';

/**
 * The ToasterContext component returns a Toaster component from the react-hot-toast library.
 */
import { Toaster } from 'react-hot-toast';

const ToasterContext = () => {
  return <Toaster />;
};

export default ToasterContext;
```

### `ActiveStatus.tsx`

`Manage the active channel status`

```tsx
'use client';

/**
 * The ActiveStatus component uses the useActiveChannel hook to manage the active channel status.
 * @returns The component is returning null.
 */
import useActiveChannel from '../hooks/useActiveChannel';

const ActiveStatus = () => {
  useActiveChannel();
  return null;
};

export default ActiveStatus;
```

### `useActiveChannel.tsx`

`The useActiveChannel hook is used to manage the active channel in a messaging application using Pusher.`

```tsx
import { useEffect, useState } from 'react';
import useActiveList from './useActiveList';
import { Channel, Members } from 'pusher-js';
import { pusherClient } from '../libs/pusher';

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, the
  effect is triggered whenever the `activeChannel`, `set`, `add`, or `remove` dependencies change. */
  useEffect(() => {
    let channel = activeChannel;

    /* This code block checks if the `channel` variable is null. If it is null, it means that the
    channel has not been subscribed to yet. In that case, it subscribes to the 'presence-messenger'
    channel using the `pusherClient.subscribe` method and assigns the returned channel object to the
    `channel` variable. It then sets the `activeChannel` state to the subscribed channel using the
    `setActiveChannel` function. */
    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger');
      setActiveChannel(channel);
    }

    /* The code is binding an event listener to the 'pusher:subscription_succeeded' event 
    on the `channel` object. */
    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id),
      );

      set(initialMembers);
    });

    /* The code is binding an event listener to the 'pusher:member_added' event on the `channel` object. */
    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id);
    });

    /* The code is binding an event listener to the 'pusher:member_removed' event on the `channel` object. */
    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id);
    });

    /* The block is a cleanup function that is executed when the component unmounts 
    or when the dependencies of the `useEffect` hook change. */
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
```

### `useActiveList.tsx`

```tsx
import { create } from 'zustand';

/* The `interface ActiveListStore` defines the structure of the store for managing an active list. It
specifies that the store should have a `members` property which is an array of strings. It also
defines three methods: `add`, `remove`, and `set`. */
interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

/* The code is creating a custom hook called `useActiveList` using the `create` function from the
`zustand` library. */
const useActiveList = create<ActiveListStore>((set) => ({
  /* The code block is defining the implementation of the methods for managing an active list in the
  `ActiveListStore` interface. */
  members: [],
  /* The `add` method in the `ActiveListStore` interface is a function that takes an `id` parameter. It
  uses the `set` function from the `zustand` library to update the state of the store. */
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  /* The `remove` method in the `ActiveListStore` interface is a function that takes an `id` parameter.
  It uses the `set` function from the `zustand` library to update the state of the store. */
  remove: (id) =>
    /* The line of code is updating the state of the `ActiveListStore` by removing a member with a specific `id`
    from the `members` array. */
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id),
    })),
  /* The line is defining the implementation of the `set` method in the `ActiveListStore` interface. */
  set: (ids) => set({ members: ids }),
}));

export default useActiveList;
```

## `Page of (site)`

### `AuthForm.tsx`

```tsx
/* The `useEffect` hook is used to perform side effects in a React component. In this case, the
  effect is triggered when the value of `session?.status` or `router` changes. */
useEffect(() => {
  /* The code block is checking if the user is authenticated. 
    If the user is authenticated, it redirects them to the '/users' page using the `router.push()` function. */
  if (session?.status === 'authenticated') {
    router.push('/users');
  }
}, [session?.status, router]);

/* The `toggleVariant` function is a callback function that toggles the value of the `variant` state
  between `'LOGIN'` and `'REGISTER'`. It is used to switch between the login and register forms in
  the component. */
const toggleVariant = useCallback(() => {
  /* The line is a conditional statement that checks the value of the `variant` state. */
  variant == 'LOGIN' ? setVariant('REGISTER') : setVariant('LOGIN');
}, [variant]);

/* The code snippet is using the `useForm` hook from the `react-hook-form` library to handle form
  validation and submission in a React component. */
const {
  /* `register` is a function provided by the `react-hook-form` library that is used to register form
    inputs. It is used to associate input fields with the form validation rules and to track their
    values. */
  register,
  /* `handleSubmit` is a function provided by the `react-hook-form` library that is used to handle
    form submission. It takes a callback function as an argument, which will be executed when the
    form is submitted. In this code snippet, the `onSubmit` function is passed as the callback
    function to `handleSubmit`. When the form is submitted, `handleSubmit` will validate the form
    inputs using the registered validation rules and then call the `onSubmit` function with the form
    data as an argument. */
  handleSubmit,
  /* The `formState: { errors }` is destructuring the `errors` property from the `formState` object
    returned by the `useForm` hook. */
  formState: {
    /* The `errors` object is provided by the `react-hook-form` library and is used to
    track and display validation errors for form inputs. It contains information about
    any validation errors that occur during form submission. */
    errors,
  },
} = useForm<FieldValues>({
  /* The `defaultValues` property in the `useForm` hook is used to set the initial values of the form
    fields. In this case, it is setting the initial values of the `name`, `email`, and `password`
    fields to empty strings. This means that when the form is rendered, these fields will be empty
    by default. */
  defaultValues: {
    name: '',
    email: '',
    password: '',
  },
});

/**
 * The function handles form submission for registration and login, making API calls and displaying
 * toast messages accordingly.
 * @param data - The `data` parameter is an object that contains the form data submitted by the user.
 * It is of type `FieldValues`, which is a generic type representing the values of all fields in the
 * form.
 */
const onSubmit: SubmitHandler<FieldValues> = (data) => {
  setIsLoading(true);

  /* This code block is handling the form submission for the registration variant. */
  if (variant === 'REGISTER') {
    /* The code block is making a POST request to the '/api/register' endpoint with the form data
      (`data`) as the request payload. */
    axios
      /* `.post('/api/register', data)` is making a POST request to the '/api/register' endpoint with
        the form data (`data`) as the request payload. This endpoint is responsible for handling the
        registration process on the server-side. */
      .post('/api/register', data)
      .then(() => {
        /* The `signIn('credentials', data)` function is used to authenticate the user using their
          credentials (email and password). It is called after a successful registration, and it
          triggers the authentication process on the server-side. The `data` parameter contains the
          form data submitted by the user, including their email and password. */
        signIn('credentials', data);
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  }

  /* The code block is handling the form submission for the login variant. */
  if (variant === 'LOGIN') {
    /* The code block is using the `signIn` function from the `next-auth/react` package to
      authenticate the user using their credentials (email and password). */
    signIn('credentials', { ...data, redirect: false })
      .then((callback) => {
        /* The code block is checking
          if the `callback` object returned from the `signIn` function has an `error` property. */
        if (callback?.error) {
          toast.error('Invalid credentials!');
        }

        /* The code block is checking if the `callback` object
         returned from the `signIn` function has an `ok` property that is truthy and an `error`
         property that is falsy. */
        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
        }
      })
      .finally(() => setIsLoading(false));
  }
};

/**
 * The function `socialAction` is used to handle social media sign-in actions, displaying success or
 * error messages and redirecting the user if the sign-in is successful.
 * @param {string} action - The `action` parameter is a string that represents the social action to
 * be performed, such as "login" or "signup".
 */
const socialAction = (action: string) => {
  setIsLoading(true);

  /* The code block is handling the sign-in action using the `signIn` function from the
    `next-auth/react` library. */
  signIn(action, { redirect: false })
    .then((callback) => {
      if (callback?.error) {
        toast.error('Invalid credentials!');
      }

      if (callback?.ok && !callback?.error) {
        toast.success('Logged in!');
        /* `router.push('/users');` is used to navigate the user to the '/users' page. It is called
          inside the `useEffect` hook and is triggered when the `session` status changes to
          'authenticated'. This means that if the user is already authenticated, they will be
          redirected to the '/users' page. */
        router.push('/users');
      }
    })
    .finally(() => setIsLoading(false));
};
```

### `/api/register`

```ts
import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

/**
 * This TypeScript function handles a POST request for user registration, validating the request body
 * and creating a new user in the database.
 * @param {Request} request - The `request` parameter is an object that represents the incoming HTTP
 * request. It contains information such as the request method, headers, and body. In this code
 * snippet, the `request` object is used to extract the JSON body of the request using the
 * `request.json()` method.
 * @returns The code is returning a response object. If the request is successful, it returns a JSON
 * response with the user object. If there is a missing info error, it returns a response with a status
 * of 400 and a message of 'Missing info'. If there is an internal error, it returns a response with a
 * status of 500 and a message of 'Internal Error'.
 */
export async function POST(request: Request) {
  /* The code snippet is a TypeScript function that handles a POST request for user registration. */
  try {
    /* `const body = await request.json();` is extracting the JSON body from the incoming HTTP request.
    It is using the `request.json()` method to parse the request body and return it as a JavaScript
    object. The `await` keyword is used to wait for the JSON parsing to complete before assigning
    the parsed body to the `body` variable. */
    const body = await request.json();
    const { name, email, password } = body;

    /* The code block `if (!name || !email || !password)` is checking if any of the variables `name`,
    `email`, or `password` are falsy (empty, null, or undefined). If any of these variables are
    falsy, it means that the request body is missing one or more required fields for user
    registration. */
    if (!name || !email || !password) {
      return new NextResponse('Missing info', { status: 400 });
    }

    /* The line `const hashedPassword = await bcrypt.hash(password, 12);` is using the bcrypt library
    to hash the user's password. */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* The code `const user = await prisma.user.create({ data: { name, email, hashedPassword } });` is
   creating a new user in the database using the Prisma ORM. */
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    /* `return NextResponse.json(user);` is returning a JSON response with the user object. */
    return NextResponse.json(user);
  } catch (error) {
    console.log(error, 'REGISTRATION_ERROR');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```

### `/users`

## `users`

### `getUsers.ts`

```ts
import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

/**
 * The function `getUsers` retrieves a list of users from a database, excluding the user with the
 * current session's email, and returns the list in descending order of creation date.
 * @returns The function `getUsers` returns an array of user objects.
 */
const getUsers = async () => {
  /* The line `const session = await getSession();` is calling the `getSession` function and assigning
  its returned value to the `session` variable. The `getSession` function is likely responsible for
  retrieving the current session information, such as the user's email, from somewhere (e.g., a
  session cookie or a database). */
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  /* The code block is using the Prisma ORM (Object-Relational Mapping) to query the database and
  retrieve a list of users. */
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
```

### `getSession.ts`

```ts
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]/route';

/**
 * The function exports an asynchronous function called getSession that returns the server session
 * using the provided authOptions.
 * @returns the result of the `getServerSession` function, which is awaited.
 */
export default async function getSession() {
  /* The line `return await getServerSession(authOptions);` is calling the `getServerSession` function
  with the `authOptions` parameter and then awaiting the result. The `getServerSession` function is
  responsible for retrieving the server session using the provided authentication options. The
  `await` keyword is used to pause the execution of the function until the promise returned by
  `getServerSession` is resolved, and then the resolved value is returned. */
  return await getServerSession(authOptions);
}
```

### `[...nextauth]`

```ts
import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismadb';

/* The code is defining the authentication options for NextAuth, a library for handling authentication
in Next.js applications. */
export const authOptions: AuthOptions = {
  /* The line `adapter: PrismaAdapter(prisma),` is configuring the adapter for NextAuth to use Prisma
  as the database adapter. Prisma is an Object-Relational Mapping (ORM) tool that provides an
  interface to interact with the database. The `PrismaAdapter` is a specific adapter provided by the
  `@next-auth/prisma-adapter` package that allows NextAuth to work with Prisma. It takes the
  `prisma` instance as an argument, which represents the connection to the Prisma database, and sets
  it as the adapter for NextAuth. This allows NextAuth to store and retrieve authentication-related
  data from the Prisma database. */
  adapter: PrismaAdapter(prisma),
  /* The `providers` array in the authentication options is configuring the authentication providers
 that NextAuth will use for authentication. */
  providers: [
    /* The `GithubProvider` is a provider configuration for NextAuth that allows users to authenticate
    using their GitHub accounts. */
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    /* The `GoogleProvider` configuration is setting up Google as an authentication provider for
    NextAuth. It requires two parameters: `clientId` and `clientSecret`. */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    /* The `CredentialsProvider` is a provider configuration for NextAuth that allows users to
    authenticate using their email and password credentials. */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      /* The `async authorize(credentials)` function is a callback function provided by the
      `CredentialsProvider` configuration in NextAuth. It is responsible for authorizing a user
      based on their email and password credentials. */
      async authorize(credentials) {
        /* The code `if (!credentials?.email || !credentials?.password)` is checking if the
       `credentials` object has a valid `email` and `password` property. */
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials');
        }

        /* The code `const user = await prisma.user.findUnique({ where: { email: credentials.email }
        })` is querying the Prisma database to find a user with the specified email address. */
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        /* The code `if (!user || !user?.hashedPassword)` is checking if the `user` object is null or
        if the `hashedPassword` property of the `user` object is null or undefined. */
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid Credentials');
        }

        /* The code `const isCorrectPassword = await bcrypt.compare(credentials.password,
        user.hashedPassword);` is using the `bcrypt` library to compare the provided password with
        the hashed password stored in the database. */
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );

        /* The code `if (!isCorrectPassword) { throw new Error('Invalid Credentials'); }` is checking
        if the provided password is correct. If the `isCorrectPassword` variable is false, it means
        that the provided password does not match the hashed password stored in the database. In
        this case, an error is thrown with the message 'Invalid Credentials'. This is done to
        prevent unauthorized access and to ensure that only users with the correct password can
        authenticate. */
        if (!isCorrectPassword) {
          throw new Error('Invalid Credentials');
        }

        return user;
      },
    }),
  ],
  /* The `debug`, `session`, and `secret` options in the authentication configuration are used to
  customize the behavior of NextAuth. */
  /* The line `debug: process.env.NODE_ENV === 'development',` is setting the debug mode for NextAuth
  based on the value of the `NODE_ENV` environment variable. */
  debug: process.env.NODE_ENV === 'development',
  session: {
    /* The `strategy: 'jwt'` option in the `session` configuration is specifying that JSON Web Tokens
    (JWT) should be used for session management in NextAuth. */
    strategy: 'jwt',
  },
  /* The line `secret: process.env.NEXTAUTH_SECRET` is setting the secret key used by NextAuth for
  signing and verifying session cookies and tokens. The `process.env.NEXTAUTH_SECRET` is accessing
  the value of the `NEXTAUTH_SECRET` environment variable, which should be set to a secure and
  random string. This secret key is important for the security of the authentication system as it
  helps prevent tampering and unauthorized access to session data. */
  secret: process.env.NEXTAUTH_SECRET,
};

/* The line `const handler = NextAuth(authOptions);` is creating a handler function for NextAuth using
the provided authentication options (`authOptions`). This handler function is responsible for
handling authentication requests and returning the appropriate responses. It is typically used as a
request handler in a Next.js API route or serverless function. */
const handler = NextAuth(authOptions);

/* The line `export { handler as GET, handler as POST };` is exporting the `handler` function as two
separate named exports: `GET` and `POST`. */
export { handler as GET, handler as POST };
```

### `UserBox.tsx`

```tsx
/* The `handleClick` function is a callback function that is triggered when the user clicks on the
  `UserBox` component. */
const handleClick = useCallback(() => {
  setIsLoading(true);

  /* The code snippet is using the Axios library to make a POST request to the '/api/conversations'
    endpoint with the user's ID as the payload. */
  axios
    /* The code snippet is making a POST request to the '/api/conversations' endpoint with the user's
      ID as the payload. This endpoint is likely responsible for creating a new conversation in the
      backend server, and the user's ID is being sent as data to associate the conversation with the
      user. */
    .post('/api/conversations', {
      userId: data.id,
    })
    .then(
      (
        data /* `router.push(`/conversations/${data.data.id}`)` is navigating the user to a
      new page with the URL path `/conversations/{id}`. The `data.data.id` is the ID
      of the newly created conversation, which is being appended to the URL path.
      This navigation is likely happening after the successful creation of a new
      conversation in the backend server. */,
      ) => router.push(`/conversations/${data.data.id}`),
    )
    .finally(() => setIsLoading(false));
}, [data, router]);
```

### `getCurrentUser.ts`

```ts
import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

/**
 * The function `getCurrentUser` retrieves the current user based on their email from the session,
 * using Prisma as the ORM.
 * @returns The function `getCurrentUser` returns the current user if they are logged in and their
 * email is available in the session. If the user is not logged in or their email is not available, it
 * returns `null`. If there is an error during the process, it also returns `null`.
 */
const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    /* The code `const currentUser = await prisma.user.findUnique({ ... })` is using Prisma's ORM to
    query the database and find a unique user based on their email. */
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error: any) {
    return null;
  }
};

export default getCurrentUser;
```

### `useConversation.ts`

```ts
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * The `useConversation` function returns an object with properties `isOpen` and `conversationId`,
 * which are derived from the `params` object.
 * @returns The `useConversation` function returns an object with two properties: `isOpen` and
 * `conversationId`.
 */
const useConversation = () => {
  const params = useParams();

  /* The code block is using the `useMemo` hook to memoize the value of `conversationId`. */
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return '';
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  /* The line `const isOpen = useMemo(() => !!conversationId, [conversationId]);` is using the `useMemo`
 hook to memoize the value of `isOpen`. */
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  /* The `return useMemo()` statement is returning an object with two properties: `isOpen` and
  `conversationId`. The `useMemo()` hook is used to memoize the value of the returned object, so
  that it is only recomputed when the dependencies (`isOpen` and `conversationId`) change. This
  helps optimize performance by avoiding unnecessary re-renders of components that use the
  `useConversation` hook. */
  return useMemo(
    () => ({
      isOpen,
      conversationId,
    }),
    [isOpen, conversationId],
  );
};

export default useConversation;
```

### `useRoute.ts`

```ts
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUser } from 'react-icons/hi2';
import useConversation from './useConversation';
import { useMemo } from 'react';

const useRoutes = () => {
  /* `const pathName = usePathname();` is using the `usePathname` hook from the `next/navigation`
  package to get the current pathname of the URL. It is used to determine the active route in the
  navigation. */
  const pathName = usePathname();
  /* The line `const { conversationId } = useConversation();` is using the `useConversation` hook to
  get the `conversationId` value. It is destructuring the returned object from the `useConversation`
  hook and assigning the value of `conversationId` to the constant `conversationId`. This allows the
  `conversationId` value to be used in the `useRoutes` function. */
  const { conversationId } = useConversation();

  /* The `useMemo` hook is used to memoize the value of `routes`. It takes two arguments: a function
  and a dependency array. */
  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathName === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUser,
        active: pathName === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathName, conversationId],
  );
  return routes;
};

export default useRoutes;
```

## `conversations`

### `getConversation.tsx`

```tsx
import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

/**
 * The function `getConversations` retrieves conversations with users, including their messages, for
 * the current user.
 * @returns The function `getConversations` returns an array of conversations.
 */
const getConversations = async () => {
  /* The line `const currentUser = await getCurrentUser();` is calling the `getCurrentUser` function
  and assigning its returned value to the `currentUser` variable. The `await` keyword is used
  because `getCurrentUser` is an asynchronous function, indicating that the function call should
  wait for the promise to be resolved before continuing execution. */
  const currentUser = await getCurrentUser();

  /* The code `if (!currentUser?.id) { return []; }` is checking if the `currentUser` object exists and
  if it has a valid `id` property. */
  if (!currentUser?.id) {
    return [];
  }

  /* The code block `try { ... } catch (error: any) { ... }` is a try-catch statement. It is used to
  handle potential errors that may occur during the execution of the code within the try block. */
  try {
    /* The code `const conversations = await prisma.conversation.findMany({ ... })` is using the Prisma
    client to query the database and retrieve multiple conversations. */
    const conversations = await prisma.conversation.findMany({
      /* The `orderBy` property in the `getConversations` function is used to specify the sorting order
      of the conversations retrieved from the database. In this case, it is sorting the
      conversations based on the `lastMessageAt` field in descending order (`'desc'`). */
      orderBy: {
        lastMessageAt: 'desc',
      },
      /* The `where` clause in the `getConversations` function is used to filter the conversations
      based on a specific condition. In this case, it is filtering the conversations based on the
      `userIds` field. */
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      /* The `include` property in the `getConversations` function is used to specify the related
      models that should be included in the query result. In this case, it includes the `users` and
      `messages` related to each conversation. */
      include: {
        users: true,
        messages: {
          /* The `include` property in the `getConversations` function is used to specify the related
          models that should be included in the query result. In this case, it includes the `sender`
          and `seen` related to each message in the conversation. */
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
```

### `ConversationList.tsx`

```tsx
/* The `pusherKey` variable is using the `useMemo` hook to memoize the value of
  `session.data?.user?.email`. */
const pusherKey = useMemo(() => {
  return session.data?.user?.email;
}, [session.data?.user?.email]);

/* The `useEffect` hook is used to perform side effects in a React component. In this case, it is
  used to subscribe to Pusher channels and bind event handlers for new conversations, conversation
  updates, and conversation removals. */
useEffect(() => {
  if (!pusherKey) {
    return;
  }

  /* `pusherClient.subscribe(pusherKey);` is subscribing to a Pusher channel using the `pusherKey`
    value. The `pusherKey` is typically a unique identifier for a user, such as their email address.
    By subscribing to a channel, the client is able to receive real-time updates and events related
    to that channel. In this case, it is subscribing to a channel specific to the user, which allows
    the client to receive new conversation events, conversation update events, and conversation
    removal events. */
  pusherClient.subscribe(pusherKey);

  /**
   * The function `newHandler` adds a conversation to the list of items if it does not already exist.
   * @param {FullConversationType} conversation - The `conversation` parameter is of type
   * `FullConversationType`.
   */
  const newHandler = (conversation: FullConversationType) => {
    /* The code `setItems((current) => {...})` is updating the state variable `items` with a new
      value. */
    setItems((current) => {
      /* The code `if (find(current, { id: conversation.id }))` is checking if there is already a
        conversation with the same `id` in the `current` array. */
      if (find(current, { id: conversation.id })) {
        return current;
      }

      return [conversation, ...current];
    });
  };

  /**
   * The `updateHandler` function updates the `messages` property of a conversation in an array of
   * conversations.
   * @param {FullConversationType} conversation - The `conversation` parameter is of type
   * `FullConversationType`.
   */
  const updateHandler = (conversation: FullConversationType) => {
    /* The code `setItems((current) => current.map((currentConversation) => {...}))` is updating the
      state variable `items` by mapping over the current array of conversations and updating the
      `messages` property of a specific conversation. */
    setItems((current) =>
      current.map((currentConversation) => {
        /* The code block `if (currentConversation.id === conversation.id) {...}` is checking if the
          `id` of the current conversation in the `map` function matches the `id` of the
          conversation that needs to be updated. */
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages,
          };
        }

        return currentConversation;
      }),
    );
  };

  /**
   * The function removes a conversation from a list of items and redirects to a different page if
   * the conversation being removed is currently selected.
   * @param {FullConversationType} conversation - The `conversation` parameter is of type
   * `FullConversationType`.
   */
  const removeHandler = (conversation: FullConversationType) => {
    /* The code `setItems((current) => {
              return [...current.filter((convo) => convo.id !== conversation.id)];
            });` is updating the state variable `items` by removing a conversation from the array of
      conversations. */
    setItems((current) => {
      return [...current.filter((convo) => convo.id !== conversation.id)];
    });

    /* The code `if (conversationId === conversation.id) {
              router.push('/conversations');
            }` is checking if the `conversationId` (which represents the currently selected
      conversation) is equal to the `id` of the conversation being removed. */
    if (conversationId === conversation.id) {
      router.push('/conversations');
    }
  };

  /* The code `pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);` is binding event handlers to specific
    events on the Pusher client. */
  pusherClient.bind('conversation:new', newHandler);
  pusherClient.bind('conversation:update', updateHandler);
  pusherClient.bind('conversation:remove', removeHandler);

  /* The `return () => { ... }` block of code is a cleanup function that is executed when the
    component is unmounted or when the dependencies of the `useEffect` hook change. */
  return () => {
    /* The code `pusherClient.unsubscribe(pusherKey)` is unsubscribing from a Pusher channel using
      the `pusherKey` value. This means that the client will no longer receive real-time updates and
      events related to that channel. */
    pusherClient.unsubscribe(pusherKey);
    pusherClient.unbind('conversation:new', newHandler);
    pusherClient.unbind('conversation:update', updateHandler);
    pusherClient.unbind('conversation:remove', removeHandler);
  };
}, [pusherKey, conversationId, router]);
```

### `GroupChatModal.tsx`

```tsx
/* The code is using the `useForm` hook from the `react-hook-form` library to handle form state and
  validation. */
const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors },
} = useForm<FieldValues>({
  defaultValues: {
    name: '',
    members: [],
  },
});

/* The line `const members = watch('members');` is using the `watch` function from the
  `react-hook-form` library to get the current value of the `members` field in the form. */
const members = watch('members');

/**
 * The function onSubmit is a handler for submitting form data, which makes a POST request to create
 * a conversation and then refreshes the page and closes the form.
 * @param data - The `data` parameter is an object that contains the form data submitted by the user.
 * It is of type `FieldValues`, which is a generic type representing the values of all fields in the
 * form.
 */
const onSubmit: SubmitHandler<FieldValues> = (data) => {
  setIsLoading(true);

  /* The code block is making a POST request to the '/api/conversations' endpoint with the form data
    and an additional property 'isGroup' set to true. */
  axios
    /* The `.post('/api/conversations', { ...data, isGroup: true })` is making a POST request to the
      '/api/conversations' endpoint with the form data and an additional property 'isGroup' set to
      true. This is used to create a conversation with the form data and indicate that it is a group
      chat. */
    .post('/api/conversations', { ...data, isGroup: true })
    .then(() => {
      /* `router.refresh()` is a function from the `next/navigation` module that is used to refresh
        the current page. In this code, it is called after the successful creation of a conversation
        to refresh the page and display the newly created conversation. */
      router.refresh();
      onClose();
    })
    .catch(() => toast.error('Something went wrong!'))
    .finally(() => setIsLoading(false));
};
```

### `/api/conversations`

```ts
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    /* The `if (isGroup)` block is creating a new conversation in the database if the `isGroup` flag is
    true. */
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      /* The code is iterating over each user in the `newConversation.users` array and triggering a
      Pusher event for each user with their email as the channel name. */
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    /* The code is using Prisma's `findMany` method to query the `conversation` table in the database.
    It is searching for existing conversations that match the following conditions: */
    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    /* The code is creating a new conversation in the database using Prisma's `create` method. */
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    /* The code is iterating over each user in the `newConversation.users` array and triggering 
    a Pusher event for each user with their email as the channel name. */
    newConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```

### `[conversationId]`

```ts
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams },
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* The code is using Prisma's query builder to find a unique conversation based on the provided
    conversationId. It is querying the "conversation" table and looking for a row where the "id"
    column matches the conversationId. */
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    /* The code `const deletedConversation = await prisma.conversation.deleteMany({ ... })` is deleting
    a conversation from the database. */
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    /* The code `existingConversation.users.forEach((user) => { ... })` is iterating over each user in
    the `existingConversation.users` array. */
    existingConversation.users.forEach((user) => {
      /* The code `if (user.email) { ... }` is checking if the `user` object has an `email` property.
      If the `user` object has an `email` property, it means that the user has an email associated
      with their account. */
      if (user.email) {
        /* The code `pusherServer.trigger(user.email, 'conversation:remove', existingConversation)` is
        using the Pusher library to trigger an event called `'conversation:remove'` for a specific
        user. */
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation,
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```

### `seen`

```ts
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

interface IParams {
  conversationId: string;
}

/**
 * The above function is a TypeScript function that handles a POST request to update the "seen" status
 * of a message in a conversation.
 * @param {Request} request - The `request` parameter is an object that represents the incoming HTTP
 * request. It contains information such as the request method, headers, and body.
 * @param  - - `request`: The incoming HTTP request object.
 * @returns different responses based on certain conditions. Here are the possible return values:
 */
export async function POST(request: Request, { params }: { params: IParams }) {
  /* The code you provided is a TypeScript function that handles a POST request to update the "seen"
  status of a message in a conversation. Here's a breakdown of what the code does: */
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the existing conversation
    /* The code `const conversation = await prisma.conversation.findUnique({ ... })` is querying the
    database using Prisma to find a conversation with a specific ID (`conversationId`). */
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(lastMessage);
    }

    // Update seen of last message
    /* The code `const updatedMessage = await prisma.message.update({ ... })` is updating the "seen"
    status of the last message in a conversation. */
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    /* The code `await pusherServer.trigger(currentUser.email, 'conversation:update', { id:
   conversationId, messages: [updatedMessage] });` is using the Pusher library to trigger an event
   called 'conversation:update'. */
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    /* The code `await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);` is
    using the Pusher library to trigger an event called 'message:update'. */
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage,
    );

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```

### `useOtherUser.ts`

```ts
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType } from '../types';
import { User } from '@prisma/client';

/**
 * The function `useOtherUser` returns the other user in a conversation based on the current user's
 * email.
 * @param {| FullConversationType
 *     | {
 *         users: User[];
 *       }} conversation - The `conversation` parameter can be of two types:
 * @returns The function `useOtherUser` returns the other user in a conversation.
 */
const useOtherUser = (
  conversation:
    | FullConversationType
    | {
        users: User[];
      },
) => {
  const session = useSession();

  /* The code is using the `useMemo` hook from React to memoize the result of the function. */
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    /* The code `const otherUser = conversation.users.filter((user) => user.email !==
    currentUserEmail);` is filtering the `users` array in the `conversation` object to find the user
    whose email is not equal to the current user's email. It returns an array of users who are not
    the current user. The `otherUser` variable will contain the first user from this filtered array,
    which represents the other user in the conversation. */
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail,
    );

    /* The line `return otherUser[0];` is returning the first element of the `otherUser` array. */
    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
```

### `ConversationBox.tsx`

```tsx
/* The `handleClick` function is a callback function that is created using the `useCallback` hook. It
  is used to handle the click event on the conversation box. When the conversation box is clicked,
  it will navigate the user to the conversation page for the specific conversation ID (`data.id`)
  using the `router.push` method. The dependencies `[router, data.id]` are specified in the second
  argument of `useCallback` to ensure that the function is memoized and only recreated if either
  `router` or `data.id` changes. */
const handleClick = useCallback(() => {
  router.push(`/conversations/${data.id}`);
}, [router, data.id]);

/* The `lastMessage` constant is using the `useMemo` hook to memoize the calculation of the last
  message in the conversation. */
const lastMessage = useMemo(() => {
  const messages = data.messages || [];

  return messages[messages.length - 1];
}, [data.messages]);

/* The `useMemo` hook is used to memoize the calculation of the `userEmail` constant. */
const userEmail = useMemo(() => {
  return session.data?.user?.email;
}, [session.data?.user?.email]);

/* The `hasSeen` constant is using the `useMemo` hook to memoize the calculation of whether the
  current user has seen the last message in the conversation. */
const hasSeen = useMemo(() => {
  if (!lastMessage) {
    return false;
  }

  /* The line `const seenArray = lastMessage.seen || [];` is initializing the `seenArray` variable
    with the value of `lastMessage.seen` if it exists, otherwise it is assigning an empty array `[]`
    to `seenArray`. */
  const seenArray = lastMessage.seen || [];

  if (!userEmail) {
    return false;
  }

  /* The line `return seenArray.filter((user) => user.email === userEmail).length !== 0;` is
    filtering the `seenArray` to check if the current user's email (`userEmail`) exists in the
    array. */
  return seenArray.filter((user) => user.email === userEmail).length !== 0;
}, [userEmail, lastMessage]);

/* The `lastMessageText` constant is using the `useMemo` hook to memoize the calculation of the text
  that should be displayed as the last message in the conversation box. */
const lastMessageText = useMemo(() => {
  if (lastMessage?.image) {
    return 'Sent an image';
  }

  if (lastMessage?.body) {
    return lastMessage.body;
  }

  return 'Start a conversation';
}, [lastMessage]);
```

# `API Pusher page`

### `auth.ts`

`Handle authentication for a Pusher channel in a Next.js API route.`

```ts
/* The code is importing various modules and functions from different libraries and files. */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/app/libs/pusher';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * This function handles authentication for a Pusher channel in a Next.js API route.
 * @param {NextApiRequest} request - The `request` parameter is an object that represents the incoming
 * HTTP request. It contains information such as the request method, headers, query parameters, and
 * body.
 * @param {NextApiResponse} response - The `response` parameter is an instance of the `NextApiResponse`
 * class, which represents the HTTP response that will be sent back to the client. It provides methods
 * and properties for setting the response status, headers, and body.
 * @returns the response object with the authorized authentication response from Pusher.
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  /* The code is using the `getServerSession` function to retrieve the user session from the server. */
  const session = await getServerSession(request, response, authOptions);

  /* The code is checking if the `session` object exists and if it has a `user` property with an
  `email` property. If either of these conditions is not met, it means that the user is not
  authenticated or the user's email is not available in the session. In this case, the code sets the
  response status to 401 (Unauthorized) and returns it. This is a common practice to handle
  unauthorized access to a resource. */
  if (!session?.user?.email) {
    return response.status(401);
  }

  /* The code is extracting the `socket_id` and `channel_name` from the `request.body` object. These
  values are typically sent by the client when requesting authentication for a Pusher channel. */
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: session.user.email,
  };

  /* This function is responsible for generating an authentication response for a Pusher channel. */
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return response.send(authResponse);
}
```

# `setting`

```ts
import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

/**
 * This TypeScript function handles a POST request to update a user's name and image in a database.
 * @param {Request} request - The `request` parameter is an object that represents the incoming HTTP
 * request. It contains information such as the request method, headers, and body.
 * @returns a response object. If the current user is not authorized (currentUser?.id is falsy), it
 * returns a response with a status of 401 (Unauthorized). If there are no errors, it returns a JSON
 * response with the updated user object. If there is an error, it returns a response with a status of
 * 500 (Internal Error).
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /* The code `const updatedUser = await prisma.user.update({ ... })` is updating the user's name and
    image in the database using the Prisma ORM. */
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: image,
        name: name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.log(error, 'ERROR_SETTINGS');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
```
