import React, { useState } from "react";
import { Button, Link } from '@chakra-ui/core'
import { ThemeProvider, theme, CSSReset } from "@chakra-ui/core";
import Keycloak from "keycloak-js";

import AccountBox from './AccountBox';
import MessageBox from './MessageBox';

import './App.css';

//Keycloak Admin Login Page
let keycloak = new Keycloak({url: 'https://login.t2data.com/auth/', realm: 'kramfors', clientId: 'spa'});
//protected Page I Think
var serviceUrl = 'https://lb.t2data.com/simple/v1'

//Custom hooks 1st with Value 2nd with the updateed function that sets the value. 3rd adds React state to function component settin it to the initially state.
function App() {
  const [authenticated, authenticate] = useState(false);
  const [response, setResponse] = useState('');
  const [error, hasError] = useState(false);

  //check-sso calls the init function to authenticate the client if the user is already logged in if not they will be directed to the browser and remained unauthenticated.
  keycloak.init({ onLoad: 'check-sso', checkLoginIframeInterval: 1 }).then(() => { //returns a promise that is used to hook up a handler that will be called when the promise is resloved.
    if (keycloak.authenticated) {
      authenticate(true);
    } else {
      authenticate(false);
    }
  });

  keycloak.onAuthLogout = () => authenticate(false);

  const request = (endpoint) => {
    const options = {
      method: 'GET'
    }

    if (keycloak.authenticated) {
      options.headers = {Authorization: `Bearer ${keycloak.token}`};//Given bearertoken if authenticated
    }
    const url = `${serviceUrl}/${endpoint}`;
    console.log({url})
    console.log({options})
    fetch(url, options).then((response) => {
      if (response.status === 200) {  //success if Authenticated
        response.text().then((text) => {
          setResponse('Message: ' + text);
        });
        hasError(false);
      } else if (response.status === 0) {
        setResponse('Request failed');//error within system
        hasError(true);
      } else {
        setResponse(response.status + ' ' + response.statusText);//failed request
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
