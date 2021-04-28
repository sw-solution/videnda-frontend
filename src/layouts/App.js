import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

const HomeLayout = (props)=>{
    return (
        <div className="container app-container mt-3">
            {props.children}
        </div>
    )
}

export default HomeLayout;