import React from 'react';


export default function Card(props) {
  return (
    <img 
    onClick={props.myClick}
    src={props.src}
    alt="Responsive image"
    width='75px'
    className='mx-1'
    />
  )
}
