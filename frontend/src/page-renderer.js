import React, {Suspense} from 'react';
import {useParams} from 'react-router-dom';

const generatePage= (page)=>{
    const Component= React.lazy(()=> import(`./pages/${page}`));
    return (
        <Suspense fallback={<div>Loading...</div>}>
        {Component && <Component />} 
        </Suspense>
      );
}

export default function PageRenderer(){
    const { page } = useParams();
    let pageName = `${page}`;

  return generatePage(pageName);
}