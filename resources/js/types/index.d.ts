import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

/**
 * Un NavItem puede ser:
 * 1) Link: tiene href
 * 2) Group: tiene children (sin href)
 */
export type NavItem =
    | {
        title: string;
        href: NonNullable<InertiaLinkProps['href']>;
        icon?: LucideIcon | null;
        isActive?: boolean;
        children?: never;
    }
    | {
        title: string;
        href?: never;
        icon?: LucideIcon | null;
        isActive?: boolean;
        children: NavItem[];
    };

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
