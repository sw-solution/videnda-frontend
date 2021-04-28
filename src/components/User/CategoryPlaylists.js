import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from "react-router-dom";
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';

import CategoryService from '../../services/category.service';
import AppLayout from '../../layouts/App';

import {
    Image,
    Button,
    ListGroup,
    Media,
} from 'react-bootstrap';

const CategoryPlaylists = ()=>{
    const [category, setCategory] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    let history = useHistory();
    let params = useParams();
    let categoryId = params.category_id || history.push("/404");

    useEffect(()=>{
        getCategory();
    }, []);

    const getCategory = () => {
        CategoryService.getCategory(categoryId).then( response => {
          setCategory(response.data || null);
          setPlaylists(response.data && response.data.playlists.filter(item => item.playlist_status == 0) || []);
        })
    }

    return (
        <AppLayout>
            {playlists && <PlaylistList playlists={playlists}></PlaylistList>}
        </AppLayout>
    )
}

const PlaylistList = (props) => {
    let history = useHistory();

    const renderItem = (data) => (
        <ListGroup.Item key={data.id}>
            <Media>
                { data.thumb_image && <Image thumbnail src={data.thumb_image} className="mr-3" style={{ cursor: 'pointer' }} /> || <InsertPhotoIcon style={{ fontSize: 140 }}/> }
                
                <Media.Body>
                    <h2><span>{data.playlist_title}</span></h2>
                    <p style={{ marginBottom: "10px" }}><span>{data.video_count} Videos</span></p>
                    <Button variant="primary" size="sm" style={{ padding: '5px 20px' }}
                        className="mr-2"
                        onClick={ () => { history.push('/playlist/' + data.playlist_id) } }>
                        Open
                    </Button>
                </Media.Body>
            </Media>
        </ListGroup.Item>
    );


    return (
        <>
            <div className="card">
                <ListGroup variant="flush">
                    {props.playlists
                        && props.playlists.map(item => {
                                return renderItem(item)
                        })}
                </ListGroup>
            </div>
        </>
    );
}

export default CategoryPlaylists;