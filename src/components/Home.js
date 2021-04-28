import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

import UserService from '../services/user.service';
import CategoryService from '../services/category.service';
import {
    Image,
    Button,
    ListGroup,
    Media
} from 'react-bootstrap';

import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"


const Home = ()=>{
    const [content, setContent] = useState();
    const [errReceived, setErrReceived] = useState( false);
    const [categories, setCategories] = useState();

    useEffect(()=>{
		console.log("HOME getPublicContent START");
        UserService.getPublicContent().then(
            (response)=>{
				console.log("HOME getPublicContent RECEIVED");
                setContent(response.data);
            },
            (error)=>{
				console.log("HOME getPublicContent ERR", error);
				console.log("HOME getPublicContent ERRx", error.message);
				setErrReceived( "getPublicContent err=" + error.message);
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                setContent(_content);
				//setErrReceived(_content);
            }
        )
        getCategories();
    }, []);

    const getCategories = () => {
		console.log("HOME getCategories START");
        CategoryService.getAllCategory()
        .then( response => {
			console.log("HOME getCategories RECEIVED");
            setCategories(response.data);
        })
		.catch(err => {
			//let received_data = "getProducts error=" + err.message;
			console.log( "HOME getCategories err=", err);
			setErrReceived( "Categories err=" + err.message);
			//setResponseState( received_data);
		});
    }

    let history = useHistory();
            return (
		<div>
			<div>{errReceived ? errReceived : ""}</div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 2}}
            >
                <Masonry>

                    {categories
                        && categories.map((data, i) => {
                                return(
                                    <div className="m-1">
                                    <Media className="masonryMedia">
                                  <img  src={data.thumb_image} className="img100" style={{ cursor: 'pointer' }}                                  />
                                  <Media.Body class="media-body justify-content-center align-items-center">
                                        <div>
                                        <h2><span>{data.title}</span></h2>
                                        <p style={{ marginBottom: "10px" }}><span>{data.description}</span></p>
                                        <div className="d-flex justify-content-center bd-highlight mb-3">
                                            { data.public_playlists && data.public_playlists.length > 0 &&
                                                <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                                                    className="mr-2"
                                                    onClick={ () => { let playlist = data.playlists.filter(item => item.id == data.public_playlists[0])[0]; console.log(playlist); history.push('/playlist/' + playlist.playlist_id) } }>
                                                    Public Playlists
                                                </Button>
                                            }
                                            { data.private_playlists && data.private_playlists.length > 0 &&
                                                <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                                                    className=""
                                                    onClick={ () => { history.push('/category_playlists/' + data.category_id) } }>
                                                    Private Playlists
                                                </Button>
                                            }
                                        </div>
                                        </div>
                                    </Media.Body>
                                    </Media>
                                    </div>
                                )

                        })}
                </Masonry>
            </ResponsiveMasonry>
		</div>
	)
}


export default Home;