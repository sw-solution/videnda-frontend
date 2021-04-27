import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

import UserService from '../services/user.service';
import CategoryService from '../services/category.service';
import {
    Image,
    Button,
    ListGroup,
    Media,
} from 'react-bootstrap';

const HomeBK = ()=>{
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

    return (
        <div className="container">
            {categories && categories.length && <CategoryList categories={categories}></CategoryList> || 
                <div className="jumbotron">
                    <h3>{content}</h3>
                </div>
            }
        </div>
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

export default HomeBK;