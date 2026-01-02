import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavAdmin } from '@/components/nav-admin';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, KeyRound, LayoutGrid, ShieldCheck, UserCog, Users, Notebook, NotebookText, Shield } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: "Notebook",
        icon: Notebook,
        children: [
            {
                title: "Notes",
                href: "/notes",
                icon: NotebookText,
            },
        ],
    },
]

const adminNavItems: NavItem[] = [
    {
        title: "User Management",
        icon: UserCog,
        children: [
            {
                title: "Users",
                href: "/admin/users",
                icon: Users,
            },
        ],
    },
    {
        title: "Security",
        icon: ShieldCheck,
        children: [
            {
                title: "Roles",
                href: "/admin/roles",
                icon: Shield,
            },
            {
                title: "Permissions",
                href: "/admin/permissions",
                icon: KeyRound,
            },
        ],
    },
]

const footerNavItems: NavItem[] = [

];

const adminFooterNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/OsmarLG/project-hub-elroi-labs',
        icon: Folder,
    },
    {
        title: 'Laravel Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.id === 1;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && (
                    <NavAdmin items={adminNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {isAdmin && (
                    <NavFooter items={adminFooterNavItems} />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
