import React from 'react';
import { Button } from '@chakra-ui/core'

import './AccountBox.css';

function AccountBox(props) {
    if (props.authenticated) {
      return (
        <div className="AccountBox">
          <Button variantColor="teal" onClick={() => props.keycloak.logout()}>Logout</Button>
          <Button variantColor="teal" onClick={() => props.keycloak.accountManagement()}>Account</Button>
        </div>
        );
    }
    return (
      <div className="AccountBox">
        <Button variantColor="teal" onClick={() => props.keycloak.login()}>Login</Button>
      </div>
      );
  }

  export default AccountBox;