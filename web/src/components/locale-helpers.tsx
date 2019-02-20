import * as React from 'react';
import { connect } from 'react-redux';
import { Link, LinkProps, NavLink, NavLinkProps } from 'react-router-dom';
import { Locale } from '../stores/locale';
import StateTree from '../stores/tree';
import { isProduction } from '../utility';
import { Localized } from 'fluent-react/compat';

export const contributableLocales = require('../../../locales/contributable.json');

export interface LocalePropsFromState {
  locale: Locale.State;
  toLocaleRoute: (path: any) => string;
}

interface LocaleProps extends LocalePropsFromState {
  dispatch: any;
}

export const toLocaleRouteBuilder = (locale: string) => (path: string) =>
  `/${locale}${path}`;

export const localeConnector: any = connect<LocalePropsFromState>(
  ({ locale }: StateTree) => ({
    locale,
    toLocaleRoute: toLocaleRouteBuilder(locale),
  }),
  null,
  null,
  { pure: false }
);

export const LocaleLink = localeConnector(
  ({
    blank = false,
    dispatch,
    locale,
    to,
    toLocaleRoute,
    ...props
  }: { blank?: boolean } & LinkProps & LocaleProps) =>
    blank ? (
      <a
        href={toLocaleRoute(to)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ) : (
      <Link to={toLocaleRoute(to)} {...props} />
    )
);

export const LocaleNavLink = localeConnector(
  ({
    dispatch,
    locale,
    to,
    toLocaleRoute,
    ...props
  }: NavLinkProps & LocaleProps) => (
    <NavLink to={toLocaleRoute(to)} {...props} />
  )
);

export function isContributable(locale: string) {
  return contributableLocales.includes(locale);
}

export const ContributableLocaleLock = localeConnector(
  ({
    children,
    locale,
    render,
  }: LocaleProps & {
    children?: any;
    render?: (args: { isContributable: boolean }) => React.ReactNode;
  }) => {
    return render
      ? render({ isContributable: isContributable(locale) })
      : isContributable(locale) && children;
  }
);

const GetAttribute = (args: any) => args.fn(args[args.attribute]);

export const LocalizedGetAttribute = ({
  id,
  attribute,
  children,
}: {
  id: string;
  attribute: string;
  children: (value: string) => React.ReactElement<any>;
}) => (
  <Localized id={id} attrs={{ [attribute]: true }}>
    <GetAttribute attribute={attribute} fn={children} />
  </Localized>
);
