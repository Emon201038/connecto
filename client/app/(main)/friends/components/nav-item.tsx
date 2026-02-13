"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {}

const navList = [
  {
    id: 1,
    href: "/friends",
    title: "Home",
    iconUrl:
      "https://static.xx.fbcdn.net/rsrc.php/v4/yf/r/ipTPUr0bluW.png?_nc_eui2=AeGvY03-cU3_V4o4iJuchHJbgQlbGf_quNuBCVsZ_-q42y0bSEY5nzzULMNnKTdV6EGnXHO0MBgQKSQbcs0Lu4OB",
    iconStyle: {
      backgroundPosition: "0px -599px",
    },
  },
  {
    id: 2,
    href: "/friends/requests",
    title: "Friend Requests",
    iconUrl:
      "https://static.xx.fbcdn.net/rsrc.php/v4/yt/r/JcQnQT0QXfn.png?_nc_eui2=AeGNg1RHkSMYUkSQ9jGUQjHzOBrCl4JOmtI4GsKXgk6a0oK0W8p-gEMXmfhRh6fTXauBaKol6rDnDkmUZPhkVmXH",
    iconStyle: {
      backgroundPosition: "-42px -289px",
    },
  },
  {
    id: 3,
    href: "/friends/suggestions",
    title: "Suggestions",
    iconUrl:
      "https://static.xx.fbcdn.net/rsrc.php/v4/yX/r/pNxtRF6mNpj.png?_nc_eui2=AeHbDX5fxq1nNPOPav19rbIW9-UnkTg4BUr35SeRODgFSpX92XeJmkOrFLi6oD6eD_GyPQyJslI_-_bqjfaNHDRXs",
    iconStyle: {
      backgroundPosition: "0px -84px",
    },
  },
  {
    id: 4,
    href: "/friends/list",
    title: "All Friends",
    iconUrl:
      "https://static.xx.fbcdn.net/rsrc.php/v4/yX/r/pNxtRF6mNpj.png?_nc_eui2=AeHbDX5fxq1nNPOPav19rbIW9-UnkTg4BUr35SeRODgFSpX92XeJmkOrFLi6oD6eD_GyPQyJslI_-_bqjfaNHDRXs",
    iconStyle: {
      backgroundPosition: "0px -105px",
    },
  },
  {
    id: 5,
    href: "/friends/birthdays",
    title: "Birthdays",
    iconUrl:
      "https://static.xx.fbcdn.net/rsrc.php/v4/yl/r/5A55yCVIY41.png?_nc_eui2=AeEj1lcOUAOwjuU_oshpe5rPiFEte0-_dU-IUS17T791T9OMNAD6j2tsNnHb1wZ6sMF0THRJrvWw1e44k-8HvWiv",
    iconStyle: {
      backgroundPosition: "0px -92px",
    },
  },
];

const NavLink: React.FC<Props> = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col p-3">
      {navList.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded hover:bg-shade",
            pathname === item.href && "bg-shade"
          )}
        >
          <div
            className={cn(
              "bg-muted rounded-full aspect-square size-9 flex justify-center items-center",
              pathname === item.href && "bg-primary text-white"
            )}
          >
            <i
              style={{
                backgroundImage: `url(${item.iconUrl})`,
                backgroundSize: "auto",
                width: 20,
                height: 20,
                backgroundRepeat: "no-repeat",
                display: "inline-block",
                color: "green",
                filter: `invert(${pathname === item.href ? 1 : 0})`,
                ...item.iconStyle,
              }}
            />
          </div>
          <h1 className="font-semibold text-xl py-2">{item.title}</h1>
        </Link>
      ))}
    </div>
  );
};

export default NavLink;
