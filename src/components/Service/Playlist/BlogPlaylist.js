/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeItem from '@material-ui/lab/TreeItem';
import { Pagination } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputIcon from '@material-ui/icons/Create';
import InsertLink from '@material-ui/icons/InsertLink';
import InputAdornment from '@material-ui/core/InputAdornment';
import Modal from 'react-bootstrap/Modal';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import GlobalData from '../../../tools/GlobalData';
import SelectOptions from '../../Common/SelectOptions';
import EditDialog from '../Video/EditDialog';

import {
    Row,
    Col,
    Alert,
    Image,
    Button,
    ListGroup,
    Media,
} from 'react-bootstrap';

// import VideoService from '../../../services/video.service';
import BlogService from '../../../services/blog.service';
import PlaylistService from '../../../services/playlist.service';
import { LinearProgress, Paper } from '@material-ui/core';

import authService from '../../../services/auth.service';
import AppLayout from '../../../layouts/App';

const front_end_server = GlobalData.front_end_server_ip + ":" + GlobalData.front_end_server_port;
//const ba-ck_end_server = GlobalData.ba-ck_end_server_ip + ":3000";

const useStyles = makeStyles((theme) => ({
    root: {
        height: 110,
        flexGrow: 1,
        maxWidth: 400,
    },
    margin: {
        margin: theme.spacing(1),
    },
    linkInput: {
        width: "100%",
        marginBottom: theme.spacing(1)
    },
    linerProgress: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

const getblogId = (url) => {
    // return url.split("?v=")[1];
}

const SettingDialog = (props) => {
    const classes = useStyles();

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Playlist Infomation
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="justify-content-end">
                    <Col md={8}>
                        <TextField
                            className={classes.linkInput}
                            placeholder="Input a new playlist name to change."
                            value={props.currentPlaylistTitle}
                            onChange={(e) => props.setCurrentPlaylistTitle(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <InputIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Col>
                    <Col md={4}>
                        <Select className="mr-4"
                            style={{ width: "100%" }}
                            value={props.currentPlaylistStatus}
                            onChange={(e) => props.setCurrentPlaylistStatus(e.target.value)}
                        >
                            <MenuItem value={1}>Public</MenuItem>
                            <MenuItem value={0}>Private</MenuItem>
                        </Select>
                    </Col>

                    <Col md={12}>                    
                        <Select className="mr-4 mt-4"
                            style={{ width: "100%" }}
                            value={props.currentPlaylistThumbBlog}
                            onChange={(e) => props.setCurrentPlaylistThumbBlog(e.target.value)}
                        >
                            <MenuItem value="0" disabled> Choose a item for thumbnail </MenuItem>
                            { props.blogInfos.map((item, index) => {
                                {/* console.log(index, item) */}
                                return (
                                    <MenuItem key={index} value={item.id}> { item.title }
                                     </MenuItem>
                                )}
                            )}
                        </Select>
                    </Col>
               
                    
                    {props.isAdmin &&
                        <Col md={6}>
                            <Select
                                className="mr-4 mt-4"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={props.currentPlaylistType}
                                onChange={(e) => props.setCurrentPlaylistType(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value='standard'>Standard</MenuItem>
                                <MenuItem value='marketing'>Marketing</MenuItem>
                            </Select>
                        </Col>
                        
                    }
              
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={props.onSave}>Save</Button>
                <Button variant="danger" onClick={props.onDelete}>Delete</Button>
                <Button variant="primary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default () => {
    const [message, setMessage] = React.useState("");
    const [pageNumber, setPageNumber] = React.useState(localStorage.getItem('playlistpage') ? Number(localStorage.getItem('playlistpage')) : 1);
    const [itemsPerPage] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(1);
    const [treeData, setTreeData] = useState('');
    const [selected, setSelected] = useState('root');
    const [alertVisible, setAlertVisible] = useState(false);
    const [progressVisible, setProgressVisible] = useState(false);
    const [blogData, setBlogData] = useState([]);
    const [blogInfos, setBlogInfos] = useState([]);
    const [settingShow, setSettingShow] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistStatus, setPlaylistStatus] = useState(1);
    const [currentPlaylistId, setCurrentPlaylistId] = useState('');
    const [playlistData, setPlaylistData] = useState([]);
    const [currentPlaylistTitle, setCurrentPlaylistTitle] = useState('');
    const [currentPlaylistStatus, setCurrentPlaylistStatus] = useState('');
    const [currentPlaylistThumbBlog, setCurrentPlaylistThumbBlog] = useState(0);
    const [currentPlaylistType, setCurrentPlaylistType] = useState(0);
    const [currentPlaylistContentType, setCurrentPlaylistContentType] = useState(0);
    
    const [playlists, setPlaylists] = useState([]);
    const [blogId, setBlogId] = useState(null);
    // const [playlistId, setPlaylistId] = useState(null);
    const [currentBlogNumber, setCurrentBlogNumber] = useState(1);
    const [editShow, setEditShow] = useState(false);
    const [manualTitle, setManualTitle] = useState(undefined);
    const [manualDescription, setManualDescription] = useState(undefined);

    const user = authService.getCurrentUser();
    const isAdmin = user && user.roles.includes("ROLE_ADMIN") || false

    React.useEffect(() => {
        getAllPlaylists();
    }, [])

    const getAllPlaylists = () => {
        PlaylistService.getAllBlogPlaylist()
            .then(async response => {
                // console.log(response.data)
                if (response.data && response.data.length > 0) {
                    setPlaylistData(response.data);
                    setPlaylists(response.data);
                    handleItemClick(response.data[0])
                }
            })
    }

    // Add playlist
    const upload = () => {
        PlaylistService.addPlaylist(playlistTitle, playlistStatus, 'blog')
            .then(response => {
                if (response.data.message === 'success') {
                    getAllPlaylists();
                    setPlaylistTitle('');
                }
            })
    }

    const handleChangePageNumber = (pagenum) => {
        setPageNumber(pagenum);
        localStorage.setItem('playlistpage', pagenum)
    }

    const handleChangeKeyword = (key) => {
        const keyword = key.trim().toLowerCase();
        const nodeId = selected;
        let data = blogData.filter(item => {
            let fileName = item.title + item.description + item.content;
            fileName = fileName ? fileName.trim().toLowerCase() : '';

            if (fileName.includes(keyword)) {
                return 1;
            } else {
                return 0;
            }
        });

        if (keyword == "") {
            setBlogInfos(blogData);
        } else {
            setBlogInfos(data);
        }

        const total = Math.ceil(data.length / itemsPerPage);
        setTotalPages(total);

        localStorage.removeItem("playlistpage");
        setPageNumber(1);
    }

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            setPlaylistTitle(e.target.value);
            upload();
        }
    }

    const handleItemClick = (item ) => {
        setCurrentPlaylistId(item.playlist_id);
        setCurrentPlaylistTitle(item.playlist_title);
        setCurrentPlaylistStatus(item.playlist_status);
        setCurrentPlaylistThumbBlog(item.id);
        setCurrentPlaylistType(item.type);
        setCurrentPlaylistContentType(item.content_type);


        
        PlaylistService.getBlogPlaylist(item.playlist_id)
        .then(async response => {
            if (response.data && response.data.fileInfos.length > 0) {
                
                    const res = response.data.fileInfos;

                    for (const key in res) {
                        const blogId = res[key].id;
                        // console.log('blogId', blogId)
                        const result = await BlogService.getPlaylistIds(blogId);
                        res[key].arr = result.data.playlists;
                    }


                    setCurrentPlaylistThumbBlog(response.data.thumb_video)
                    setBlogData(response.data.fileInfos);
                    setBlogInfos(response.data.fileInfos);

                    const total = Math.ceil(response.data.length / itemsPerPage);
                    setTotalPages(total);

                } else {

                    setBlogInfos([]);
                    
                }
            })
    }

    // delete
    const handleSettingShow = () => {
        if (window.confirm('Are you sure?')) {
            setSettingShow(false)
            PlaylistService.removePlaylist(currentPlaylistId)
                .then(response => {
                    if (response.data.message === 'success') {
                        getAllPlaylists();
                        setCurrentPlaylistId('');
                        window.location.reload();
                    }
                })
        }
    }

    // change
    const handleSettingSave = () => {
        setSettingShow(false)
        PlaylistService.changePlaylist(currentPlaylistId, currentPlaylistTitle, currentPlaylistStatus, currentPlaylistThumbBlog, currentPlaylistType, currentPlaylistContentType)
            .then(response => {
                if (response.data.message === 'success') {
                    getAllPlaylists();
                    setCurrentPlaylistId('');
                    setCurrentPlaylistTitle('');
                    setCurrentPlaylistStatus('');
                    setCurrentPlaylistThumbBlog(response.data.data.thumb_video);

                    // console.log('changePlaylist',response, currentPlaylistThumbBlog)
                }
            })
    }

    function meta_restriction_age_str(meta) {
        if (!meta)
            return "";
        return " [" + meta + "]";
    }


  


    // edit save
    const onSave = () => {
        setEditShow(false);
        // VideoService.setManualInfo(blogId, manualTitle, manualDescription);
        const index = blogData.findIndex(item => item.id == blogId);
        blogData[index].manual_title = manualTitle;
        blogData[index].manual_description = manualDescription;
    }



    const savePlaylist = (id, value) => {
        // console.log('savePlaylist',id, value)
        // VideoService.addPlaylistIds(id, value)
        BlogService.addPlaylistIds(id, value)
    }

    const classes = useStyles();

    const renderTree = (nodes) => {
        return (
            <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
                {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
            </TreeItem>
        )
    }

    return (
        <AppLayout>
            <h2 className="mb-3">My Blog Playlists</h2>
            <Row className="mb-3">
                <Col md={4}>
                    <TextField
                        className={classes.linkInput}
                        id="input-with-icon-textfield-top"
                        placeholder="Input new playlist title."
                        value={playlistTitle}
                        onChange={(e) => setPlaylistTitle(e.target.value)}
                        onKeyDown={(e) => handleOnKeyDown(e)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <InputIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Col>
                <Col md={8}>
                    <Select className="mr-4"
                        style={{ width: "100px" }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={playlistStatus}
                        onChange={(e) => setPlaylistStatus(e.target.value)}
                    >
                        <MenuItem value={1}>Public</MenuItem>
                        <MenuItem value={0}>Private</MenuItem>
                    </Select>

                    <Button disabled={playlistTitle === ''} onClick={upload}>
                        Add Playlist
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    {progressVisible && (
                        <div className={classes.linerProgress}>
                            <LinearProgress />
                        </div>
                    )}
                    {message && (
                        <Alert variant="success" className="mt-3 upload_alert" show={alertVisible}>
                            <Alert.Heading>Add Result</Alert.Heading>
                            {message}
                        </Alert>
                    )}
                </Col>
            </Row>
            <Row>
                <Col md={3} className="card">
                    <List component="nav" aria-label="main mailbox folders">

                        {playlistData && (
                            playlistData.map(item => {
                                return (
                                    <ListItem button key={item.id}
                                        selected={currentPlaylistId == item.playlist_id}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                {item.thumb_image && <Image roundedCircle src={ item.thumb_image } style={{ objectFit: 'cover', width: 40, height: 40 }} /> || <VideoLibraryIcon/> }
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.playlist_title} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" disabled={currentPlaylistId !== item.playlist_id} onClick={() => setSettingShow(true)}>
                                                <SettingsIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })
                        )}

                    </List>
                </Col>
                <Col md={9}>
                    {blogInfos &&
                        <VideoList
                            blogInfos={blogInfos}
                            totalPages={totalPages}
                            itemsPerPage={itemsPerPage}
                            currentPage={pageNumber}
                            playlists={playlists}
                            currentPlaylistId={currentPlaylistId}
                            onChangeKeyword={handleChangeKeyword}
                            onChangePageNumber={handleChangePageNumber}
                            setEditShow={setEditShow}
                            setManualTitle={setManualTitle}
                            setManualDescription={setManualDescription}
                            setBlogId={setBlogId}
                            savePlaylist={savePlaylist}
                            
                        />
                    }
                </Col>
            </Row>
  
            <SettingDialog
                show={settingShow}
                onHide={() => setSettingShow(false)}
                onDelete={handleSettingShow}
                onSave={handleSettingSave}
                setCurrentPlaylistTitle={setCurrentPlaylistTitle}
                currentPlaylistTitle={currentPlaylistTitle}
                currentPlaylistStatus={currentPlaylistStatus}
                setCurrentPlaylistStatus={setCurrentPlaylistStatus}
                setCurrentPlaylistThumbBlog={setCurrentPlaylistThumbBlog}
                currentPlaylistThumbBlog={currentPlaylistThumbBlog}
                setCurrentPlaylistType={setCurrentPlaylistType}
                setCurrentPlaylistContentType={setCurrentPlaylistContentType}
                currentPlaylistType={currentPlaylistType}
                currentPlaylistContentType={currentPlaylistContentType}
                blogInfos={blogInfos}
                isAdmin={isAdmin}
            />
            <EditDialog
                show={editShow}
                onHide={() => setEditShow(false)}
                manualTitle={manualTitle}
                manualDescription={manualDescription}
                setManualTitle={setManualTitle}
                setManualDescription={setManualDescription}
                onSave={onSave}
            />
        </AppLayout>
    );
}


const VideoList = (props) => {
    const classes = useStyles();

    let playlists = [];
    props.playlists.map(item=>{
        playlists.push({id: item.id, name: item.playlist_title});
    });
    
    const user = authService.getCurrentUser();
    const isAdmin = user && user.roles.includes("ROLE_ADMIN") || false

    const renderItem = (data) => (
        <ListGroup.Item key={data.id}>
            <Media>
                <Image thumbnail src={data.feature_image} className="mr-3" style={{ cursor: 'pointer' }}  />
                <Media.Body>
                    <h5><span style={{ color: 'green' }}>{data.manual_title && data.manual_title}</span></h5>
                    <h5><span>{data.meta_title}</span></h5>
                    <p style={{ marginBottom: "0px" }}><span>title : </span><code>{data.title}</code></p>
                    
                    <p style={{ marginBottom: "2px" }}><span>{data.description}</span></p>
                 
                    <p><small><i><span>Created Time : </span><span>{data.dateTime}</span></i></small></p>

                    <Row>
                        <Col className="align-self-end pb-4">
                        <Button size="sm" variant="primary" block href={'/blog/'+data.id} target="_mew">Open</Button>
                           
                        </Col>
                        <Col>
                            {props.playlists.length > 0 &&
                                <SelectOptions
                                    label='Playlists'
                                    id={data.id}
                                    value={data.arr}
                                    items={playlists}
                                    onSave={props.savePlaylist}
                                    multiple={true}
                                />
                            }
                        
                        </Col>
                    </Row>
                </Media.Body>
            </Media>
        </ListGroup.Item>
    );

    const showPagenationItem = () => {

        return (
            <Pagination
                color="primary"
                className="mt-3"
                shape="rounded"
                count={props.totalPages}
                page={props.currentPage}
                onChange={(event, val) => props.onChangePageNumber(val)}
            />
        );
    }

    const doSomethingWith = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {            
            props.onChangeKeyword(e.target.value);
        }
    }

    return (
        <>
            <div className="card">
                <Paper style={{ margin: "5px" }}>
                    <TextField
                        disabled
                        className={classes.margin}
                        value={props.currentPlaylistId && front_end_server + '/playlist/' + props.currentPlaylistId}
                        style={{ width: "85%" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <InsertLink />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button onClick={() => { navigator.clipboard.writeText(front_end_server + '/playlist/' + props.currentPlaylistId) }}>Copy</Button>
                </Paper>
                <TextField
                    className={classes.margin}
                    id="input-with-icon-textfield"
                    placeholder="Search"
                    onKeyDown={doSomethingWith}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <h3 className="card-header">List of Blogs </h3>
                <ListGroup variant="flush">
                    {props.blogInfos
                        && (props.blogInfos.map((blog, index) => {                           
                            if ((props.currentPage - 1) * props.itemsPerPage <= index && (props.currentPage) * props.itemsPerPage > index) {
                                return renderItem(blog)
                            } else {
                                return null
                            }
                        }))}
                </ListGroup>
                {showPagenationItem()}
            </div>
        </>
    );
}

