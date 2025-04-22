"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { SheetClose } from '@/components/ui/sheet'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'


const NavLinks = ({ isMobileNav = false}: { isMobileNav?: boolean}) => {
    const pathname = usePathname()
    const userId = 1

    return (
        <>
            {sidebarLinks.map((link) => {
                const isActive = (pathname.includes(link.route) && link.route.length > 1 || pathname === link.route)

                if (link.route === "/profile") {
                    if (userId) link.route = `/profile/${userId}`
                }
                const linkComponent = (
                    <Link
                        href={link.route}
                        key={link.label}
                        className={cn(
                            isActive 
                            ? 'primary-gradient rounded-lg text-light-900'
                            : 'text-dark300_light900',
                            "flex items-center justify-start gap-4 bg-transparent p-4"

                    )}  >
                        <Image
                            src={link.imgURL}
                            width={20}
                            height={20}
                            alt={link.label}
                            className={cn(
                                {"invert-colors": !isActive}
                            )}
                        />
                        <p 
                            className={cn(
                                isActive ? "base-bold" : "base-medium",
                                !isMobileNav && "max-lg:hidden")}>{link.label}</p>
                    </Link>
                )
                
                return isMobileNav ? (
                    <SheetClose asChild key={link.label}>
                        {linkComponent}
                    </SheetClose>
                ) : (
                    <React.Fragment key={link.label}>
                        {linkComponent}
                    </React.Fragment>
                )
            })}
        </>
    )
}

export default NavLinks