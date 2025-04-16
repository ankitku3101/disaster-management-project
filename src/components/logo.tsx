import logo from "@/assets/logos/logo-icon.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center h-8 space-x-2">
      <div className="relative h-8 w-8">
        <Image
          src={logo}
          alt="Suraksha.ai logo"
          fill
          className="object-contain"
          role="presentation"
          quality={100}
        />
      </div>
      <h1 className="text-heading-5 font-bold text-dark dark:text-white">
        Suraksha.ai
      </h1>
    </div>
  );
}
