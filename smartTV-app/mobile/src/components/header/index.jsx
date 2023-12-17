import React from 'react';
import Header01 from './Header01';
import Header02 from './Header02';
import Header03 from './header03';

export default function Header({ screen01, screen02, screen03 }) {
  if (screen01) return <Header01 />;
  if (screen02) return <Header02 />;
  if (screen03) return <Header03 />;
}
