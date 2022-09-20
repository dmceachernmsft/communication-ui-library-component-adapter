import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCall, usePropsForComposite, useAdapter } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';

function CallingComponents(): JSX.Element {
    const adapter = useAdapter();
    console.log(adapter);

    const videoGalleryProps = usePropsForComposite(VideoGallery);
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const screenShareProps = usePropsForComposite(ScreenShareButton);

    const [callEnded, setCallEnded] = useState(false);

    const onHangup = useCallback(async (): Promise<void> => {
        await adapter.leaveCall();
        setCallEnded(true);
    }, []);

    if (callEnded) {
        return <CallEnded />;
    }

    return (
        <Stack className={mergeStyles({ height: '30rem' })}>
            <div style={{ width: '100vw', height: '100vh' }}>
                {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
            </div>

            <ControlBar layout='floatingBottom'>
                {cameraProps && <CameraButton {...cameraProps} />}
                {microphoneProps && <MicrophoneButton   {...microphoneProps} />}
                {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
                {<EndCallButton onHangUp={onHangup} />}
            </ControlBar>
        </Stack>
    );
}

function CallEnded(): JSX.Element {
    return <h1>You ended the call.</h1>;
}

export default CallingComponents;