import Image from "next/image"
import Link from "next/link"

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button"
import ROUTES from "@/constants/routes"

import NavLinks from "./navbar/navLinks"

const LeftSideBar = async () => {
    const session = await auth();
return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
        <div className="flex flex-1 flex-col gap-6">
            <NavLinks />
        </div>
        
        <div className="flex flex-col gap-3">
            {session?.user 
            ? (<>
                <form className="px-10" action={async() => {
                    "use server";
                    await signOut({
                        redirectTo: ROUTES.SIGN_IN,
                        });
                    }}>
                    <Button className='small-medium btn-secondary text-dark200_light900 min-h-[41px] w-full rounded-lg px-4 py-3' type="submit">
                        <Image src="/icons/door.svg" alt="Door Icon" width={20} height={20} className="dark:invert" />Log out
                    </Button>

                </form>
                </>) : (<>
                <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3' asChild>
                    <Link href={ROUTES.SIGN_IN}>
                        <span className='primary-text-gradient max-lg:hidden'>Log in</span>
                    </Link>
                </Button>
                <Button className='small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none' asChild>
                    <Link href={ROUTES.SIGN_UP}>
                        <span className="max-lg:hidden">Signup</span>
                    </Link>
                </Button>
                </>)
                }


        </div>
    </section>
)
}

export default LeftSideBar