import { ControlBarButtonStyles, ControlBarButtonStrings, ControlBarButton, VideoGallery, ControlBar, CameraButton, MicrophoneButton, EndCallButton, usePropsForComposite, useAdapter, ParticipantList, CallCompositePage, CallAdapterState, VideoTile, StreamMedia } from '@azure/communication-react';
import { Dropdown, IDropdownOption, ITheme, Label, mergeStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import { useCallback, useEffect, useState } from 'react';
import { AudioDeviceInfo, VideoDeviceInfo } from '@azure/communication-calling';
import { CustomParticipantList } from './CustomParticipantList';

import { QuestionCircle20Regular } from '@fluentui/react-icons';

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
        return (<Configuration setLocalCameraOn={(state: boolean) => setLocalCameraOn(state)} localCameraOn={localCameraOn} />);
    }


    return (<CallScreen localCameraOn={localCameraOn} />);
}

function Configuration(props: { setLocalCameraOn: (state: boolean) => void, localCameraOn: boolean }): JSX.Element {
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const adapter = useAdapter();
    const devices = adapter.getState().devices;
    const localView = adapter.getState().devices.unparentedViews

    const [micChecked, setMicChecked] = useState<boolean>(false);

    const startCallHandler = () => {
        adapter.joinCall();
    }

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
                            menuIconProps={{ iconName: 'ChevronDown' }}
                        />
                        <CameraButton
                            {...cameraProps}
                            showLabel={true}
                            onToggleCamera={async () => {
                                await cameraProps.onToggleCamera({ scalingMode: 'Crop' });
                                props.setLocalCameraOn(!props.localCameraOn);
                            }}
                            menuIconProps={{ iconName: 'ChevronDown' }}
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

function CallScreen(props: { localCameraOn: boolean }): JSX.Element {

    const theme = useTheme();
    const adapter = useAdapter();
    const videoGalleryProps = usePropsForComposite(VideoGallery);
    const cameraProps = usePropsForComposite(CameraButton);
    const microphoneProps = usePropsForComposite(MicrophoneButton);
    const participantListProps = usePropsForComposite(ParticipantList)

    const [cameraOn, setCameraOn] = useState<boolean>(props.localCameraOn);
    /**
     * This is to check that the camera was on when the user was performing device configuration. The
     * state of this check comes from the configuration component and is tracked by the parent.
     * 
     * This is done this way to match the same way we currently do it (though much more simple) in the 
     * Calling composite as we do not have a good way to expose video options on the joinCall handler.
     */
    if (cameraOn) {
        adapter.startCamera({ scalingMode: 'Crop' });
    }

    const techSupportStrings: ControlBarButtonStrings = {
        label: 'Tech support',
        tooltipContent: 'Tech support',
    }

    const onRenderTechSupportIcon = (): JSX.Element => {
        return (
            <QuestionCircle20Regular />
        )
    }


    const fileSharedContent = [{ fileName: 'Treament plan', uploadTime: 'Updated at 3:24 a.m' }, { fileName: 'Pain prescriptions', uploadTime: 'Updated on 9/15/22' }]

    return (
        <Stack style={{ margin: 'auto' ,boxShadow: theme.effects.elevation16}}>
            <Stack style={{ width: '80vw', height: '70vh' }} horizontal>
                <div style={{ width: 'inherit', }}>
                    {videoGalleryProps && <VideoGallery {...videoGalleryProps} />}
                </div>
                <CustomParticipantList {...participantListProps} fileSharedContent={fileSharedContent} />
            </Stack>
            <Stack styles={{ root: { width: '80vw' } }}>
                <ControlBar styles={{ root: { padding: '0.75rem', columnGap: '0.5rem' } }}>
                    <Stack horizontal styles={{ root: { margin: 'auto' } }}>
                        <Stack styles={{ root: { paddingLeft: '0.5rem' } }}>
                            {cameraProps && <CameraButton
                                {...cameraProps}
                                onToggleCamera={async () => {
                                    await cameraProps.onToggleCamera({ scalingMode: 'Crop' });
                                    setCameraOn(!cameraOn);
                                }}
                                checked={cameraOn}
                                enableDeviceSelectionMenu={true}
                                showLabel={true}
                                styles={getDesktopCommonButtonStyles(theme)}
                            />}
                        </Stack>
                        <Stack styles={{ root: { paddingLeft: '0.5rem' } }}>
                            {microphoneProps && <MicrophoneButton
                                {...microphoneProps}
                                enableDeviceSelectionMenu={true}
                                showLabel={true}
                                styles={getDesktopCommonButtonStyles(theme)}
                            />}
                        </Stack>
                    </Stack>
                    <Stack horizontal styles={{ root: { columnGap: '0.5rem' } }}>
                        <Stack>
                            <ControlBarButton
                                strings={techSupportStrings}
                                showLabel={true}
                                styles={getDesktopCommonButtonStyles(theme)}
                                onRenderIcon={onRenderTechSupportIcon}
                                onClick={() => {
                                    alert('This is not the tech support you are looking for...');
                                    alert('seriously... there is no help here');
                                    alert('stop looking.. why do you keep bothering me?');
                                }}
                            />
                        </Stack>
                        <Stack>
                            {<EndCallButton
                                onHangUp={() => adapter.leaveCall()}
                                showLabel={true}
                                styles={getDesktopCommonButtonStyles(theme)}
                            />}
                        </Stack>
                    </Stack>

                </ControlBar>
            </Stack>

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

const getDesktopCommonButtonStyles = (theme: ITheme): ControlBarButtonStyles => ({
    root: {
        border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
        borderRadius: theme.effects.roundedCorner4,
        minHeight: '2.5rem',
        maxWidth: '12rem', // allot extra space than the regular ControlBarButton. This is to give extra room to have the icon beside the text.
    },
    flexContainer: {
        display: 'flex',
        flexFlow: 'row nowrap'
    },
    textContainer: {
        display: 'inline',
        maxWidth: '100%'
    },
    label: {
        fontSize: theme.fonts.medium.fontSize,
        marginLeft: '0.625rem',
        lineHeight: '1.5rem',
        display: 'block',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    splitButtonMenuButton: {
        border: `solid 1px ${theme.palette.neutralQuaternaryAlt}`,
        borderTopRightRadius: theme.effects.roundedCorner4,
        borderBottomRightRadius: theme.effects.roundedCorner4,
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',

    },
    splitButtonMenuButtonChecked: {
        background: 'none'
    }
});
