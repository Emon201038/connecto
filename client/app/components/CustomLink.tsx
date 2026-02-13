"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react";
type Props = {
  href: string;
  children: ReactNode;
}
export default function CustomLink({ href, children }: Props) {
  const pathname = usePathname();
  return (
    <Link className={`flex justify-center items-center py-2  border-b-2 h-full ${pathname === href ? " border-blue-600 text-blue-600" : "border-transparent"}`} href={href}>{children}</Link>
  )
}