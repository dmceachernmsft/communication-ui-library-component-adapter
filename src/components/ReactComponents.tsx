import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    FluentThemeProvider,
    DEFAULT_COMPONENT_ICONS,
    CallAdapter,
    createAzureCommunicationCallAdapter,
    CallAdapterProvider
} from '@azure/communication-react';
import React, { useEffect, useMemo, useState } from 'react';
import CallingComponents from './ui-components/CallingComponents';
import { registerIcons, Stack } from '@fluentui/react';
import { ChevronDown16Regular } from '@fluentui/react-icons';


export interface ReactComponentsProps {
    userId: string;
    displayName: string;
    token: string;
    groupId: string;
}

export const ReactComponents = (props: ReactComponentsProps): JSX.Element => {
    const { userId, displayName, token, groupId } = props;
    registerIcons({ icons: {...DEFAULT_COMPONENT_ICONS, ChevronDown: <ChevronDown16Regular/>}});

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
    console.log('groupId: ' + groupId);

    if (!!adapter) {
        adapter.askDevicePermission({ video: true, audio: true });
        adapter.queryCameras();
        adapter.queryMicrophones();
        adapter.querySpeakers();
        return (
            <>
                <FluentThemeProvider>
                    {adapter && (<CallAdapterProvider adapter={adapter}>
                        <Stack horizontal styles={{ root: { margin: 'auto', height: '70%', width: '70%' } }}><CallingComponents /></Stack>
                    </CallAdapterProvider>)}
                </FluentThemeProvider>

            </>
        );
    } else {
        return (<h3>Initializing</h3>)
    }

}
