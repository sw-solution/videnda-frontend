import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

const HomeLayout = (props)=>{
    return (
        <div className="app-container">
            {props.children}
        </div>
    )
}

export default HomeLayout;