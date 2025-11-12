import type { RouteType } from "@/app/interface/index";

export type MenuItemType = {
    key: string;
    label: string;
    isTitle?: boolean;
    icon?: string;
    route?: RouteType;
    url?: string;
    badge?: {
        variant: string;
        text: string;
    };
    parentKey?: string;
    target?: string;
    disabled?: boolean;
    children?: MenuItemType[];
};

export type SubMenus = {
    item: MenuItemType;
    linkClassName?: string;
    subMenuClassName?: string;
    className?: string;
};
