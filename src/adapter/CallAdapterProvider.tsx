// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { CallAdapter } from '@azure/communication-react';

type CallProviderProps = {
  children: React.ReactNode;
  adapter: CallAdapter;
};

/**
 * This Context is currently in the repo. By exposing this code we could give contoso
 * access to use the adapter with the component apps they are thinking about creating.
 * 
 * this would give them access to the state of the adapter but we are still missing the hooks
 * that we use to make the buttons in the composite work.. this is why we have two definitions of `usePropsFor` 
 * 
 * for the composites the `usePropsFor` definition uses something called `useAdaptedSelector` that acts on the selectors in the 
 * calling component bindings on behalf of the adapter.
 * 
 * we might be able to do something like this?
 */

const CallAdapterContext = createContext<CallAdapter | undefined>(undefined);

export const CallAdapterProvider = (props: CallProviderProps): JSX.Element => {
  const { adapter } = props;
  return <CallAdapterContext.Provider value={adapter}>{props.children}</CallAdapterContext.Provider>;
};

export const useAdapter = (): CallAdapter => {
  const adapter = useContext(CallAdapterContext);
  if (!adapter) {
    throw new Error('Cannot find adapter please initialize before usage.');
  }
  return adapter;
};
