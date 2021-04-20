import React, { useEffect, useState } from 'react';
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
import SelectOptions from '../../Common/SelectOptions';

import {
  Row,
  Col,
  Button,
  Badge,
  Modal,
} from 'react-bootstrap';

import UserService from '../../../services/user.service';
import PlaylistService from '../../../services/playlist.service';
import CategoryService from '../../../services/category.service';

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

const CategoryModal = (props) => {
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
                    Category Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={12}>
                        <TextField placeholder="Name" fullWidth value={props.title} onChange={ (e) => props.setCategoryTitle(e.target.value) } />
                    </Col>
                    <Col md={12} style={{marginTop: 15}}>
                        <TextField placeholder="Description" multiline fullWidth rows={4} value={props.description} onChange={ (e) => props.setCategoryDescription(e.target.value) } />
                    </Col>
                    <Col md={12} style={{marginTop: 15}}>
                        <label> Thumbnail:&nbsp;&nbsp; </label>
                        <input type="file" accept="image/*" onChange={ (e) => props.setCategoryThumb(e.target.files[0]) } />
                    </Col>
                    {props.publicPlaylists &&
                        <Col md={6} style={{marginTop: 15}}>
                            <SelectOptions
                                label='Public Playlists'
                                id={props.id}
                                value={props.categoryPublicPlaylist}
                                items={props.publicPlaylists}
                                onSave={props.updateCategoryPublicPlaylist}
                                multiple={false}
                            />
                        </Col>
                    }
                    {props.privatePlaylists.length > 0 &&
                        <Col md={6} style={{marginTop: 15}}>
                            <SelectOptions
                                label='Private Playlists'
                                id={props.id}
                                value={props.categoryPrivatePlaylists}
                                items={props.privatePlaylists}
                                onSave={props.updateCategoryPrivatePlaylists}
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

export default function CategoryManagement() {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [errorText, setErrorText] = useState('');
    const [marketingPublicPlaylists, setMarketingPublicPlaylists] = useState([]);
    const [marketingPrivatePlaylists, setMarketingPrivatePlaylists] = useState([]);
        
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // for category modal
    const [categoryId, setCategoryId] = useState('');
    const [categoryTitle, setCategoryTitle] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryThumb, setCategoryThumb] = useState(null);
    const [categoryPublicPlaylist, setCategoryPublicPlaylist] = useState();
    const [categoryPrivatePlaylists, setCategoryPrivatePlaylists] = useState([]);

    useEffect(() => {
        if (!isLoaded) {
            getAllCategory();
            getAllPlaylists();
            setIsLoaded(true)
        }
    })
    
    const getAllCategory = () => {
        CategoryService.getAllCategory()
            .then(result => {
                setRows(result.data)
                setData(result.data)
            })
    }

    const getAllPlaylists = () => {
        PlaylistService.getAllPlaylist()
            .then(async response => {
                if (response.data && response.data.length > 0) {
                    let privatePlaylists = [];
                    let publicPlaylists = [];
                    response.data.map(item => {
                        if( item.type == 'marketing') {
                            let obj = {id: item.id, name: item.playlist_title};
                            item.playlist_status == 0 && privatePlaylists.push(obj) || publicPlaylists.push(obj);
                        }
                    })

                    setMarketingPublicPlaylists(publicPlaylists);
                    setMarketingPrivatePlaylists(privatePlaylists);
                }
            })
    }

    const resetCategoryData = () => {
        setCategoryId('');
        setCategoryTitle('');
        setCategoryDescription('');
        setCategoryThumb(null);
        setCategoryPublicPlaylist();
        setCategoryPrivatePlaylists([]);
    }

    const updateCategoryPublicPlaylist = (id, value) => {
        if( value )
            setCategoryPublicPlaylist(value)
        else
            setCategoryPublicPlaylist()
    }

    const updateCategoryPrivatePlaylists = (id, value) => {
        setCategoryPrivatePlaylists(value)
    }

    const saveCategory = async () => {
        setRows([])
        setData([])

        let thumb = '';
        if( categoryThumb ) {
            thumb = await CategoryService.uploadThumbnail(categoryThumb);
        }

        let playlists = [];
        if( categoryPublicPlaylist > 0 )
            playlists = [categoryPublicPlaylist, ...categoryPrivatePlaylists];
        else
            playlists = [...categoryPrivatePlaylists];

        if( categoryId ) {
            await CategoryService.updateCategory(categoryId, categoryTitle, categoryDescription, thumb, playlists)
        } else {
            await CategoryService.addCategory(categoryTitle, categoryDescription, thumb, playlists)
        }

        setShowCategoryModal(false)
        resetCategoryData()
        getAllCategory()
    }

    const editCategory = (id) => {
        resetCategoryData()

        const category = rows.filter(item => item.category_id == id)[0];
        
        setCategoryId(category.category_id);
        setCategoryTitle(category.title);
        setCategoryDescription(category.description);
        setCategoryThumb(null);
        setCategoryPublicPlaylist(category.public_playlists && category.public_playlists.length && category.public_playlists[0]);
        setCategoryPrivatePlaylists(category.private_playlists);

        setShowCategoryModal(true)
    }

    const removeCategory = (id) => {
        setRows([])
        setData([])
        
        CategoryService.removeCategory(id)
        .then(response => {
            if( response.data.message == 'success')
                getAllCategory()
        }).catch((err) => {
            const resMessage = (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) || err.toString();
            console.log(resMessage);
        });
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let arr = [...data];
            arr = arr.filter(item => (item.title).includes(e.target.value.trim().toLowerCase()) || (item.description).includes(e.target.value.trim().toLowerCase()) );
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
        <>
            {errorText &&
                <h5 className="alert alert-danger" style={{position: 'absolute', bottom: 50, right: 50, padding: 40}}>{errorText}</h5>
            }
            <Row className='mt-5'>
                <Col md={9}>
                <Button size='sm' onClick={() => { resetCategoryData(); setShowCategoryModal(true); }}>
                    Add Category
                </Button>
                </Col>
                <Col md={3}>
                <TextField
                    className={classes.pasteTextField}
                    id="input-with-icon-textfield"
                    placeholder="Search token code"
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
                                    {row.thumb_image && <img src={row.thumb_image} width="100%" style={{objectFit: 'cover'}} /> }
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.title}
                                </TableCell>
                                <TableCell style={{ width: 200 }} align="center">
                                    {row.description}
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.public_playlists.length}
                                </TableCell>
                                <TableCell style={{ width: 150 }} align="center">
                                    {row.private_playlists.length}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="center">
                                    <Button size='sm' variant='primary' block onClick={() => editCategory(row.category_id)}>Edit</Button>
                                    <Button size='sm' variant='danger' block onClick={() => removeCategory(row.category_id)}>Delete</Button>
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
            
            <CategoryModal
                show={showCategoryModal}
                onHide={() => setShowCategoryModal(false)}
                id={ categoryId }
                title={ categoryTitle }
                description={ categoryDescription }
                categoryPublicPlaylist={ categoryPublicPlaylist }
                categoryPrivatePlaylists={ categoryPrivatePlaylists }
                publicPlaylists={ marketingPublicPlaylists }
                privatePlaylists={ marketingPrivatePlaylists }
                onSave={saveCategory}
                setCategoryTitle={setCategoryTitle}
                setCategoryDescription={setCategoryDescription}
                setCategoryThumb={setCategoryThumb}
                updateCategoryPublicPlaylist={updateCategoryPublicPlaylist}
                updateCategoryPrivatePlaylists={updateCategoryPrivatePlaylists}
            />
        </>
    );
}