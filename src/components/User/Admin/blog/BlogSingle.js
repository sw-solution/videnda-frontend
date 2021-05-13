/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import renderHTML from 'react-render-html';

import {
    useParams
  } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useHistory } from "react-router-dom";
import VideoPlayer from '../../../Service/Video/VideoPlayer';
import Alert from '@material-ui/lab/Alert';
import MButton from '@material-ui/core/Button';

import {
    Image,
    Button,
    Col,
    Card,
    ListGroup,
    Media,
} from 'react-bootstrap';

import AuthService from "../../../../services/auth.service";
import PlaylistService from '../../../../services/playlist.service';
import BlogService from '../../../../services/blog.service';
import AppLayout from '../../../../layouts/App';

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
    // return url.split("?v=")[1];
}

export default (props) => {
    const [pageNumber, setPageNumber] = React.useState(localStorage.getItem('videolistpage') ? Number(localStorage.getItem('videolistpage')) : 1);
    const [itemsPerPage] = React.useState(10);
    const [totalPages, setTotalPages] = React.useState(1);
    const [videoData, setBlogData] = useState([]);
    const [blogInfos, setBlogInfos] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [playUrl, setPlayUrl] = useState(null);
    const [metaTitle, setMetaTitle] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [currentVideoNumber, setCurrentVideoNumber] = useState(1);
    const [metaDescription, setMetaDescription] = useState(null);
    const [errorText, setErrorText] = useState('');


    let history = useHistory();

    let params = useParams();
    let playlistId = params.id || history.push("/404");

    useEffect(() => {
        getAllBlog();
    }, [props])

    const getAllBlog = () => {
        const user = AuthService.getCurrentUser();
        // console.log(user);
        if(!user) {            
            // history.push("/signin");
        }
        if (playlistId != null)
        BlogService.getSingleBlog(playlistId)
                .then(async response => {
                    console.log('response.data',response.data)
                    if(!user) {            
                        if(response.data[0].status==2) {
                            history.push("/signin");                        
                        }
                    }
                    if (response.data && response.data.length > 0) {

                        setBlogData(response.data)
                        setBlogInfos(response.data);

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



    function meta_restriction_age_str(meta) {
        if (!meta)
            return "";
        return " [" + meta + "]";
    }


    

    return (
        <AppLayout>
            {blogInfos &&
                <SingleBlog
                    blogInfos={blogInfos}                    
                />
            }
            
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


const SingleBlog = (props) => {
    const classes = useStyles();

    const renderBlog = (data) => (
        <>
        <div  className="col-md-10 offset-md-1" key={data.id}>
        <img  src={data.feature_image} className="img-fluid"/>
        <div>
            <h2>{data.title}</h2>
            <div className="mt-3"> 
            {data.description}
            </div>
            <div className="mt-3">
            
            {renderHTML(data.content)}
            
            </div>
            
        </div>
            
            
            
        </div>
        </>
    );


    return (
        <>
            <div className="">
                <ListGroup variant="flush">
                    {props.blogInfos
                        && props.blogInfos.map((blog, index) => {
                                return renderBlog(blog)                            
                        })}
                </ListGroup>
                
            </div>
        </>
    );
}