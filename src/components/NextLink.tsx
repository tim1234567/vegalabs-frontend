import React from 'react';
import Link, { LinkProps } from 'next/link';

type NextLinkProps = LinkProps & React.ComponentProps<'a'>;

export const NextLink = React.forwardRef<HTMLAnchorElement, NextLinkProps>((props, ref) => {
  const { href, replace, as, scroll, passHref, shallow, prefetch, children, ...rest } = props;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      replace={replace}
      as={as}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
    >
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});
