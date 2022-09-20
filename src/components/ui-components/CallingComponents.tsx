import { usePropsFor, VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, useCall, usePropsForComposite } from '@azure/communication-react';
import { mergeStyles, Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';

function CallingComponents(): JSX.Element {

    const videoGalleryCompositeProps = usePropsForComposite(VideoGallery);

    const videoGalleryProps = usePropsFor(VideoGallery);
    const cameraProps = usePropsFor(CameraButton);
    const microphoneProps = usePropsFor(MicrophoneButton);
    const screenShareProps = usePropsFor(ScreenShareButton);
    const endCallProps = usePropsFor(EndCallButton);

    const [callEnded, setCallEnded] = useState(false);

    const call = useCall();

    const onHangup = useCallback(async (): Promise<void> => {
        await endCallProps.onHangUp();
        setCallEnded(true);
    }, [endCallProps]);

    if (callEnded) {
        return <CallEnded />;
    }

    return (
        <Stack className={mergeStyles({ height: '30rem' })}>
            <div style={{ width: '100vw', height: '100vh' }}>
                {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
            </div>

            <ControlBar layout='floatingBottom'>
                {cameraProps && <CameraButton {...cameraProps} disabled={call ? false : true} />}
                {microphoneProps && <MicrophoneButton   {...microphoneProps} disabled={call ? false : true} />}
                {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
                {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
            </ControlBar>
        </Stack>
    );
}

function CallEnded(): JSX.Element {
    return <h1>You ended the call.</h1>;
}

export default CallingComponents;