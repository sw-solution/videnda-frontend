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

const MyVerticallyCenteredModal = (props) => {
    const [playingStatus, setPlayingStatus] = useState(true);
    const classes = useStyles();
	onClickFullScreen = () => {
		screenfull.request(findDOMNode(this.refs.player))
	}
    return (
        <Modal
            {...props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton maxButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.metaTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={9}>
                        <ReactPlayer
                            ref='player'
                        	url={props.playUrl}
                        	playing={true}
                        	width={GlobalData.modal_video_player_width}
                        	height={GlobalData.modal_video_player_height}
                        	controls={true}
                        	playing={playingStatus} />
                        <p><i>{props.metaDescription}</i></p>
                    </Col>
                    <Col md={3} style={{borderLeft: '1px solid lightgray'}}>
                        <h5 style={{borderBottom: '1px solid lightgray',
                        	paddingBottom: 5, display: 'flex',
                        	justifyContent: 'center'}}>Video List</h5>
                        <Paper style={{height: 450, overflow: 'auto'}}>
                        <List className={classes.root}>
                            {props.videoData.length > 0 &&
                                props.videoData.map(item => {
                                    let title = item.manual_title || item.meta_title;
                                    let description = item.manual_description || item.meta_description;
                                    return (
                                    <>
                                        <ListItem alignItems="flex-start"
                                            button
                                            onClick={() => props.itemClick(item.video_id, item.id)}
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
                                    </>
                                    )
                                })
                            }
                        </List>
                        </Paper>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                {/* <p style={{marginRight: '5%'}}>{props.currentVideoNumber} of {Object.keys(props.videoData).length}</p> */}
                <Button variant="danger" onClick={props.onHide}>Close</Button>
                <Button variant="info" onClick={onClickFullScreen()}>Maximize</Button>
                <Button style={{marginRight: '10px'}} variant="info" onClick={() => {
                    setPlayingStatus(false);
                    props.onOpenSourceUrl();
                }}>
                    Source with Bookmark
                </Button>
                <Button variant="primary" onClick={props.onPreviousVideo}>Previous</Button>
                <Button style={{marginRight: '10px'}} variant="primary" onClick={props.onNextVideo}>Next</Button>
                <Button style={{marginRight: '10px'}} variant="info" onClick={() => {
                    setPlayingStatus(false);
                    props.onOpenSourceUrl();
                }}>SB</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MyVerticallyCenteredModal;