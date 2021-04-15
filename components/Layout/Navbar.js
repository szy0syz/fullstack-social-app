import React from 'react';
import { Menu, Container, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Navbar() {
  const router = useRouter();

  const isActive = route => router.pathname === route;

  return (
    <Menu fluid borderless>
      <Container>
      <Link href="/">
          <Menu.Item active={isActive('/')}>
            <Icon size="large" name="home" />
            Home
          </Menu.Item>
        </Link>
        <Link href="/signin">
          <Menu.Item active={isActive('/signin')}>
            <Icon size="large" name="sign in" />
            Sign in
          </Menu.Item>
        </Link>
        <Link href="/signup" >
          <Menu.Item active={isActive('/signup')}>
            <Icon size="large" name="signup" />
            Sign up
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
}

export default Navbar;
