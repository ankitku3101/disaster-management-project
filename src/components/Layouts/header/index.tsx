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
    <header className="sticky top-0 z-30 w-full border-b border-stroke bg-white px-4 py-4 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 md:gap-8">
        {/* Left: Sidebar toggle + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
          >
            <MenuIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </button>

          {isMobile && (
            <Link href={"/"} className="ml-1 max-[430px]:hidden">
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
        <div className="flex flex-1 items-center justify-end gap-2 flex-wrap min-[375px]:gap-4">
          <a
            href="tel:112"
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            SOS Emergency
          </a>

          <ThemeToggleSwitch />

          <div className="shrink-0">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="flex gap-2">
                <Link href="/sign-in">
                  <button className="rounded-lg border-black bg-black px-4 py-2 text-sm text-white shadow-xl transition hover:bg-primary hover:text-white">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="rounded-lg border-black bg-black px-4 py-2 text-sm text-white shadow-xl transition hover:bg-primary hover:text-white">
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
