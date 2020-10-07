import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from 'styled-components'
import { Layout } from 'antd';
import Headbar from './ui/components/Header/headerIndex'
import Footer from './ui/layout/Footer'
import SimpleSwap from './ui/pages/SimpleSwap'
import { ContextProvider } from './context'
import { Colour } from './ui/components/elements'

const { Content } = Layout;

const contentStyles = {
    background: Colour().black,
    color: '#0a0001',
    padding: 40
}


const App = () => {
    return (
        <Router>
            <div>
                <ContextProvider>
                    <Layout style={{ height: "100vh", background: Colour().black }}>
                        <Headbar />
                        <Content style={contentStyles}>                            
                                <Switch>
                                    <Route path="/" exact component={SimpleSwap} />
                                    <Route path="/swap" exact component={SimpleSwap} />
                                </Switch>
                        </Content> 
                        <Footer/>
                    </Layout>
                </ContextProvider>
            </div>
        </Router >
    );
}

export default App;

