import React from 'react';

export default function Header(props) {
  return (
    <header className="block row center">
      <div>
        <a href="#/">
          <h1>Shopping Cart</h1>
        </a>
      </div>
      <div>
      <a href="#/signin" className="signin-button">Sign In</a>
      </div>
    </header>
  );
}
