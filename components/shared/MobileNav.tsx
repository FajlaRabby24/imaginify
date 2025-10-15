"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href={"/"} className="flex items-center gap-2 md:py-2">
        <Image
          src={"/assets/images/logo-text.svg"}
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSwitchSessionUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image
                src={"/assets/icons/menu.svg"}
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <SheetHeader>
                  <SheetTitle>
                    <Image
                      src={"/assets/images/logo-text.svg"}
                      alt="logo"
                      width={152}
                      height={23}
                      className="pt-2 pl-2"
                    />
                  </SheetTitle>
                </SheetHeader>

                <ul className="header-nav_elements">
                  {navLinks?.map((link, idx) => {
                    const isActive = link.route === pathname;
                    return (
                      <li
                        key={idx}
                        className={`${
                          isActive ? "gradient-text" : ""
                        } flex whitespace-nowrap text-black`}
                      >
                        <Link className="header-link" href={link.route}>
                          <Image
                            src={link.icon}
                            alt="logo"
                            width={24}
                            height={24}
                            className={isActive ? "brightness-200" : ""}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        {/* signed out  */}
        {/* signedOUt  */}
        <SignedOut>
          <Button asChild className="button bg-purple-700 bg-cover">
            <Link href={"/sign-in"}></Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
