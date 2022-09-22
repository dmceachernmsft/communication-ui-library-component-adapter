import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    CallComposite,
    CallAdapter,
    createAzureCommunicationCallAdapter,
} from '@azure/communication-react';
import { useEffect, useMemo, useState } from 'react';

export interface ReactCompositeProps {
    userId: string;
    displayName: string;
    token: string;
    groupId: string
}

export const ReactComposites = (props: ReactCompositeProps): JSX.Element => {
    const { userId, displayName, token, groupId } = props;

    const [callAdapter, setCallAdapter] = useState<CallAdapter>();

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
            setCallAdapter(
                await createAzureCommunicationCallAdapter({
                    userId: { communicationUserId: userId },
                    displayName,
                    credential: new AzureCommunicationTokenCredential(token),
                    locator: { groupId }
                })
            );
        };
        createAdapter();
    }, [displayName, groupId, token, userId]);

    if (!!callAdapter) {

        return (
            <>
                <div style={containerStyle}>
                    <CallComposite adapter={callAdapter} />
                </div>
            </>
        );
    }
    if (credential === undefined) {
        return <h3>Failed to construct credential. Provided token is malformed.</h3>;
    }
    return <h3>Initializing...</h3>;
}

const containerStyle = {
    height: '30rem',
};
