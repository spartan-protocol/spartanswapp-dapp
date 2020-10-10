import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import { Button, Input, Tabs, Modal, Table } from 'antd'
import { H1, H2, Center, HR } from '../components/elements'
//import '../../App.css'
import 'antd/dist/antd.css'
import { getListedTokens, getAlltokens, getTokenData, getListedPools, getPoolsData } from '../../client/web3';
import { Context } from '../../context'
import { ModalTable } from '../components/common'

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
}

export function openAddress() {
    document.getElementById("myModal").style.display = "block";
}

export function closeAddress() {
    document.getElementById("myModal").style.display = "none";
}


const TokenTable = () => {
    const context = useContext(Context)

    useEffect(() => {
        // updateWallet()

    }, [context.transaction])

    const columns = [
        {
            render: (record) => (
                <div>
                    <ModalTable
                        symbol={record.symbol}
                        size={35} />
                </div>
            )
        }
    ]

    return (
        <div>
            <Table
                dataSource={context.poolsData}
                showHeader={false}
                pagination={false}
                columns={columns}
                rowKey="symbol" />
        </div>
    )
}


export const AddressModal = (props) => {

    return (
        <div id="myModal" class="modal">
            <div class="modal-content">
                <Button onclick={closeAddress}>&times;</Button><br />
                <br />
                <H2>Tokens</H2>
                <br />
                <Input placeholder={'Enter a token symbol'} onChange={''}></Input>
                <br /><br />
                <HR></HR>
                <TokenTable />
            </div>
        </div>
    )
}

export default AddressModal
