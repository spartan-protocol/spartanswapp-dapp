import React from 'react'
import { Layout } from 'antd'
import { Colour } from '../components/elements'

const Footer = (props) => {

    const footerStyles = {
        // zIndex: 1,
         //position: "absolute",
        color: Colour().black,
        padding: "50px",
         marginTop: "50px",
        height: 200,
         //marginTop:"-0px",
        bottom: 0,
    }

    return (
        <div style={{ footerStyles }}>
            <div></div>
        </div>
    )
}

export default Footer