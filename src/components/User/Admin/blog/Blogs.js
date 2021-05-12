import React, { useEffect, useState } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import SelectOptions from '../../../Common/SelectOptions';

import {
  Row,
  Col,
  Button,
  Badge,
  Modal,
} from 'react-bootstrap';

import UserService from '../../../../services/user.service';
import PlaylistService from '../../../../services/playlist.service';

import BlogService from '../../../../services/blog.service';
import AppLayout from '../../../../layouts/App';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const BlogModal = (props) => {
    console.log('propsxy',props)
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Blog Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={12}>
                        <TextField placeholder="Title" fullWidth value={props.title} onChange={ (e) => props.setBlogTitle(e.target.value) } />
                    </Col>
                    <Col md={12} style={{marginTop: 15}}>
                        <TextField placeholder="Description" multiline fullWidth rows={4} value={props.description} onChange={ (e) => props.setBlogDescription(e.target.value) } />
                    </Col>
                    <Col md={12} style={{marginTop: 15}}>
                        <TextField placeholder="Content" multiline fullWidth rows={4} value={props.content} onChange={ (e) => props.setBlogContent(e.target.value) } />

        
                    </Col>
                    <Col md={12} style={{marginTop: 15}}>
                        <label> Fetaure Image:&nbsp;&nbsp; </label>
                        <input type="file" accept="image/*" onChange={ (e) => props.setBlogFeatureImage(e.target.files[0]) } />
                        {props.blogFeatureImage && <img src={props.blogFeatureImage} width="100%" style={{objectFit: 'cover'}} /> }
                    </Col>
                    
                    {props.blogStatus &&
                        <Col md={6} className="offset-md-6" style={{marginTop: 15}}>
                            <SelectOptions
                                label='Blog Status'
                                id={props.id}
                                value={props.blogStatus}
                                items={props.blogStatusAll}
                                onSave={props.updateBlogStatus}
                                multiple={false}
                            />
                        </Col>
                    }
                    {props.publicPlaylists &&
                        <Col md={6} style={{marginTop: 15}}>
                            <SelectOptions
                                label='Public Playlists'
                                id={props.id}
                                value={props.blogPublicPlaylist}
                                items={props.publicPlaylists}
                                onSave={props.updateBlogPublicPlaylist}
                                multiple={false}
                            />
                        </Col>
                    }

                    {props.privatePlaylists &&
                        <Col md={6} style={{marginTop: 15}}>
                            <SelectOptions
                                label='Private Playlists'
                                id={props.id}
                                value={props.blogPrivatePlaylists}
                                items={props.privatePlaylists}
                                onSave={props.updateBlogPrivatePlaylists}
                                multiple={true}
                            />
                        </Col>
                    }
                </Row>
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={ props.onSave}>Save changes</Button>
                <Button variant="danger" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  pasteTextField: {
    width: '100%',
    marginBottom: 30
  }
});

export default function Blogs() {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [errorText, setErrorText] = useState('');
    const [blogPublicPlaylists, setBlogPublicPlaylists] = useState([]);
    const [blogPrivatePlaylists, setBlogPrivatePlaylists] = useState([]);
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [blogStatus, setBlogStatus] = useState(1);
    const [blogStatusAll, setBlogStatusAll] = useState([{id:1, name:'Public'}, {id:2, name:'Private'}]);


    // for Blog modal
    const [blogId, setBlogId] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDescription, setBlogDescription] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogFeatureImage, setBlogFeatureImage] = useState(null);    
    const [blogPublicPlaylist, setBlogPublicPlaylist] = useState();
    const [blogPrivatePlaylist, setBlogPrivatePlaylist] = useState([]);

    useEffect(() => {
        if (!isLoaded) {
            getAllBlog();
            getAllPlaylists();
            setIsLoaded(true)
        }
    })
    
    const getAllBlog = () => {
        // console.log('preGetAllBlog')
        BlogService.getAllBlogList()
            .then(result => {
                // console.log('AllBlog', result.data)
                setRows(result.data)
                setData(result.data)
            })
    }

    const getAllPlaylists = () => {
        PlaylistService.getAllBlogPlaylist()
            .then(async response => {
                console.log('GetPlaylist',response.data)
                if (response.data && response.data.length > 0) {
                    let privatePlaylists = [];
                    let publicPlaylists = [];
                    response.data.map(item => {
                        if( item.content_type == 'blog') {
                            let obj = {id: item.id, name: item.playlist_title};
                            item.playlist_status == 0 && privatePlaylists.push(obj) || publicPlaylists.push(obj);
                        }
                    })

                    setBlogPublicPlaylists(publicPlaylists);
                    setBlogPrivatePlaylists(privatePlaylists);
                    console.log(publicPlaylists, 'Playlists', privatePlaylists)
                }
            })
    }

    const resetBlogData = () => {
        
        setBlogId('')
        setBlogTitle('')
        setBlogDescription('')
        setBlogContent('')
        setBlogFeatureImage(null)

        setBlogPublicPlaylist([])
        setBlogPrivatePlaylist([])
    }

    const updateBlogPublicPlaylist = (id, value) => {
        
        if( value )
            setBlogPublicPlaylist(value)
        else
            setBlogPublicPlaylist()
    }
    const updateBlogStatus = (id, value) => {
        
        if( value )
            setBlogStatus(value)        
    }

    const updateBlogPrivatePlaylists = (id, value) => {
        setBlogPrivatePlaylists(value)
    }

    const saveBlog = async () => {
        setRows([])
        setData([])

        let feature_image = '';
        if( blogFeatureImage ) {
            console.log(blogFeatureImage)
            feature_image = await BlogService.uploadThumbnail(blogFeatureImage);
        }
        console.log(blogFeatureImage)
        console.log(feature_image)
        let playlists = [];

        blogPublicPlaylists.map(plist=>{
            playlists.push(plist.id)
        })
        blogPrivatePlaylists.map(pplist=>{
            playlists.push(pplist.id)
        })
        // if( blogPublicPlaylists > 0 )
            // playlists = [blogPublicPlaylists, ...blogPrivatePlaylists];
        // else
        //     playlists = [...blogPrivatePlaylists];

        console.log('playlists 889', playlists)

        if( blogId ) {
            await BlogService.updateBlog(blogId, blogTitle, blogDescription, blogContent, feature_image, playlists, blogStatus)
        } else {
            await BlogService.createBlog(blogTitle, blogDescription, blogContent, feature_image, playlists, blogStatus )
        }

        setShowBlogModal(false)
        resetBlogData()
        getAllBlog()
    }

    const editBlog = (id) => {
        console.log(id)
        console.log(rows)
        resetBlogData()

        const blog = rows.filter(item => item.id == id)[0];
        console.log('blog', blog)

        setBlogId(blog.id)
        setBlogTitle(blog.title)
        setBlogDescription(blog.description)
        setBlogContent(blog.content)
        setBlogFeatureImage(null)
        setBlogPublicPlaylist(blog.public_playlists && blog.public_playlists.length && blog.public_playlists[0])
        // setBlogPublicPlaylist(blog.public_playlists)
        setBlogPrivatePlaylist(blog.private_playlists && blog.private_playlists.length && blog.private_playlists[0])
        // setBlogPrivatePlaylist(blog.private_playlists)
        // setBlogPrivatePlaylists(blog.private_playlists)
        setBlogStatus(blog.status)
        setShowBlogModal(true)

        console.log('here', blogPublicPlaylist, blogPrivatePlaylist)
    }
    console.log('here', blogPublicPlaylist, blogPrivatePlaylist)

    const removeBlog = (id) => {
        console.log('id', id)
        if (window.confirm('Are you sure?')) {
            setRows([])
            setData([])
            
            BlogService.removeBlog(id)
            .then(response => {
                if( response.data.message == 'success')
                    getAllBlog()
            }).catch((err) => {
                const resMessage = (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) || err.toString();
                console.log(resMessage);
            });
        }
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let arr = [...data];
            arr = arr.filter(item => (item.title).toLowerCase().includes(e.target.value.trim().toLowerCase()) || (item.description).toLowerCase().includes(e.target.value.trim().toLowerCase()) );
            setRows(arr);
        }
    }
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <AppLayout>
            {errorText &&
                <h5 className="alert alert-danger" style={{position: 'absolute', bottom: 50, right: 50, padding: 40}}>{errorText}</h5>
            }
            <Row className='mt-5'>
                <Col md={9}>
                <Button size='sm' onClick={() => { resetBlogData(); setShowBlogModal(true); }}>
                    Add Blog
                </Button>
                </Col>
                <Col md={3}>
                <TextField
                    className={classes.pasteTextField}
                    id="input-with-icon-textfield"
                    placeholder="Search Blog"
                    onChange={(e) => setSearchString(e.target.value)}
                    onKeyDown={handleSearch}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    }}
                />
                </Col>
            </Row>
            
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">No</TableCell>
                            <TableCell align="center">Image</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Blog Status</TableCell>
                            <TableCell align="center">Public Playlists</TableCell>
                            <TableCell align="center">Private Playlists</TableCell>
                            <TableCell align="center">Operate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell style={{ width: 50 }} component="th" scope="row" align="center">
                                    {index + 1} 
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.feature_image && <img src={row.feature_image} width="100%" style={{objectFit: 'cover'}} /> }
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.title}
                                </TableCell>
                                <TableCell style={{ width: 200 }} align="center">
                                    {row.description}
                                </TableCell>
                                <TableCell style={{ width: 200 }} align="center">                                    
                                    {row.status==1 &&
                                        <p>Public</p> 
                                    }
                                    {row.status==2 &&
                                        <p>Private</p>
                                    }
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.public_playlists.length}
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.private_playlists.length}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    <Button size="sm" variant="primary" block href={'/blog/'+row.id} target="_mew">Open</Button>
                                    <Button size='sm' variant='primary' block onClick={() => editBlog(row.id)}>Edit</Button>
                                    <Button size='sm' variant='danger' block onClick={() => removeBlog(row.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={7}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            
            <BlogModal
                show={showBlogModal}
                onHide={() => setShowBlogModal(false)}
                id={ blogId }
                title={ blogTitle }
                description={ blogDescription }
                content={ blogContent }
                blogFeatureImage={blogFeatureImage}                
                blogPublicPlaylist={ blogPublicPlaylist }
                blogPrivatePlaylists={ blogPrivatePlaylists }
                blogPrivatePlaylist={ blogPrivatePlaylist }
                publicPlaylists={ blogPublicPlaylists }
                privatePlaylists={ blogPrivatePlaylists }
                blogStatus={ blogStatus }
                blogStatusAll={ blogStatusAll }
                onSave={saveBlog}
                setBlogTitle={setBlogTitle}
                setBlogDescription={setBlogDescription}
                setBlogContent={setBlogContent}
                setBlogFeatureImage={setBlogFeatureImage}
                setBlogStatus={ setBlogStatus }
                updateBlogPublicPlaylist={updateBlogPublicPlaylist}
                updateBlogStatus={updateBlogStatus}
                updateBlogPrivatePlaylists={updateBlogPrivatePlaylists}
            />
        </AppLayout>
    );
}