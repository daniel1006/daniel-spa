import React, { useState } from "react";
import { Button, Link } from '@chakra-ui/core'
import { ThemeProvider, theme, CSSReset } from "@chakra-ui/core";
import Keycloak from "keycloak-js";

import AccountBox from './AccountBox';
import MessageBox from './MessageBox';

import './App.css';

let keycloak = new Keycloak({url: 'https://login.t2data.com/auth/', realm: 'kramfors', clientId: 'spa'});
var serviceUrl = 'https://lb.t2data.com/simple/v1'

function App() {
  const [authenticated, authenticate] = useState(false);
  const [response, setResponse] = useState('');
  const [error, hasError] = useState(false);
  
// is .init just a function or does it initialize 'check-sso'?
// is Iframe detecting a sign in status through the Keycloak Login page ?  
  keycloak.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 }).then(() => { 
    if (keycloak.authenticated) {
      authenticate(true);
    } else {
      authenticate(false);
    }
  });

  // is onAuthLogout an event that verifies when the user no longer has a status cookie/loged out ?
  keycloak.onAuthLogout = () => authenticate(false);

  const request = (endpoint) => {// Don't know what this is trying to do
    const options = {//
      method: 'GET'//
    }

    if (keycloak.authenticated) {
      options.headers = {Authorization: `Bearer ${keycloak.token}`};
    }
    const url = `${serviceUrl}/${endpoint}`;
    console.log({url})
    console.log({options})
    fetch(url, options).then((response) => {
      if (response.status === 200) {  
        response.text().then((text) => {
          setResponse('Message: ' + text);
        });
        hasError(false);
      } else if (response.status === 0) {
        setResponse('Request failed');
        hasError(true);
      } else {
        setResponse(response.status + ' ' + response.statusText);
        hasError(true);
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CSSReset/>
      <div className="App">
        <Link href="https://lb.t2data.com/simple/v1/ui">Backend</Link>
        <Link href="https://login.microsoftonline.com/logout.srf">Azure logout</Link>
        <div className="Content">
          <AccountBox authenticated={authenticated} keycloak={keycloak}/>
          <div className="Box">
            <Button variantColor="teal" onClick={() => request('public')}>Invoke public</Button>
            <Button variantColor="teal" onClick={() => request('secure')}>Invoke secure</Button>
            <Button variantColor="teal" onClick={() => request('admin')}>Invoke admin</Button>
            <MessageBox message={response} error={error}/>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
