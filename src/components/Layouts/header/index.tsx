"use client";

import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { ThemeToggleSwitch } from "./theme-toggle";
import { useUser, UserButton } from "@clerk/nextjs";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-stroke bg-white px-3 py-3 shadow-1 dark:border-stroke-dark dark:bg-gray-dark sm:px-4 sm:py-4 md:px-5 2xl:px-10">
      <div className="flex items-center justify-between gap-2 sm:gap-6 md:gap-8">
        {/* Left: Sidebar toggle + logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-lg border px-1 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden sm:px-1.5"
          >
            <MenuIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </button>

          {isMobile && (
            <Link href={"/"} className="ml-1 hidden xs:block">
              <Image
                src="/images/logo/logo-icon.svg"
                width={32}
                height={32}
                alt="Logo"
              />
            </Link>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1 xs:gap-2 sm:gap-4">
          <a
            href="tel:112"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:px-4 sm:py-2"
          >
            SOS Emergency
          </a>

          <ThemeToggleSwitch />

          <div className="shrink-0">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex gap-1 sm:gap-2">
                <Link href="/sign-in">
                  <button className="rounded-lg border-black bg-black px-2 py-1.5 text-xs sm:text-sm text-white shadow-xl transition hover:bg-primary hover:text-white sm:px-4 sm:py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="rounded-lg border-black bg-black px-2 py-1.5 text-xs sm:text-sm text-white shadow-xl transition hover:bg-primary hover:text-white sm:px-4 sm:py-2">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}