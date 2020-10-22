import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import { Input, Tabs, Modal, Table, SearchTableInput } from 'antd'
import { H1, H2, Center, HR, Button } from '../components/elements'
//import '../../App.css'
import 'antd/dist/antd.css'
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

export const TokenTable = (props) => {
    const context = useContext(Context)

    //const filterTokens = (e) => {
    //    let upperSearch = e.toUpperCase()
    //    console.log(upperSearch)
    //}

    function onClick() {
        
    }

    const columns = [
        {
            render: (record) => (
               
                    <ModalTable
                        address={record.address}
                        symbol={record.symbol}
                        size={35} 
                    />
               
            )
        }
    ]
    return (
        <div>
            <div class="search_box">
                <Input id="search_input" placeholder={'Enter a token symbol'} onChange={'' /*\(e) => filterTokens(e.target.value)*/}></Input>
            </div>
            <br /><br />
            <HR></HR>
            <Table
                dataSource={context.poolsData}
                showHeader={false}
                pagination={false}
                columns={columns}
                rowKey="symbol"
            />
        </div>
    )
}

export const AddressModal = (props) => {
    const context = useContext(Context)
    
    return (
        <div id="myModal" class="modal">
            <div class="modal-content">
                <Button onClick={closeAddress}>&times;</Button><br />
                <br />
                <TokenTable />
            </div>
        </div>
    )
}



export default AddressModal