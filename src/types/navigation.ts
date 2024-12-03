import { HTMLAttributeAnchorTarget } from 'react';

export type MenuRoot = {
  href?: string;
  external?: boolean;
  target?: HTMLAttributeAnchorTarget;
  disabled?: boolean;
  exact?: boolean;
  icon?: React.ReactNode;
  isShow?: boolean;
};

// navigation combo
export type GroupMenuLevel2Type = {
  label: string;
} & MenuRoot;

export type GroupMenuLevel1Type = {
  label: string;
  shortLabel?: string;
  children: GroupMenuLevel2Type[];
  collapsible?: boolean;
  expandRootOnActive?: boolean;
  expandOnActive?: boolean;
  expandedDefault?: boolean;
} & MenuRoot;

export interface NavigationGroupMenu {
  name?: string;
  collapsible?: boolean;
  expandedDefault?: boolean;
  children: GroupMenuLevel1Type[];
}

export interface NavigationComboBarProps {
  groups: NavigationGroupMenu[];
  children?: React.ReactNode;
}

export interface NavigationComboBarRef {}
