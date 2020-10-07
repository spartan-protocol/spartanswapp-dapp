import React, { useState, useEffect } from 'react'
import { Button, Input, Tabs, Modal } from 'antd'
import { H1, H2, Center } from '../components/elements'

//import '../../App.css'

import 'antd/dist/antd.css'
import { getListedTokens, getAlltokens, getTokenData } from '../../client/web3';

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

export const checkSymbol = (e) => {
    let listedTokens = getListedTokens()
    let tokensData = getTokenData(listedTokens)
    if (e === tokensData.symbol) {

    }
}

export const AddressModal = (props) => {

    function closeAddress() {
        document.getElementById("myModal").style.display = "none";
    }

    return (

        <div id="myModal" class="modal">
            <div class="modal-content">
                <Button onclick={closeAddress}>&times;</Button><br />
                <br />
                <H2>Tokens</H2>
                <br />
                <Tabs defaultActiveKey="1" onChange={callback} centered type="line">
                    <TabPane tab="INPUT" key="1">
                        <div>
                            <Input placeholder={'Enter a token symbol'} onChange={(e) => checkSymbol(e)}></Input>
                        </div>
                    </TabPane>
                    <TabPane tab="OUTPUT" key="2">
                        <p>tab2</p>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export function openAddress() {
    document.getElementById("myModal").style.display = "block";
}

export function closeAddress() {
    document.getElementById("myModal").style.display = "none";
}
