import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps{
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }:ActiveLinkProps) {

  const { asPath } = useRouter();

  const isInsideAPost = asPath.toString().split("/")[1] === rest.href.toString().split("/")[1]

  const className = asPath === rest.href || isInsideAPost
   ? activeClassName
   : '';

  return(
    <Link {...rest}>
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}