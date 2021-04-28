/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import {
    useParams
  } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useHistory } from "react-router-dom";
import VideoPlayer from '../Video/VideoPlayer';
import Alert from '@material-ui/lab/Alert';
import MButton from '@material-ui/core/Button';


import {
    Image,
    Button,
    ListGroup,
    Media,
} from 'react-bootstrap';

import PlaylistService from '../../../services/playlist.service';
import AppLayout from '../../../layouts/App';

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

const getVideoId = (url) => {
    return url.split("?v=")[1];
}

export default (props) => {
    const [pageNumber, setPageNumber] = React.useState(localStorage.getItem('videolistpage') ? Number(localStorage.getItem('videolistpage')) : 1);
    const [itemsPerPage] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(1);
    const [videoData, setVideoData] = useState([]);
    const [videoInfos, setVideoInfos] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [playUrl, setPlayUrl] = useState(null);
    const [metaTitle, setMetaTitle] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [currentVideoNumber, setCurrentVideoNumber] = useState(1);
    const [metaDescription, setMetaDescription] = useState(null);
    const [errorText, setErrorText] = useState('');


    let history = useHistory();

    let params = useParams();
    let playlistId = params.playlist_id || history.push("/404");

    useEffect(() => {
        getAllVideos();
    }, [props])

    const getAllVideos = () => {
        if (playlistId != null)
            PlaylistService.getPublicPlaylist(playlistId)
                .then(async response => {
                    if (response.data && response.data.length > 0) {

                        setVideoData(response.data)
                        setVideoInfos(response.data);

                        const total = Math.ceil(response.data.length / itemsPerPage);
                        setTotalPages(total);
                    }
                }).catch(error => {
                    console.log(error.response)

                    if ( error.response.status == 401 )
                        history.push("/signin");
                    else if ( error.response.status == 403 || error.response.status == 404 )
                        history.push("/404");
                })
    }

    const handleChangePageNumber = (pagenum) => {
        setPageNumber(pagenum);
        localStorage.setItem('videolistpage', pagenum)
    }

    const handleChangeKeyword = (key) => {
        const keyword = key.trim().toLowerCase();
        // eslint-disable-next-line array-callback-return
        let data = videoData.filter(item => {
            let fileName = item.meta_keyword + item.meta_description + item.meta_title + getVideoId(item.video_id);
            fileName = fileName.trim().toLowerCase();

            if (keyword === "") {
                return 1;
            }

            if (fileName.includes(keyword)) {
                return 1;
            }
        });

        setVideoInfos(data);

        const total = Math.ceil(data.length / itemsPerPage);
        setTotalPages(total);

        localStorage.removeItem('videolistpage');
        setPageNumber(1);
    }

    function meta_restriction_age_str(meta) {
        if (!meta)
            return "";
        return " [" + meta + "]";
    }

    // Play one video
    const handlePlayVideo = (video_url, meta_title, videoId, meta_restriction_age, meta_description) => {
        PlaylistService.addHistory(videoId)
            .then(response => {
                setModalShow(true);
                setPlayUrl(video_url);
                setMetaTitle(meta_title + meta_restriction_age_str(meta_restriction_age));
                setMetaDescription(meta_description);
                setVideoId(videoId);
            })
            .catch((err) => {
                const resMessage = (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) || err.toString();

                setErrorText(resMessage);
                setTimeout(() => {
                    setErrorText('');
                }, 5000);
            });
    }

    const onNextVideo = () => {
        const index = videoData.findIndex(item => item.id == videoId);
        if (index >= videoData.length - 1) {
            return;
        }

        PlaylistService.addHistory(videoData[index + 1].id)
            .then(response => {
                const nextUrl = videoData[index + 1].video_id;
                setVideoId(videoData[index + 1].id);
                setPlayUrl(nextUrl);
                setMetaTitle((videoData[index + 1].manual_title || videoData[index + 1].meta_title) + meta_restriction_age_str(videoData[index + 1].meta_restriction_age))
                setMetaDescription(videoData[index + 1].manual_description || videoData[index + 1].meta_description)
                setCurrentVideoNumber(getCurrentVideoNumber() + 1)
            })
            .catch((err) => {
                const resMessage = (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) || err.toString();

                setErrorText(resMessage);
                setTimeout(() => {
                    setErrorText('');
                }, 5000);
            });
    }

    const onPreviousVideo = () => {
        const index = videoData.findIndex(item => item.id == videoId);
        if (index <= 0) {
            return;
        }

        PlaylistService.addHistory(videoData[index - 1].id)
            .then(response => {
                const prevUrl = videoData[index - 1].video_id;
                setVideoId(videoData[index - 1].id);
                setPlayUrl(prevUrl);
                setMetaTitle((videoData[index - 1].manual_title || videoData[index - 1].meta_title) + meta_restriction_age_str(videoData[index - 1].meta_restriction_age))
                setMetaDescription(videoData[index - 1].manual_description || videoData[index - 1].meta_description)
                setCurrentVideoNumber(getCurrentVideoNumber() - 1)
            })
            .catch((err) => {
                const resMessage = (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) || err.toString();

                setErrorText(resMessage);
                setTimeout(() => {
                    setErrorText('');
                }, 5000);
            });
    }

    function beep() {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        snd.play();
    }

    const onOpenSourceUrl = () => {
        //beep();
        //Pause curent video before launching a new one
        const index = videoData.findIndex(item => item.id == videoId);
        const nextUrl = videoData[index].video_id;
        PlaylistService.addHistory(videoId);
        window.open(nextUrl, '_blank');
    }

    const getCurrentVideoNumber = () => {
        return videoData.findIndex(item => item.id == videoId) + 1
    }

    const itemClick = (video_id, ivideoId) => {
        PlaylistService.addHistory(ivideoId)
            .then(response => {
                setPlayUrl(video_id);
                setVideoId(ivideoId);
                setMetaTitle(videoData.find(item => item.id == ivideoId).manual_title || videoData.find(item => item.id == ivideoId).meta_title);
                setMetaDescription(videoData.find(item => item.id == ivideoId).manual_description || videoData.find(item => item.id == ivideoId).meta_description);
            })
            .catch((err) => {
                const resMessage = (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) || err.toString();

                setErrorText(resMessage);
                setTimeout(() => {
                    setErrorText('');
                }, 5000);
            });
    }

    return (
        <AppLayout>
            {videoInfos &&
                <VideoList
                    videoInfos={videoInfos}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    currentPage={pageNumber}
                    onChangeKeyword={handleChangeKeyword}
                    onChangePageNumber={handleChangePageNumber}
                    handlePlayVideo={handlePlayVideo}
                />
            }
            <VideoPlayer
                show={modalShow}
                onHide={() => setModalShow(false)}
                playUrl={playUrl}
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                videoData={videoData}
                videoId={videoId}
                onPreviousVideo={onPreviousVideo}
                onNextVideo={onNextVideo}
                onOpenSourceUrl={onOpenSourceUrl}
                currentVideoNumber={currentVideoNumber}
                itemClick={itemClick}
            />
            {errorText && //errorText.includes('Token')
                <div>
                    <Alert
                        severity='error'
                        style={{ position: 'fixed', bottom: 50, right: 50, zIndex: 9999, padding: '20px 40px' }}
                        action={
								(errorText.includes('Not Enough Tokens') ||
									errorText.includes('Please login'))
                            &&
                            <MButton
                                color="inherit" size="medium"
                                onClick={() => {
                                    history.push('/add_token_code');
                                }}
                            >
                                Take More Tokens (+)
                        </MButton>
                        }
                    >
                        {errorText}
                    </Alert>
                </div>
            }
        </AppLayout>
    );
}


const VideoList = (props) => {
    const classes = useStyles();

    const renderItem = (data) => (
        <ListGroup.Item key={data.id}>
            <Media>
                <Image thumbnail src={data.meta_image} className="mr-3" style={{ cursor: 'pointer' }} onClick={() => props.handlePlayVideo(data.video_id, data.manual_title || data.meta_title, data.id, data.meta_restriction_age, data.manual_description || data.meta_description)} />
                <Media.Body>
                    <h5><span>{data.manual_title || data.meta_title}</span></h5>
                    <p style={{ marginBottom: "0px" }}><span>ID : </span><code>{getVideoId(data.video_id)}</code></p>
                    <p style={{ marginBottom: "2px" }}><span>{data.manual_description || data.meta_description}</span></p>
                    {data.meta_keyword && (
                        <p><small><span>Keywords : </span><span>{data.meta_keyword}</span></small></p>
                    )}
                    <p><small><i><span>Created Time : </span><span>{data.dateTime}</span></i></small></p>
                    <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                        className="mr-2"
                        onClick={() => props.handlePlayVideo(data.video_id, data.manual_title || data.meta_title, data.id, data.meta_restriction_age, data.manual_description || data.meta_description)}>
                        Play Video
                    </Button>
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
                <h3 className="card-header">List of Videos</h3>
                <ListGroup variant="flush">
                    {props.videoInfos
                        && props.videoInfos.map((video, index) => {
                            if ((props.currentPage - 1) * props.itemsPerPage <= index && (props.currentPage) * props.itemsPerPage > index) {
                                return renderItem(video)
                            } else {
                                return null
                            }
                        })}
                </ListGroup>
                {showPagenationItem()}
            </div>
        </>
    );
}