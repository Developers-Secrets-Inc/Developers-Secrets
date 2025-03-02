import { createClient } from "@/utils/supabase/server";
import { AuthButtonsClient } from "./AuthButtons.client";

export const AuthButtons = async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return <AuthButtonsClient user={user} />
}

