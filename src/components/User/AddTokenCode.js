import React from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import AppLayout from '../../layouts/App';

import TextField from '@material-ui/core/TextField';
import InsertEmoticon from '@material-ui/icons/InsertEmoticon';
import InputAdornment from '@material-ui/core/InputAdornment';

import { useHistory } from "react-router-dom";


import {
  Row,
  Col,
  Button,
} from 'react-bootstrap';


const AddTokenCode = () => {
  console.log( "AddTokenCode START");
  const [currentUser, setCurrentUser] = React.useState(undefined);
  const [message, setMessage] = React.useState('');
  const [tokenCode, setTokenCode] = React.useState('');
  const history = useHistory();
  const [mailSendError, setMailSendError] = React.useState(false);
  const [sending, setSending] = React.useState(false);

  console.log( "AddTokenCode get profile");
  React.useEffect(()=>{
    AuthService.getUserProfile()
    	.then((response)=>{
		  setCurrentUser(response);
    	})
    	.catch((err) => {
			const err_str = err.toString();
            const resMessage = "Please Login [" + err_str + "]";
            setMessage(resMessage);
            if( err_str.includes( "403"))
            	history.push('/signin');
            //setTimeout(() => {
            //  setMessage('');
            //}, 3000);
        });
  }, [])

  const resendVerifyEmail=()=>{
    setSending(true);
    AuthService.resendVerifyEmail().then((response)=>{
      setMailSendError(false);
      setSending(false);
      setMessage(response.data.message);
    }, error=>{
      const resMessage=(
          error.response &&
          error.response.data &&
          error.response.data.message
      ) || error.toString();
      setSending(false);
      setMessage(resMessage);
    });
  }

  console.log( "AddTokenCode add tokens");
  const handleAddTokens = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13 || e.target.innerText == 'Add Tokens') {
      UserService.addTokenCode(tokenCode)
        .then(response => {
          if (response.data.message === "success") {
              window.location.reload();
          }
        }).catch((err) => {
            const resMessage = (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) || err.toString();

            setMessage(resMessage);
            setTimeout(() => {
              setMessage('');
            }, 3000);
        });

      document.getElementById('input-with-icon-textfield').value = '';
      setTokenCode('');
    }
  }


  return (
    <AppLayout>

{currentUser && currentUser.accessToken ? (
          <>
            {
              currentUser.verified_email==="none"&&
              <>
         
              <div className={"alert alert-danger"}>
                  You need to verify your email. If you didn't receive the verify email, please click this{` `}
                  <button className="btn btn-primary btn-sm" onClick={resendVerifyEmail} disabled={sending}>
                    {sending && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Button</span></button> to resend the verify email.
                </div>                
              </>
              
            }             
            {
              message &&
              <div className={mailSendError ? "alert alert-danger" : "alert alert-danger"}>
                {message}
              </div>
            }    
          </>
        ):(
            <header className="jumbotron">
                <h3>
                  <strong>Please Login</strong>
                </h3>
            </header>
          )
        }

      <Row  className='mt-5'>
        <Col md={4}>
          <TextField
            style={{width: '100%'}}
            id="input-with-icon-textfield"
            placeholder="Input code"
            onChange={(e) => setTokenCode(e.target.value)}
            onKeyDown={handleAddTokens}
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InsertEmoticon />
                  </InputAdornment>
            ),
            }}
          />
        </Col>
        <Col md={8}>
          <Button size='sm' onClick={handleAddTokens}>
            Add Tokens
          </Button>
        </Col>
      </Row>
      <Row  className='mt-5'>
        <Col md={4}>
           <a href="https://exquisiteview.com/Tokens_c13.htm" target="_blank">Get More Tokens</a>
        </Col>
        <Col md={8}>
        </Col>
      </Row>

      { currentUser &&
        <header className="jumbotron mt-4">
          <h3 className='mb-4'><strong>{currentUser.username}</strong></h3>
          <p><strong>Current Tokens: </strong>{currentUser.nr_tokens}</p>
        </header>
      }

      { message &&
        <div className="alert alert-primary">
          {message}
        </div>
      }

    </AppLayout>
  );
};

export default AddTokenCode;