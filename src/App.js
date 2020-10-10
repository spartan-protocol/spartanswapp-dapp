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

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100vh;
`
const Body = styled.div`
  width: 60%;
  margin: auto; 
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`
/*This is the page background color*/
const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  overflow: auto;
  min-height: 10vh;
  background-position: 0px 0vh;
  background-color: #2e3338;
  background-repeat: no-repeat;
}
`
const App = () => {
    return (
        <Router>
            <div>
                <ContextProvider>
                    <AppWrapper>
                        <HeaderWrapper>
                            <Headbar />
                        </HeaderWrapper>
                        <BodyWrapper>
                            <Body>
                                <Switch>
                                    <Route path="/" exact component={SimpleSwap} />
                                    <Route path="/swap" exact component={SimpleSwap} />
                                </Switch>
                            </Body>
                        </BodyWrapper>
                    </AppWrapper>
                </ContextProvider>
            </div>
        </Router>
    );
}

export default App;

