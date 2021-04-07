import React from 'react';
import baseUrl from '../utilsClient/baseUrl';
import axios from 'axios';
import {
  HeaderMessage,
  FooterMessage,
} from '../components/Common/WelcomeMessage';

function Signin() {
  return (
    <>
      <HeaderMessage />
      <FooterMessage />
    </>
  );
}

export default Signin;
