import React from 'react';
import PPTService from '../../../services/ppt.service';
import Auth from "../../../services/auth.service";
import Alert from '@material-ui/lab/Alert';
import MButton from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import downloadFile from '../../../services/downloadfile'

import {
    Button,
} from 'react-bootstrap';

import GlobalData from '../../../tools/GlobalData';
import pptService from '../../../services/ppt.service';

const back_end_server = GlobalData.back_end_server_ip + ":" + GlobalData.back_end_server_port;

const EditPPT = (props) => {

    const [pptId, setPPTId] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [currentUser] = React.useState(Auth.getCurrentUser());
    const [pptHistory, setPPTHistory] = React.useState(undefined);
    const [fileName, setFileName] = React.useState('');
    const [lastId, setLastId] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    let history = useHistory();

    React.useEffect(() => {
        const iid = props.match.params.ppt_id;
        PPTService.getPPTHistory(iid).then(response => {
            setPPTHistory(response.data);
            setFileName(response.data[0].file_name)
        }).catch(err => {


        })
    }, [props]);

    React.useEffect(() => {
        if (pptHistory && pptHistory.length > 0) {
            const last_id = pptHistory[pptHistory.length - 1].ppt_id;
            setLastId(last_id);
            setPPTId(last_id);
            setIsLoading(false);
        }
    }, [pptHistory]);

    const handleAddNewSlide = () => {
        const payload = {
            pptId,
        }
        setIsLoading(true);
        PPTService.addNewSlidePPT(payload).then(response => {
            PPTService.getPPTHistory(response.data.pptId).then(response => {
                console.log(response.data);
                setPPTHistory(response.data);
            }).catch(err => {

            })
            setErrorMessage('');
        }).catch(err => {
            const resMessage = (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) || err.toString();
            setIsLoading(false);
            setErrorMessage(resMessage);
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        });
    }

    const onClickHistory = (id) => {
        console.log(id);
        setPPTId(id);
    }

    const handlePptDownload = (url, fileName) => {
        pptService.downloadpppt(url).then((res) => {
            console.log(res)
            downloadFile(res.data, fileName + '.pptx')
        }).catch((err) => {
            setIsLoading(false);
            err.response.data.text().then(res => {
                let eMessage = JSON.parse(res).message
                setErrorMessage(eMessage);
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            })
        })
    }



    return (
        <div className="container-fluid">
            {errorMessage && (
                <div>
                    <Alert
                        severity='error'
                        style={{ position: 'fixed', bottom: 50, right: 50, zIndex: 9999, padding: '20px 40px' }}
                        action={
                            <MButton
                                color="inherit" size="medium"
                                onClick={() => {
                                    history.push('/add_token_code');
                                }}
                            >
                                Take More Tokens
                        </MButton>
                        }
                    >
                        {errorMessage}
                    </Alert>

                </div>
            )}
            <div className="justify-content-center">
                <div className="float-lg-left float-md-left" style={{ width: "500px" }}>
                    <div className="mb-3">
                        <Button className="btn-circles mr-1" href='/manage_ppt/list'>
                            Go Back
                        </Button>
                        <button className="btn btn-primary mx-2" onClick={() => { handleAddNewSlide() }} disabled={lastId !== pptId || isLoading}>
                            {isLoading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Add New Slide</span>
                        </button>
                        <button className="btn btn-primary" onClick={() => handlePptDownload(`${back_end_server}/api/ppt/getPPTFile/${pptId}?user_id=${currentUser.user_id}&user_key=${currentUser.access_key}&type=download`, fileName)}
                        >Download</button>
                    </div>
                    <PPTHistory pptHistory={pptHistory} activePPTId={pptId} itemClick={onClickHistory} />
                </div>
            </div>
        </div>
    )
}

const PPTHistory = ({ pptHistory, activePPTId, itemClick }) => {

    return (
        <div className="list-group">
            {pptHistory && pptHistory.length > 0 && (
                pptHistory.map((ih, index) => (
                    <div className={ih.ppt_id === activePPTId ? "list-group-item cursor-pointer active" : "list-group-item cursor-pointer"} key={index} onClick={() => itemClick(ih.ppt_id)}>
                        <div>File Name : <span>{ih.file_name}</span></div>
                        <div>PPT Id: <span>{ih.ppt_id}</span></div>
                        <div>Source PPT: <span>{ih.source_ppt_id}</span></div>
                    </div>
                ))
            )}
        </div>
    )
}

export default EditPPT;
