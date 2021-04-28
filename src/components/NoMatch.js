import React from 'react';
import AppLayout from '../layouts/App';

const NoMatch = ()=>{
    return <AppLayout>
        
        <header className="jumbotron">
            <h1><strong>404</strong></h1>
            <h3>Page Not Found!</h3>
        </header>        
    </AppLayout>
}

export default NoMatch;