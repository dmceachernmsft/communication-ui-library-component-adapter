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
        const devices = adapter.getState().devices;
        const startCallHandler = () => {
            adapter.joinCall();
        }
        return (
            <Stack styles={{ root: { margin: 'auto' } }}>
                <h2>Configuration</h2>
                <Stack horizontal>
                    <Stack>
                        <VideoTile />
                        <ControlBar>
                            <MicrophoneButton {...microphoneProps} />
                            <CameraButton {...cameraProps} />
                        </ControlBar>
                    </Stack>
                    <Stack styles={{ root: { width: '13rem', padding: '1rem', margin: 'auto' } }}>
                        <Stack styles={{ root: { padding: '0.5rem' } }}>
                            <Label>Select your camera</Label>
                            <Dropdown
                                defaultSelectedKey={devices.selectedCamera?.id}
                                options={getDropDownList(devices.cameras)}
                                onChange={(event, option, index) => {
                                    adapter.setCamera(devices.cameras[index ?? 0])
                                }}
                            ></Dropdown>
                        </Stack>
                        <Stack styles={{ root: { padding: '0.5rem' } }}>
                            <Label>Select your microphone</Label>
                            <Dropdown
                                defaultSelectedKey={devices.selectedMicrophone?.id}
                                options={getDropDownList(devices.microphones)}
                                onChange={(event, option, index) => {
                                    adapter.setMicrophone(devices.microphones[index ?? 0])
                                }}
                            ></Dropdown>
                        </Stack>
                        <Stack styles={{ root: { padding: '0.5rem' } }}>
                            <Label>Select your speaker</Label>
                            <Dropdown
                                defaultSelectedKey={devices.selectedSpeaker?.id}
                                options={getDropDownList(devices.speakers)}
                                onChange={(event, option, index) => {
                                    adapter.setSpeaker(devices.speakers[index ?? 0])
                                }}
                            ></Dropdown>
                        </Stack>
                        <PrimaryButton styles={{ root: { width: '12rem' } }} onClick={startCallHandler}>Start Call</PrimaryButton>
                    </Stack>
                </Stack>
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
