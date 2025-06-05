"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, Home, Package, Users, Settings, LogOut, BarChart3, UserCheck, Mail, User, Scan } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getNavigationItems = () => {
    if (!profile) return []

    const baseItems = [
      {
        name: "Dashboard",
        href:
          profile.role === "super_admin"
            ? "/super-admin"
            : profile.role === "admin"
              ? "/admin/dashboard"
              : "/driver/home",
        icon: Home,
      },
    ]

    if (profile.role === "super_admin") {
      return [
        ...baseItems,
        { name: "Admins", href: "/super-admin/admins", icon: UserCheck },
        { name: "All Drivers", href: "/super-admin/drivers", icon: Users },
        { name: "System Stats", href: "/super-admin/stats", icon: BarChart3 },
      ]
    }

    if (profile.role === "admin") {
      return [
        ...baseItems,
        { name: "Orders", href: "/admin/orders", icon: Package },
        { name: "Drivers", href: "/admin/drivers", icon: Users },
      ]
    }

    if (profile.role === "driver") {
      return [
        ...baseItems,
        { name: "Orders", href: "/driver/orders", icon: Package },
        { name: "QR Scanner", href: "/driver/scanner", icon: Scan },
        { name: "Invitations", href: "/driver/invitations", icon: Mail },
        { name: "Profile", href: "/driver/profile", icon: User },
      ]
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex h-full flex-col ${mobile ? "w-full" : "w-72"}`}>
      <div className="flex h-20 items-center border-b px-6">
        <Link
          className="flex items-center gap-3 font-bold text-xl"
          href={
            profile?.role === "super_admin"
              ? "/super-admin"
              : profile?.role === "admin"
                ? "/admin/dashboard"
                : "/driver/orders"
          }
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <span>DeliveryOS</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-6">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium transition-all hover:bg-accent ${
                isActive ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile in Sidebar */}
      {profile && (
        <div className="border-t p-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{profile.role.replace("_", " ")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-card lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center gap-4 border-b bg-card px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden h-10 w-10"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <NotificationsDropdown />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-base font-semibold leading-none">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm leading-none text-muted-foreground">{profile.email}</p>
                    <p className="text-xs leading-none text-muted-foreground capitalize bg-muted px-2 py-1 rounded-md w-fit">
                      {profile.role.replace("_", " ")}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(profile.role === "driver" ? "/driver/profile" : "/profile")}
                  className="py-3"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="py-3 text-destructive focus:text-destructive">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8 lg:px-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
