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
    const [categories, setCategories] = useState();

    useEffect(()=>{
        UserService.getPublicContent().then(
            (response)=>{
                setContent(response.data);
            },
            (error)=>{
                const _content = 
                    (error.response && error.response.data) ||
                    error.message || 
                    error.toString();
                setContent(_content);
            }
        )

        getCategories();
    }, []);

    const getCategories = () => {
        CategoryService.getAllCategory().then( response => {
            setCategories(response.data);
        })
    }

    const images = [
        "https://picsum.photos/200/400?image=206",
        "https://picsum.photos/150/200?image=1050",
        
        "https://picsum.photos/300/500?image=106",
        "https://picsum.photos/500/300?image=706",
        "https://picsum.photos/300/200?image=1060",
    ]
    

    let history = useHistory();
            return (
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
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
                                        { data.public_playlists && data.public_playlists.length > 0 && 
                                            <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                                                className="mr-2"
                                                onClick={ () => { let playlist = data.playlists.filter(item => item.id == data.public_playlists[0])[0]; console.log(playlist); history.push('/playlist/' + playlist.playlist_id) } }>
                                                Open Public Playlists
                                            </Button>
                                        }
                                        { data.private_playlists && data.private_playlists.length > 0 &&
                                            <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                                                className="mr-2"
                                                onClick={ () => { history.push('/category_playlists/' + data.category_id) } }>
                                                Open Private Playlists
                                            </Button>
                                        }
                                        </div>
                                    </Media.Body>
                                    </Media>  
                                    </div>
                                )   

                        })}
                </Masonry>
            </ResponsiveMasonry>
        )
       
}


const CategoryList = (props) => {
    let history = useHistory();

    const renderItem = (data) => (
        <ListGroup.Item key={data.id}>
            <Media>
                { data.thumb_image && <Image thumbnail src={data.thumb_image} className="mr-3" style={{ cursor: 'pointer' }} /> || <InsertPhotoIcon style={{ fontSize: 140 }}/> }
                <Media.Body>
                    <h2><span>{data.title}</span></h2>
                    <p style={{ marginBottom: "10px" }}><span>{data.description}</span></p>
                    { data.public_playlists && data.public_playlists.length > 0 && 
                        <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                            className="mr-2"
                            onClick={ () => { let playlist = data.playlists.filter(item => item.id == data.public_playlists[0])[0]; console.log(playlist); history.push('/playlist/' + playlist.playlist_id) } }>
                            Open Public Playlists
                        </Button>
                    }
                    { data.private_playlists && data.private_playlists.length > 0 &&
                        <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                            className="mr-2"
                            onClick={ () => { history.push('/category_playlists/' + data.category_id) } }>
                            Open Private Playlists
                        </Button>
                    }
                </Media.Body>
            </Media>
        </ListGroup.Item>
    );


    return (
        <>
            <div className="card">
                <ListGroup variant="flush">
                    {props.categories
                        && props.categories.map(item => {
                                return renderItem(item)
                        })}
                </ListGroup>
            </div>
        </>
    );
}

export default Home;