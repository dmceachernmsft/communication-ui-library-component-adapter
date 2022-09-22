import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { VideoGallery, ControlBar, CameraButton, MicrophoneButton, ScreenShareButton, EndCallButton, usePropsForComposite, useAdapter, CallCompositePage, CallAdapterState, VideoTile, StreamMedia } from '@azure/communication-react';
import { Dropdown, IDropdownOption, Label, mergeStyles, PrimaryButton, Stack } from '@fluentui/react';
import { useCallback, useEffect, useState } from 'react';

function CallingComponents(): JSX.Element {
    const adapter = useAdapter();

    const [page, setPage] = useState<CallCompositePage>(adapter.getState().page);

    const [localCameraOn, setLocalCameraOn] = useState<boolean>(false);

    useEffect(() => {
        adapter.onStateChange((state: CallAdapterState) => {
            setPage(state.page);
        });
    }, [adapter]);

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
        return (<Configuration setLocalCameraOn={(state: boolean) => setLocalCameraOn(state)} localCameraOn={localCameraOn}/>);
    }

    
    return (<CallScreen localCameraOn={localCameraOn}/>);
}

function Configuration(props: {setLocalCameraOn: (state: boolean) => void, localCameraOn: boolean}): JSX.Element {
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const adapter = useAdapter();
    const devices = adapter.getState().devices;
    const localView = adapter.getState().devices.unparentedViews
    
    const [micChecked, setMicChecked] = useState<boolean>(false);

    const startCallHandler = () => {
        adapter.joinCall();
    }
    console.log(cameraProps);
    useEffect(() => {
        adapter.onStateChange((state: CallAdapterState) => {
            setMicChecked(state.isLocalPreviewMicrophoneEnabled);
        })
    })

    const onToggleMic = useCallback(async () => {
        adapter.getState().isLocalPreviewMicrophoneEnabled ? adapter.mute() : adapter.unmute();
    }, [adapter]);

    return (
        <Stack styles={{ root: { margin: 'auto' } }}>
            <h2>Start a call</h2>
            <Label>Configure your devices</Label>
            <Stack horizontal>
                <Stack styles={{ root: { width: '30rem', height: '30rem', padding: '2rem' } }}>
                    <div className={mergeStyles({ height: '100vh' })}>
                        <VideoTile
                            renderElement={localView.length > 0 ? (
                                <StreamMedia videoStreamElement={
                                    // this is something that should be better documented in the adapter line 35 as well
                                    localView.length > 0 && localView[0].view ?
                                        localView[0].view.target : null} />) : undefined
                            }
                            onRenderPlaceholder={() => {
                                return (
                                    <Label styles={{ root: { margin: 'auto' } }}>Your video is off</Label>
                                )
                            }}
                        />
                    </div>
                    <ControlBar layout='floatingTop' >
                        <MicrophoneButton
                            {...microphoneProps}
                            disabled={!devices.deviceAccess?.audio}
                            onToggleMicrophone={onToggleMic}
                            checked={micChecked}
                            showLabel={true}

                        />
                        <CameraButton
                            {...cameraProps}
                            showLabel={true}
                            onToggleCamera={async () => {
                                await cameraProps.onToggleCamera();
                                props.setLocalCameraOn(!props.localCameraOn);
                            }}
                        />
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
                    <PrimaryButton styles={{ root: { width: '12rem', marginTop: '2rem' } }} onClick={startCallHandler}>Start Call</PrimaryButton>
                </Stack>
            </Stack>
        </Stack>
    )
}

function CallScreen(props: {localCameraOn: boolean}): JSX.Element {
    const adapter = useAdapter();
    const videoGalleryProps = usePropsForComposite(VideoGallery);
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const screenShareProps = usePropsForComposite(ScreenShareButton);
    if(props.localCameraOn){
        adapter.startCamera({scalingMode: 'Crop'});
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

export default CallingComponents;