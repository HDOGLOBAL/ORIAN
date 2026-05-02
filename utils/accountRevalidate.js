'use server'

import  { revalidatePath } from "next/cache"

export const accountRevalidate = async () => {
    revalidatePath('/account')
}

