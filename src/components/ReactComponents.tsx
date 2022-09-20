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
import { mergeStyles, registerIcons, Stack } from '@fluentui/react';


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

    if (!!adapter) {
        adapter.askDevicePermission({ video: true, audio: true });
        adapter.queryCameras();
        adapter.queryMicrophones();
        adapter.querySpeakers();
        return (
            <>
                <FluentThemeProvider>
                    {adapter && (<CallAdapterProvider adapter={adapter}>
                        <Stack className={mergeStyles({ margin: 'auto' })}><CallingComponents /></Stack>
                    </CallAdapterProvider>)}
                </FluentThemeProvider>

            </>
        );
    } else {
        return (<h3>Initializing</h3>)
    }

}
