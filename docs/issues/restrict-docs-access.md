### Issue: Restrict `/docs` access to authenticated users

**Problem Description:**

The `/docs` route and its content are currently accessible to all users, including those who are not logged in. This is not the desired behavior; documentation should only be available to authenticated users.

**Proposed Solution:**

Implement a server-side check within the `/docs` route to verify if the user is authenticated. If no active user session is found, the user should be redirected to the login page.

This check can be performed in either the `layout.tsx` or `page.tsx` files within the `src/app/(frontend)/docs/` directory. We can leverage existing server functions like `getUser` or `getSessionUser` from `src/core/user/index.ts` to retrieve the user session.

If the user is not authenticated (i.e., `getUser` or `getSessionUser` returns `null` or an error indicating no session), use Next.js' `redirect` function to send them to the login route (`/auth/login`).

**Relevant Files:**

- `src/app/(frontend)/docs/layout.tsx` (Potential location for the check and redirection)
- `src/app/(frontend)/docs/[[...slug]]/page.tsx` (Alternative potential location)
- `src/core/user/index.ts` (Contains user fetching functions like `getUser` and `getSessionUser`)
- `src/core/user/auth.ts` (Related to authentication logic)
- `src/app/(frontend)/auth/login/page.tsx` (Target redirect page)

**Implementation Steps:**

1.  In `src/app/(frontend)/docs/layout.tsx` or `src/app/(frontend)/docs/[[...slug]]/page.tsx`, import the `getUser` or `getSessionUser` function and the `redirect` function from `next/navigation`.
2.  Call the user fetching function at the beginning of the component.
3.  Check the result: if no user is returned, call `redirect('/auth/login')`.
4.  Ensure the component is marked as a server component if performing server-side data fetching and redirection. 