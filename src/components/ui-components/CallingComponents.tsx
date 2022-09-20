import { VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, usePropsForComposite, useAdapter, CallCompositePage, CallAdapterState, VideoTile } from '@azure/communication-react';
import { mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

function CallingComponents(): JSX.Element {
    const adapter = useAdapter();

    const videoGalleryProps = usePropsForComposite(VideoGallery);
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const screenShareProps = usePropsForComposite(ScreenShareButton);

    const [page, setPage] = useState<CallCompositePage>(adapter.getState().page);

    useEffect(() => {
        adapter.onStateChange((state: CallAdapterState) => {
            setPage(state.page);
        });
    }, []);

    if (page === 'leftCall') {
        const rejoinCallHandler = () => {
            adapter.joinCall();
        }
        return (
            <Stack styles={{ root: { margin: 'auto' } }}>
                <h1>You ended the call.</h1>
                <PrimaryButton styles={{ root: { width: '12rem' } }} onClick={rejoinCallHandler}>Rejoin Call</PrimaryButton>
            </Stack>);
    }

    if (page === 'configuration') {
        const startCallHandler = () => {
            adapter.joinCall();
        }
        return (
            <Stack styles={{ root: { margin: 'auto' } }}>
                <VideoTile />
                <ControlBar>
                    <MicrophoneButton {...microphoneProps} />
                    <CameraButton {...cameraProps} />
                </ControlBar>
                <PrimaryButton styles={{ root: { width: '12rem' } }} onClick={startCallHandler}>Start Call</PrimaryButton>
            </Stack>
        )
    }

    return (
        <Stack className={mergeStyles({ height: '30rem' })}>
            <div style={{ width: '100vw', height: '100vh' }}>
                {videoGalleryProps && <VideoGallery {...videoGalleryProps} layout={'floatingLocalVideo'} />}
            </div>

            <ControlBar layout='floatingBottom'>
                {cameraProps && <CameraButton {...cameraProps} />}
                {microphoneProps && <MicrophoneButton   {...microphoneProps} />}
                {screenShareProps && <ScreenShareButton  {...screenShareProps} />}
                {<EndCallButton onHangUp={() => adapter.leaveCall()} />}
            </ControlBar>
        </Stack>
    );
}

export default CallingComponents;