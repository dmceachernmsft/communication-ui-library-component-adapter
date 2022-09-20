import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    FluentThemeProvider,
    DEFAULT_COMPONENT_ICONS,
    CallClientProvider,
    CallAgentProvider,
    CallProvider,
    createStatefulCallClient,
    StatefulCallClient,
    CallAdapter,
    createAzureCommunicationCallAdapter
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';
import CallingComponents from './ui-components/CallingComponents';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';
import { CallAdapterProvider } from '../adapter/CallAdapterProvider';

export interface ReactComponentsProps {
    userId: string;
    displayName: string;
    token: string;
    groupId: string;
}

export const ReactComponents = (props: ReactComponentsProps): JSX.Element => {
    const { userId, displayName, token, groupId } = props;
    registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

    const [adapter, setAdapter] = useState<CallAdapter>();

    // We can't even initialize the Chat and Call adapters without a well-formed token.
    const credential = useMemo(() => {
        try {
            return new AzureCommunicationTokenCredential(token);
        } catch {
            console.error('Failed to construct token credential');
            return undefined;
        }
    }, [token]);

    useEffect(() => {
        const createAdapter = async (): Promise<void> => {
            !!credential && setAdapter(
                await createAzureCommunicationCallAdapter({
                    userId: { communicationUserId: userId },
                    displayName,
                    credential,
                    locator: { groupId }
                })
            );
        };

        createAdapter();
    }, [credential, displayName, groupId, userId]);

    // const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>()
    // const [callAgent, setCallAgent] = useState<CallAgent>()
    // const [call, setCall] = useState<Call>()

    // useEffect(() => {
    //     setStatefulCallClient(createStatefulCallClient({
    //         userId: { communicationUserId: userId }
    //     }));
    // }, [userId])

    // useEffect(() => {
    //     const tokenCredential = new AzureCommunicationTokenCredential(token);
    //     if (callAgent === undefined && statefulCallClient) {
    //         const createUserAgent = async () => {
    //             setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }))
    //         }
    //         createUserAgent();
    //     }
    // }, [callAgent, displayName, statefulCallClient, token])

    // useEffect(() => {
    //     if (callAgent !== undefined) {
    //         setCall(callAgent.join({ groupId }))
    //     }
    // }, [callAgent, groupId])

    adapter?.joinCall();
    return (
        <>
            <FluentThemeProvider>
                {/* {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
                    {callAgent && <CallAgentProvider callAgent={callAgent}>
                        {call && <CallProvider call={call}>
                            <CallingComponents />
                        </CallProvider>}
                    </CallAgentProvider>}
                </CallClientProvider>} */}
                {adapter && (<CallAdapterProvider adapter={adapter}>
                    <CallingComponents />
                </CallAdapterProvider>)}
            </FluentThemeProvider>

        </>
    );
}
