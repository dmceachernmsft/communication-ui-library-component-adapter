import { ParticipantList, ParticipantListProps, ParticipantListStyles } from "@azure/communication-react";
import { Stack, Text, Icon, ITextStyles} from "@fluentui/react";
import { getFileTypeIconProps } from '@fluentui/react-file-type-icons';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';


export interface CustomParticipantListProps extends ParticipantListProps {
    fileSharedContent: {fileName:string, uploadTime:string}[]
}
   

export const CustomParticipantList = (props: CustomParticipantListProps): JSX.Element => {
    // Register icons and pull the fonts from the default SharePoint cdn.
    initializeFileTypeIcons();
  
    const participantListStyle:ParticipantListStyles = {
        root :{
            height: 'fit-content',
            padding: 0,
            margin: 0,
            marginBottom: '2rem'
        }   
    }

    const subtitleStyle: ITextStyles = {
        root:{
            padding: '0.25rem 1rem', 
            textAlign: 'left', 
            fontWeight:'bold', 
            fontSize: '14px'
        }
    }

    const titleStyle: ITextStyles = {
        root:{
            padding: '0.25rem 1rem', textAlign: 'left', fontWeight:'bold', fontSize: '16px',marginBottom:"2rem"
        }
    }

    const primaryTextStyle: ITextStyles = {
        root:{
            padding: '0.25rem 0.5rem', 
            textAlign: 'left', 
            fontWeight:'bold', 
            fontSize: '14px'
        }
    }

    const secondaryTextStyle: ITextStyles = {
        root:{
            padding: '0.25rem 0.5rem', 
            textAlign: 'left', 
            fontSize: '10px'
        }
    }

    
    return (
    <Stack verticalAlign="start" style={{paddingTop: '1rem'}}>
          <Text styles={titleStyle}>  Check-up with Dr. Slattery</Text>
          <Text styles={subtitleStyle}>  Here</Text>
       <ParticipantList {...props} styles={participantListStyle}/>

       <Text styles={subtitleStyle}> Shared files </Text>

       {props.fileSharedContent.map((content,index) =>(
            <Stack horizontal style={{padding: '0.25rem 1rem', alignItems: 'center'}} id={`file_${index}`} >
                <Icon {...getFileTypeIconProps({ extension: 'docx', size: 32 })} />
                <Stack>
                    <Text styles={primaryTextStyle}>{content.fileName}</Text>
                    <Text styles={secondaryTextStyle}>{content.uploadTime}</Text>
                </Stack>
            </Stack>
       ))}
      </Stack>
      
      );
  };
  