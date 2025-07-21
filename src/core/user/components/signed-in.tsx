import { getUser } from "@/core/user"
import { redirect } from "next/navigation"

type RedirectIfSignedInProps = {
    children: React.ReactNode
    redirectTo?: string
}

const DEFAULT_REDIRECT_TO = "/home"

export const RedirectIfSignedIn = async ({children, redirectTo}: RedirectIfSignedInProps) => {
    const user = await getUser()

    if (user) {
        return redirect(redirectTo || DEFAULT_REDIRECT_TO)
    }

    return children
}


export const RedirectIfNotSignedIn = async ({children, redirectTo}: RedirectIfSignedInProps) => {
    const user = await getUser()

    if (!user) {
        return redirect(redirectTo || "/")
    }

    return children
}
