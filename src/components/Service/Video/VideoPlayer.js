import Modal from 'react-bootstrap/Modal';
import ReactPlayer from 'react-player';
import { Paper } from '@material-ui/core';

import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import GlobalData from '../../../tools/GlobalData';

import {
    Button,
    Row,
    Col,
} from 'react-bootstrap';

var counterCalls = 0;
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const VideoPlayer = (props) => {
    const [playingStatus, setPlayingStatus] = useState(true);
    counterCalls = counterCalls + 1;
    const classes = useStyles();
    const ref = React.createRef();
    var seek_time = 0;
    
    //playingStatus = true;

    if( props.playUrl ) {
        const idx = props.playUrl.indexOf("#t=")
        seek_time = parseFloat(idx >=0 ? props.playUrl.substring(idx + 3) : 0);
    }
    //if( !playingStatus){
    //	console.log( "detected playingStatus=", counterCalls, playingStatus);
		//setPlayingStatus( props.myPlayingStatus);
	//}
    return (
        <Modal
            show={props.show}
            onHide={ () => {
				console.log( "onClose active");
				setPlayingStatus(true);
				props.onHide();
				}}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.metaTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={9}>
                        <ReactPlayer
                            ref={ ref }
                            url={props.playUrl}
                            width={GlobalData.modal_video_player_width}
                            height={GlobalData.modal_video_player_height}
                            controls={true}
                            playing={playingStatus}
                            onPlay={() => setPlayingStatus(true)}
                            onReady={() => { return seek_time && ref.current.seekTo( seek_time )} }
                        />
                        <p><i>{props.metaDescription}</i></p>
                    </Col>
                    <Col md={3} style={{borderLeft: '1px solid lightgray'}}>
                        <h5 style={{borderBottom: '1px solid lightgray', paddingBottom: 5, display: 'flex', justifyContent: 'center'}}>Video List</h5>
                        <Paper style={{height: 450, overflow: 'auto'}} key={props.metaTitle}>
                        <List className={classes.root}>

                            {props.videoData.length > 0 &&
                                props.videoData.map((item, index) => {
                                    let title = item.manual_title || item.meta_title;
                                    let description = item.manual_description || item.meta_description;

                                    return (
                                        <div key={index}>
                                            <ListItem alignItems="flex-start"
                                                button
                                                onClick={() => {
														setPlayingStatus(true);
														props.itemClick(item.video_id, item.id)
													}}
                                                selected={props.videoId == item.id}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src={item.meta_image} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={title && title.length > 20 ? title.substring(0, 20) + '...' : title}
                                                    secondary={
                                                        <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            className={classes.inline}
                                                            color="textPrimary"
                                                        >
                                                        { description && description.length > 40 ? description.substring(0, 40) + '...' : description}
                                                        </Typography>
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </div>
                                    )
                                })
                            }
                        </List>
                        </Paper>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => {
                    setPlayingStatus(true);
					props.onHide();
				}}>Close</Button>
                <Button variant="primary" onClick={() => {
                    setPlayingStatus(true);
					props.onPreviousVideo();
					}}>Previous</Button>
                <Button style={{marginRight: '10px'}} variant="primary" onClick={() => {
                    setPlayingStatus(true);
					props.onNextVideo();
					}}>Next</Button>
                <Button style={{marginRight: '10px'}} variant="info" onClick={() => {
                    setPlayingStatus(false);
                    props.onOpenSourceUrl();
                }}>SB</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default VideoPlayer;