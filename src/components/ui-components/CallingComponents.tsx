import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, usePropsForComposite, useAdapter, CallCompositePage, CallAdapterState, VideoTile, CallAdapter, DevicesButton } from '@azure/communication-react';
import { Dropdown, IDropdownOption, Label, mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
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
        const devices = getDevices(adapter);
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
                <Stack styles={{ root: { width: '13rem', padding: '1rem' } }}>
                    <Stack>
                        <Label>Select your camera</Label>
                        <Dropdown options={getDropDownList(devices.cameras)}></Dropdown>
                    </Stack>
                    <Stack>
                        <Label>Select your microphone</Label>
                        <Dropdown options={getDropDownList(devices.microphones)}></Dropdown>
                    </Stack>
                    <Stack>
                        <Label>Select your speaker</Label>
                        <Dropdown options={getDropDownList(devices.speakers)}></Dropdown>
                    </Stack>
                </Stack>
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

const getDevices = (adapter: CallAdapter): { cameras: VideoDeviceInfo[], microphones: AudioDeviceInfo[], speakers: AudioDeviceInfo[] } => {
    return {
        cameras: adapter.getState().devices.cameras,
        microphones: adapter.getState().devices.microphones,
        speakers: adapter.getState().devices.speakers
    }
}

const getDropDownList = (list: Array<VideoDeviceInfo | AudioDeviceInfo>): IDropdownOption[] => {
    const dropdownList: IDropdownOption[] = [];
    const removeDuplicates = new Map<string, VideoDeviceInfo | AudioDeviceInfo>();
    for (const device of list) {
        removeDuplicates.set(device.id, device);
    }

    for (const device of removeDuplicates.values()) {
        dropdownList.push({
            key: device.id,
            text: device.name === '' ? device.deviceType : device.name
        })
    }

    return dropdownList;
}
