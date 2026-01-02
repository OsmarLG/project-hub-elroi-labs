"use client"

import * as React from "react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { resolveUrl } from "@/lib/utils"
import { type NavItem } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import { ChevronRight } from "lucide-react"

function isGroup(item: NavItem): item is Extract<NavItem, { children: NavItem[] }> {
  return "children" in item
}

export function NavAdmin({ items = [] }: { items: NavItem[] }) {
  const page = usePage()

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          // ✅ GROUP (con children)
          if (isGroup(item)) {
            const hasActiveChild = item.children.some((child) => {
              if ("children" in child) return false
              return page.url.startsWith(resolveUrl(child.href))
            })

            return (
              <Collapsible key={item.title} defaultOpen={hasActiveChild}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={{ children: item.title }} isActive={hasActiveChild}>
                      {item.icon && <item.icon />}
                      <span className="truncate">{item.title}</span>
                      <ChevronRight className="ml-auto size-4 transition-transform data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="transition-all duration-200 ease-in-out">
                    <SidebarMenuSub>
                      {item.children.map((child) => {
                        if ("children" in child) return null
                        const active = page.url.startsWith(resolveUrl(child.href))

                        return (
                          <SidebarMenuSubItem key={child.title}>
                            <SidebarMenuSubButton asChild isActive={active}>
                              <Link href={child.href} prefetch>
                                {child.icon && <child.icon />}
                                <span className="truncate">{child.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // ✅ LINK normal
          const active = page.url.startsWith(resolveUrl(item.href))

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={active} tooltip={{ children: item.title }}>
                <Link href={item.href} prefetch>
                  {item.icon && <item.icon />}
                  <span className="truncate">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
