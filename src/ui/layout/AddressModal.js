import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Button, Input, Tabs, Modal } from 'antd'
import { H1, H2, Center } from '../components/elements'
//import '../../App.css'
import 'antd/dist/antd.css'
import { getListedTokens, getAlltokens, getTokenData } from '../../client/web3';

//const { TabPane } = Tabs;

//function callback(key) {
//    console.log(key);
//}

//export const checkSymbol = (e) => {
//    let listedTokens = getListedTokens()
//    let tokensData = getTokenData(listedTokens)
//}

//export const AddressModal = (props) => {

//    return (
//        <div id="myModal" class="modal">
//            <div class="modal-content">
//                <Button onclick={closeAddress}>&times;</Button><br />
//                <br />
//                <H2>Tokens</H2>
//                <br />
//                <Tabs defaultActiveKey="1" onChange={callback} centered type="line">
//                    <TabPane tab="INPUT" key="1">
//                        <div>
//                            <Input placeholder={'Enter a token symbol'} onChange={(e) => checkSymbol(e)}></Input>
//                        </div>
//                    </TabPane>
//                    <TabPane tab="OUTPUT" key="2">
//                        <p>tab2</p>
//                    </TabPane>
//                </Tabs>
//            </div>
//        </div>
//    )
//}

//export function openAddress() {
//    document.getElementById("myModal").style.display = "block";
//}

//export function closeAddress() {
//    document.getElementById("myModal").style.display = "none";
//}

export function showModal(e) {
    this.setState({ visable: true })
}
export function handleCancel(e) {
    this.setState({ visable: false })
}

class tokenModal extends React.Component {
    state = { visible: false };


    render() {
        return (<>               
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </>
        );
    }
}

ReactDOM.render(<tokenModal />, document.getElementById('container'));