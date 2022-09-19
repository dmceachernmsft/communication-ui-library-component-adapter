import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    FluentThemeProvider,
    DEFAULT_COMPONENT_ICONS,
    CallClientProvider,
    CallAgentProvider,
    CallProvider,
    createStatefulCallClient,
    StatefulCallClient
} from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import CallingComponents from './ui-components/CallingComponents';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';

export interface ReactComponentsProps {
    userId: string;
    displayName: string;
    token: string;
    groupId: string;
}

export const ReactComponents = (props: ReactComponentsProps): JSX.Element => {
    const { userId, displayName, token, groupId } = props;
    registerIcons({ icons: DEFAULT_COMPONENT_ICONS });


    const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>()
    const [callAgent, setCallAgent] = useState<CallAgent>()
    const [call, setCall] = useState<Call>()

    useEffect(() => {
        setStatefulCallClient(createStatefulCallClient({
            userId: { communicationUserId: userId }
        }));
    }, [userId])

    useEffect(() => {
        const tokenCredential = new AzureCommunicationTokenCredential(token);
        if (callAgent === undefined && statefulCallClient) {
            const createUserAgent = async () => {
                setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }))
            }
            createUserAgent();
        }
    }, [callAgent, displayName, statefulCallClient, token])

    useEffect(() => {
        if (callAgent !== undefined) {
            setCall(callAgent.join({ groupId }))
        }
    }, [callAgent, groupId])

    return (
        <>
            <FluentThemeProvider>
                {statefulCallClient && <CallClientProvider callClient={statefulCallClient}>
                    {callAgent && <CallAgentProvider callAgent={callAgent}>
                        {call && <CallProvider call={call}>
                            <CallingComponents />
                        </CallProvider>}
                    </CallAgentProvider>}
                </CallClientProvider>}
            </FluentThemeProvider>
        </>
    );
}
