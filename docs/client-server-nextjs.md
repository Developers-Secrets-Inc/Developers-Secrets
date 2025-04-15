Server Components
React Server Components allow you to write UI that can be rendered and optionally cached on the server. In Next.js, the rendering work is further split by route segments to enable streaming and partial rendering, and there are three different server rendering strategies:

Static Rendering
Dynamic Rendering
Streaming
This page will go through how Server Components work, when you might use them, and the different server rendering strategies.

Benefits of Server Rendering
There are a couple of benefits to doing the rendering work on the server, including:

Data Fetching: Server Components allow you to move data fetching to the server, closer to your data source. This can improve performance by reducing time it takes to fetch data needed for rendering, and the number of requests the client needs to make.
Security: Server Components allow you to keep sensitive data and logic on the server, such as tokens and API keys, without the risk of exposing them to the client.
Caching: By rendering on the server, the result can be cached and reused on subsequent requests and across users. This can improve performance and reduce cost by reducing the amount of rendering and data fetching done on each request.
Performance: Server Components give you additional tools to optimize performance from the baseline. For example, if you start with an app composed of entirely Client Components, moving non-interactive pieces of your UI to Server Components can reduce the amount of client-side JavaScript needed. This is beneficial for users with slower internet or less powerful devices, as the browser has less client-side JavaScript to download, parse, and execute.
Initial Page Load and First Contentful Paint (FCP): On the server, we can generate HTML to allow users to view the page immediately, without waiting for the client to download, parse and execute the JavaScript needed to render the page.
Search Engine Optimization and Social Network Shareability: The rendered HTML can be used by search engine bots to index your pages and social network bots to generate social card previews for your pages.
Streaming: Server Components allow you to split the rendering work into chunks and stream them to the client as they become ready. This allows the user to see parts of the page earlier without having to wait for the entire page to be rendered on the server.
Using Server Components in Next.js
By default, Next.js uses Server Components. This allows you to automatically implement server rendering with no additional configuration, and you can opt into using Client Components when needed, see Client Components.

How are Server Components rendered?
On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks: by individual route segments and Suspense Boundaries.

Each chunk is rendered in two steps:

React renders Server Components into a special data format called the React Server Component Payload (RSC Payload).
Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML on the server.
Then, on the client:

The HTML is used to immediately show a fast non-interactive preview of the route - this is for the initial page load only.
The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
The JavaScript instructions are used to hydrate Client Components and make the application interactive.
What is the React Server Component Payload (RSC)?
The RSC Payload is a compact binary representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:

The rendered result of Server Components
Placeholders for where Client Components should be rendered and references to their JavaScript files
Any props passed from a Server Component to a Client Component
Server Rendering Strategies
There are three subsets of server rendering: Static, Dynamic, and Streaming.

Static Rendering (Default)
With Static Rendering, routes are rendered at build time, or in the background after data revalidation. The result is cached and can be pushed to a Content Delivery Network (CDN). This optimization allows you to share the result of the rendering work between users and server requests.

Static rendering is useful when a route has data that is not personalized to the user and can be known at build time, such as a static blog post or a product page.

Dynamic Rendering
With Dynamic Rendering, routes are rendered for each user at request time.

Dynamic rendering is useful when a route has data that is personalized to the user or has information that can only be known at request time, such as cookies or the URL's search params.

Dynamic Routes with Cached Data

In most websites, routes are not fully static or fully dynamic - it's a spectrum. For example, you can have an e-commerce page that uses cached product data that's revalidated at an interval, but also has uncached, personalized customer data.

In Next.js, you can have dynamically rendered routes that have both cached and uncached data. This is because the RSC Payload and data are cached separately. This allows you to opt into dynamic rendering without worrying about the performance impact of fetching all the data at request time.

Learn more about the full-route cache and Data Cache.

Switching to Dynamic Rendering
During rendering, if a Dynamic API or a fetch option of { cache: 'no-store' } is discovered, Next.js will switch to dynamically rendering the whole route. This table summarizes how Dynamic APIs and data caching affect whether a route is statically or dynamically rendered:

Dynamic APIs	Data	Route
No	Cached	Statically Rendered
Yes	Cached	Dynamically Rendered
No	Not Cached	Dynamically Rendered
Yes	Not Cached	Dynamically Rendered
In the table above, for a route to be fully static, all data must be cached. However, you can have a dynamically rendered route that uses both cached and uncached data fetches.

As a developer, you do not need to choose between static and dynamic rendering as Next.js will automatically choose the best rendering strategy for each route based on the features and APIs used. Instead, you choose when to cache or revalidate specific data, and you may choose to stream parts of your UI.

Dynamic APIs
Dynamic APIs rely on information that can only be known at request time (and not ahead of time during prerendering). Using any of these APIs signals the developer's intention and will opt the whole route into dynamic rendering at the request time. These APIs include:

cookies
headers
connection
draftMode
searchParams prop
unstable_noStore
Streaming
Diagram showing parallelization of route segments during streaming, showing data fetching, rendering, and hydration of individual chunks.
Streaming enables you to progressively render UI from the server. Work is split into chunks and streamed to the client as it becomes ready. This allows the user to see parts of the page immediately, before the entire content has finished rendering.

Diagram showing partially rendered page on the client, with loading UI for chunks that are being streamed.
Streaming is built into the Next.js App Router by default. This helps improve both the initial page loading performance, as well as UI that depends on slower data fetches that would block rendering the whole route. For example, reviews on a product page.

You can start streaming route segments using loading.js and UI components with React Suspense. See the Loading UI and Streaming section for more information.


Client Components allow you to write interactive UI that is prerendered on the server and can use client JavaScript to run in the browser.

This page will go through how Client Components work, how they're rendered, and when you might use them.

Benefits of Client Rendering
There are a couple of benefits to doing the rendering work on the client, including:

Interactivity: Client Components can use state, effects, and event listeners, meaning they can provide immediate feedback to the user and update the UI.
Browser APIs: Client Components have access to browser APIs, like geolocation or localStorage.
Using Client Components in Next.js
To use Client Components, you can add the React "use client" directive at the top of a file, above your imports.

"use client" is used to declare a boundary between a Server and Client Component modules. This means that by defining a "use client" in a file, all other modules imported into it, including child components, are considered part of the client bundle.

app/counter.tsx
TypeScript

TypeScript

'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
The diagram below shows that using onClick and useState in a nested component (toggle.js) will cause an error if the "use client" directive is not defined. This is because, by default, all components in the App Router are Server Components where these APIs are not available. By defining the "use client" directive in toggle.js, you can tell React to enter the client boundary where these APIs are available.

Use Client Directive and Network Boundary
Defining multiple use client entry points:

You can define multiple "use client" entry points in your React Component tree. This allows you to split your application into multiple client bundles.

However, "use client" doesn't need to be defined in every component that needs to be rendered on the client. Once you define the boundary, all child components and modules imported into it are considered part of the client bundle.

How are Client Components Rendered?
In Next.js, Client Components are rendered differently depending on whether the request is part of a full page load (an initial visit to your application or a page reload triggered by a browser refresh) or a subsequent navigation.

Full page load
To optimize the initial page load, Next.js will use React's APIs to render a static HTML preview on the server for both Client and Server Components. This means, when the user first visits your application, they will see the content of the page immediately, without having to wait for the client to download, parse, and execute the Client Component JavaScript bundle.

On the server:

React renders Server Components into a special data format called the React Server Component Payload (RSC Payload), which includes references to Client Components.
Next.js uses the RSC Payload and Client Component JavaScript instructions to render HTML for the route on the server.
Then, on the client:

The HTML is used to immediately show a fast non-interactive initial preview of the route.
The React Server Components Payload is used to reconcile the Client and Server Component trees, and update the DOM.
The JavaScript instructions are used to hydrate Client Components and make their UI interactive.
What is hydration?

Hydration is the process of attaching event listeners to the DOM, to make the static HTML interactive. Behind the scenes, hydration is done with the hydrateRoot React API.

Subsequent Navigations
On subsequent navigations, Client Components are rendered entirely on the client, without the server-rendered HTML.

This means the Client Component JavaScript bundle is downloaded and parsed. Once the bundle is ready, React will use the RSC Payload to reconcile the Client and Server Component trees, and update the DOM.

Going back to the Server Environment
Sometimes, after you've declared the "use client" boundary, you may want to go back to the server environment. For example, you may want to reduce the client bundle size, fetch data on the server, or use an API that is only available on the server.

You can keep code on the server even though it's theoretically nested inside Client Components by interleaving Client and Server Components and Server Actions. See the Composition Patterns page for more information.

Server and Client Composition Patterns
When building React applications, you will need to consider what parts of your application should be rendered on the server or the client. This page covers some recommended composition patterns when using Server and Client Components.

When to use Server and Client Components?
Here's a quick summary of the different use cases for Server and Client Components:

What do you need to do?	Server Component	Client Component
Fetch data		
Access backend resources (directly)		
Keep sensitive information on the server (access tokens, API keys, etc)		
Keep large dependencies on the server / Reduce client-side JavaScript		
Add interactivity and event listeners (onClick(), onChange(), etc)		
Use State and Lifecycle Effects (useState(), useReducer(), useEffect(), etc)		
Use browser-only APIs		
Use custom hooks that depend on state, effects, or browser-only APIs		
Use React Class components		
Server Component Patterns
Before opting into client-side rendering, you may wish to do some work on the server like fetching data, or accessing your database or backend services.

Here are some common patterns when working with Server Components:

Sharing data between components
When fetching data on the server, there may be cases where you need to share data across different components. For example, you may have a layout and a page that depend on the same data.

Instead of using React Context (which is not available on the server) or passing data as props, you can use fetch or React's cache function to fetch the same data in the components that need it, without worrying about making duplicate requests for the same data. This is because React extends fetch to automatically memoize data requests, and the cache function can be used when fetch is not available.

View an example of this pattern.

Keeping Server-only Code out of the Client Environment
Since JavaScript modules can be shared between both Server and Client Components modules, it's possible for code that was only ever intended to be run on the server to sneak its way into the client.

For example, take the following data-fetching function:

lib/data.ts
TypeScript

TypeScript

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
At first glance, it appears that getData works on both the server and the client. However, this function contains an API_KEY, written with the intention that it would only ever be executed on the server.

Since the environment variable API_KEY is not prefixed with NEXT_PUBLIC, it's a private variable that can only be accessed on the server. To prevent your environment variables from being leaked to the client, Next.js replaces private environment variables with an empty string.

As a result, even though getData() can be imported and executed on the client, it won't work as expected. And while making the variable public would make the function work on the client, you may not want to expose sensitive information to the client.

To prevent this sort of unintended client usage of server code, we can use the server-only package to give other developers a build-time error if they ever accidentally import one of these modules into a Client Component.

To use server-only, first install the package:

Terminal

npm install server-only
Then import the package into any module that contains server-only code:

lib/data.js

import 'server-only'
 
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
Now, any Client Component that imports getData() will receive a build-time error explaining that this module can only be used on the server.

The corresponding package client-only can be used to mark modules that contain client-only code – for example, code that accesses the window object.

Using Third-party Packages and Providers
Since Server Components are a new React feature, third-party packages and providers in the ecosystem are just beginning to add the "use client" directive to components that use client-only features like useState, useEffect, and createContext.

Today, many components from npm packages that use client-only features do not yet have the directive. These third-party components will work as expected within Client Components since they have the "use client" directive, but they won't work within Server Components.

For example, let's say you've installed the hypothetical acme-carousel package which has a <Carousel /> component. This component uses useState, but it doesn't yet have the "use client" directive.

If you use <Carousel /> within a Client Component, it will work as expected:

app/gallery.tsx
TypeScript

TypeScript

'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
 
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
However, if you try to use it directly within a Server Component, you'll see an error:

app/page.tsx
TypeScript

TypeScript

import { Carousel } from 'acme-carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
 
      {/* Error: `useState` can not be used within Server Components */}
      <Carousel />
    </div>
  )
}
This is because Next.js doesn't know <Carousel /> is using client-only features.

To fix this, you can wrap third-party components that rely on client-only features in your own Client Components:

app/carousel.tsx
TypeScript

TypeScript

'use client'
 
import { Carousel } from 'acme-carousel'
 
export default Carousel
Now, you can use <Carousel /> directly within a Server Component:

app/page.tsx
TypeScript

TypeScript

import Carousel from './carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
 
      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
We don't expect you to need to wrap most third-party components since it's likely you'll be using them within Client Components. However, one exception is providers, since they rely on React state and context, and are typically needed at the root of an application. Learn more about third-party context providers below.

Using Context Providers
Context providers are typically rendered near the root of an application to share global concerns, like the current theme. Since React context is not supported in Server Components, trying to create a context at the root of your application will cause an error:

app/layout.tsx
TypeScript

TypeScript

import { createContext } from 'react'
 
//  createContext is not supported in Server Components
export const ThemeContext = createContext({})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
To fix this, create your context and render its provider inside of a Client Component:

app/theme-provider.tsx
TypeScript

TypeScript

'use client'
 
import { createContext } from 'react'
 
export const ThemeContext = createContext({})
 
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
Your Server Component will now be able to directly render your provider since it's been marked as a Client Component:

app/layout.tsx
TypeScript

TypeScript

import ThemeProvider from './theme-provider'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
With the provider rendered at the root, all other Client Components throughout your app will be able to consume this context.

Good to know: You should render providers as deep as possible in the tree – notice how ThemeProvider only wraps {children} instead of the entire <html> document. This makes it easier for Next.js to optimize the static parts of your Server Components.

Advice for Library Authors
In a similar fashion, library authors creating packages to be consumed by other developers can use the "use client" directive to mark client entry points of their package. This allows users of the package to import package components directly into their Server Components without having to create a wrapping boundary.

You can optimize your package by using 'use client' deeper in the tree, allowing the imported modules to be part of the Server Component module graph.

It's worth noting some bundlers might strip out "use client" directives. You can find an example of how to configure esbuild to include the "use client" directive in the React Wrap Balancer and Vercel Analytics repositories.

Client Components
Moving Client Components Down the Tree
To reduce the Client JavaScript bundle size, we recommend moving Client Components down your component tree.

For example, you may have a Layout that has static elements (e.g. logo, links, etc) and an interactive search bar that uses state.

Instead of making the whole layout a Client Component, move the interactive logic to a Client Component (e.g. <SearchBar />) and keep your layout as a Server Component. This means you don't have to send all the component JavaScript of the layout to the client.

app/layout.tsx
TypeScript

TypeScript

// SearchBar is a Client Component
import SearchBar from './searchbar'
// Logo is a Server Component
import Logo from './logo'
 
// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
Passing props from Server to Client Components (Serialization)
If you fetch data in a Server Component, you may want to pass data down as props to Client Components. Props passed from the Server to Client Components need to be serializable by React.

If your Client Components depend on data that is not serializable, you can fetch data on the client with a third party library or on the server with a Route Handler.

Interleaving Server and Client Components
When interleaving Client and Server Components, it may be helpful to visualize your UI as a tree of components. Starting with the root layout, which is a Server Component, you can then render certain subtrees of components on the client by adding the "use client" directive.

Within those client subtrees, you can still nest Server Components or call Server Actions, however there are some things to keep in mind:

During a request-response lifecycle, your code moves from the server to the client. If you need to access data or resources on the server while on the client, you'll be making a new request to the server - not switching back and forth.
When a new request is made to the server, all Server Components are rendered first, including those nested inside Client Components. The rendered result (RSC Payload) will contain references to the locations of Client Components. Then, on the client, React uses the RSC Payload to reconcile Server and Client Components into a single tree.
Since Client Components are rendered after Server Components, you cannot import a Server Component into a Client Component module (since it would require a new request back to the server). Instead, you can pass a Server Component as props to a Client Component. See the unsupported pattern and supported pattern sections below.
Unsupported Pattern: Importing Server Components into Client Components
The following pattern is not supported. You cannot import a Server Component into a Client Component:

app/client-component.tsx
TypeScript

TypeScript

'use client'
 
// You cannot import a Server Component into a Client Component.
import ServerComponent from './Server-Component'
 
export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
 
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
 
      <ServerComponent />
    </>
  )
}
Supported Pattern: Passing Server Components to Client Components as Props
The following pattern is supported. You can pass Server Components as a prop to a Client Component.

A common pattern is to use the React children prop to create a "slot" in your Client Component.

In the example below, <ClientComponent> accepts a children prop:

app/client-component.tsx
TypeScript

TypeScript

'use client'
 
import { useState } from 'react'
 
export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
 
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
<ClientComponent> doesn't know that children will eventually be filled in by the result of a Server Component. The only responsibility <ClientComponent> has is to decide where children will eventually be placed.

In a parent Server Component, you can import both the <ClientComponent> and <ServerComponent> and pass <ServerComponent> as a child of <ClientComponent>:

app/page.tsx
TypeScript

TypeScript

// This pattern works:
// You can pass a Server Component as a child or prop of a
// Client Component.
import ClientComponent from './client-component'
import ServerComponent from './server-component'
 
// Pages in Next.js are Server Components by default
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
With this approach, <ClientComponent> and <ServerComponent> are decoupled and can be rendered independently. In this case, the child <ServerComponent> can be rendered on the server, well before <ClientComponent> is rendered on the client.

Good to know:

The pattern of "lifting content up" has been used to avoid re-rendering a nested child component when a parent component re-renders.
You're not limited to the children prop. You can use any prop to pass JSX.


Partial Prerendering (PPR) enables you to combine static and dynamic components together in the same route.

During the build, Next.js prerenders as much of the route as possible. If dynamic code is detected, like reading from the incoming request, you can wrap the relevant component with a React Suspense boundary. The Suspense boundary fallback will then be included in the prerendered HTML.

Partially Prerendered Product Page showing static nav and product information, and dynamic cart and recommended products
🎥 Watch: Why PPR and how it works → YouTube (10 minutes).

Background
PPR enables your Next.js server to immediately send prerendered content.

To prevent client to server waterfalls, dynamic components begin streaming from the server in parallel while serving the initial prerender. This ensures dynamic components can begin rendering before client JavaScript has been loaded in the browser.

To prevent creating many HTTP requests for each dynamic component, PPR is able to combine the static prerender and dynamic components together into a single HTTP request. This ensures there are not multiple network roundtrips needed for each dynamic component.

Using Partial Prerendering
Incremental Adoption (Version 15 Canary Versions)
In Next.js 15 canary versions, PPR is available as an experimental feature. It's not available in the stable versions yet. To install:


npm install next@canary
You can incrementally adopt Partial Prerendering in layouts and pages by setting the ppr option in next.config.js to incremental, and exporting the experimental_ppr route config option at the top of the file:

next.config.ts
TypeScript

TypeScript

import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}
 
export default nextConfig
app/page.tsx
TypeScript

TypeScript

import { Suspense } from 'react'
import { StaticComponent, DynamicComponent, Fallback } from '@/app/ui'
 
export const experimental_ppr = true
 
export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
Good to know:

Routes that don't have experimental_ppr will default to false and will not be prerendered using PPR. You need to explicitly opt-in to PPR for each route.
experimental_ppr will apply to all children of the route segment, including nested layouts and pages. You don't have to add it to every file, only the top segment of a route.
To disable PPR for children segments, you can set experimental_ppr to false in the child segment.
Dynamic Components
When creating the prerender for your route during next build, Next.js requires that Dynamic APIs are wrapped with React Suspense. The fallback is then included in the prerender.

For example, using functions like cookies or headers:

app/user.tsx
TypeScript

TypeScript

import { cookies } from 'next/headers'
 
export async function User() {
  const session = (await cookies()).get('session')?.value
  return '...'
}
This component requires looking at the incoming request to read cookies. To use this with PPR, you should wrap the component with Suspense:

app/page.tsx
TypeScript

TypeScript

import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'
 
export const experimental_ppr = true
 
export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
Components only opt into dynamic rendering when the value is accessed.

For example, if you are reading searchParams from a page, you can forward this value to another component as a prop:

app/page.tsx
TypeScript

TypeScript

import { Table } from './table'
 
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Table searchParams={searchParams} />
    </section>
  )
}
Inside of the table component, accessing the value from searchParams will make the component run dynamically:

app/table.tsx
TypeScript

TypeScript

export async function Table({
  searchParams,
}: {
  searchParams: Promise<{ sort: string }>
}) {
  const sort = (await searchParams).sort === 'true'
  return '...'
}