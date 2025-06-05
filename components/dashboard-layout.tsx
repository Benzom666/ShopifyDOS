"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import { Settings, LogOut, Package } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center gap-4 border-b bg-card px-6 lg:px-8">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <span>DeliveryOS</span>
          </div>

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
