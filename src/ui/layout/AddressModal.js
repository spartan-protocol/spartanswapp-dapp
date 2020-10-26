//import React, { useState, useEffect, useContext } from 'react'
//import ReactDOM from 'react-dom'
//import { Input, Tabs, Modal, Table, SearchTableInput } from 'antd'
//import { H1, H2, Center, HR, Button } from '../components/elements'
//import '../../App.css'
//import 'antd/dist/antd.css'
//import { Context } from '../../context'
//import { ModalTable } from '../components/common'
//import { white } from 'color-name';
//import { SearchOutlined } from '@ant-design/icons'

//const { TabPane } = Tabs;

//export function openAddress() {
//    document.getElementById("myModal").style.display = "block";
//}

//export function closeAddress() {
//    document.getElementById("myModal").style.display = "none";
//}


//export const AddressModal = (props) => {

//    const context = useContext(Context)

//    const [TokenSelect, setTokenSelect] = useState({
//        'symbol': '',
//        'address': ''
//    })
//    const [data, setData] = useState({
//        'symbol': 'XXX',
//        'name': 'XXX',
//        'address': '',
//        'price': 0,
//        'volume': 0,
//        'baseAmt': 0,
//        'token': 0,
//        'depth': 0,
//        'txCount': 0,
//        'apy': 0,
//        'units': 0,
//        'fees': 0
//    })


//    const returnSelected = (symbol, address) => {
//        var tokenSymbol, tokenAddress
//        setTokenSelect(tokenSymbol, tokenAddress)
//        console.log(tokenSymbol, tokenAddress)
//        new sendToMain()
//    }
    
//    class sendToMain extends React.Component {

//        sendData = () => {
//            this.props.callback(TokenSelect)
//        }

//        render() {
//            return ('')
//        }
//    }

//    const TokenTable = () => {

//        const check = (e) => {
//            if (e.length === 0 || e === null) {
//                return context.poolsData
//                console.log(context.poolsData)
//            }
//            else {
//                var pools = context.poolsData
//                for (let i = 0; i < pools.length; i++) {
//                    if (e.toUpperCase() === pools[i].symbol) {
//                        var match = pools[i]
//                    }
//                }
//            }
//        }
//        const columns = [
//            {
//                render: (record) => (
//                    <Button onClick={event => returnSelected(record.address, record.symbol)}>
//                        <ModalTable
//                            address={record.address}
//                            symbol={record.symbol}
//                            size={35} />
//                    </Button>
//                )
//            }
//        ]
//        return (
//            <div>
//                <div>
//                    <Input
//                        id="search_input"
//                        placeholder={'Enter a token symbol'}
//                        onChange={e => check(e.target.value)}
//                        value = ''
//                    /> <Button><SearchOutlined /></Button></div>
//                <br /><br />
//                <HR></HR>
//                <Table
//                    dataSource={context.poolsData}
//                    showHeader={false}
//                    pagination={false}
//                    columns={columns}
//                    rowKey="symbol"
//                />
//            </div>
//        )
//    }

//    return (
//        <div id="myModal" class="modal">
//            <div class="modal-content">
//                <Button onClick={closeAddress}>&times;</Button><br />
//                <br />
//                <TokenTable />
//            </div>
//        </div>
//    )
//}


//export default AddressModal

