"use client"
import React, { useContext, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import { AuthContext } from "@/context/auth/context";
import { Logout } from "@/app/actions";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const CustomNavbar = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return null;
  }
  const { role } = context;
  console.log(role, "navbar");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const menuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Activity", href: "/activity" },
    { label: "Analytics", href: "/analytics" },
    { label: "System", href: "/system" },
    { label: "Deployments", href: "/deployments" },
    { label: "My Settings", href: "/settings" },
    { label: "Team Settings", href: "/team-settings" },
    { label: "Help & Feedback", href: "/help" },
    { label: "Log Out", href: "#", onClick: Logout }
  ];

  const adminMenuItems = [
    { label: "Admin", href: "/admin" },
    { label: "Application", href: "/admin/application" },
    { label: "Meta", href: "/admin/meta" },
    { label: "Verification List", href: "/admin/phasewise" },
    { label: "Applicants", href: "/admin/applicants" },
  ];

  const renderMenuItems = (items) =>
    items.map((item, index) => (
      <NavbarItem key={index}>
        <NextLink href={item.href} passHref>
          <Link color="foreground" onClick={item.onClick}>
            {item.label}
          </Link>
        </NextLink>
      </NavbarItem>
    ));

  const renderDropdownItems = (items) =>
    items.map((item, index) => (
      <NavbarMenuItem key={index}>
        <NextLink href={item.href} passHref>
          <Link color="foreground" onClick={item.onClick}>
            {item.label}
          </Link>
        </NextLink>
      </NavbarMenuItem>
    ));

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
        {/* <NavbarBrand>
          <NextLink href="/" passHref>
            <Link>
              <AcmeLogo />
              <span className="font-bold text-inherit">ACME</span>
            </Link>
          </NextLink>
        </NavbarBrand> */}
      </NavbarContent>

      <NavbarContent justify="center" className="hidden lg:flex gap-4">
        {role === "APPLICANT" && renderMenuItems(menuItems.slice(0, 3))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!role && (
          <>
            <NavbarItem className="hidden lg:flex">
              <NextLink href="/login" passHref>
                <Link>Login</Link>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} href="/signup" color="warning" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        ) 
        }
      </NavbarContent>

      <NavbarMenu>
        {role === "APPLICANT" && renderDropdownItems(menuItems)}
        {role === "ADMIN" && renderDropdownItems(adminMenuItems)}
      </NavbarMenu>

      {isLargeScreen && (
        <NavbarContent className="hidden lg:flex gap-4" justify="center">
          {role === "APPLICANT" && renderMenuItems(menuItems)}
          {role === "ADMIN" && renderMenuItems(adminMenuItems)}
        </NavbarContent>
      )}
            {role && <NavbarItem>
            <Button onClick={Logout} color="warning" variant="flat">
              Logout
            </Button>
          </NavbarItem>}

    </Navbar>
  );
};
