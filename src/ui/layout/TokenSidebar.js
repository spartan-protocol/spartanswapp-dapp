import { Table, Tabs } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import '../../App.css';
import { getAssets, getListedPools, getListedTokens, getStakesData, getTokenDetails, getWalletData } from '../../client/web3';
import { Context } from '../../context';
import { TokenSidebar } from '../components/common';
import { H1, H3 } from '../components/elements';
import '../components/StyleSheets/Sidebar2.css';


const { TabPane } = Tabs;

export function openBar() {
    document.getElementById("TokenSidepanel").style.width = "370px";
}

export function closeBar() {
    document.getElementById("TokenSidepanel").style.width = "0";
}

function callback(key) {
    console.log(key);
}

const Sidebar = (props) => {

    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        connectWallet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        setConnecting(true)
        window.web3 = new Web3(window.ethereum);
        const account = (await window.web3.eth.getAccounts())[0];
        if (account) {
            // message.loading('Loading tokens', 3);
            let assetArray = context.assetArray ? context.assetArray : await getAssets()
            context.setContext({ 'assetArray': assetArray })
            //let assetDetailsArray = context.assetDetailsArray ? context.assetDetailsArray : await getTokenDetails(account, assetArray)
            //context.setContext({ 'assetDetailsArray': assetDetailsArray })

            let tokenArray = context.tokenArray ? context.tokenArray : await getListedTokens()
            context.setContext({ 'tokenArray': tokenArray })
            // context.setContext({ 'poolsData': await getPoolsData(tokenArray) })

            let allTokens = assetArray.concat(tokenArray)
            var sortedTokens = [...new Set(allTokens)].sort()

            let tokenDetailsArray = context.tokenDetailsArray ? context.tokenDetailsArray : await getTokenDetails(account, sortedTokens)
            context.setContext({ 'tokenDetailsArray': tokenDetailsArray })

            //message.loading('Loading wallet data', 3);
            let walletData = await getWalletData(account, tokenDetailsArray)
            context.setContext({ 'walletData': walletData })
            console.log(walletData)

            let poolArray = context.poolArray ? context.poolArray : await getListedPools()
            context.setContext({ 'poolArray': poolArray })

            let stakesData = context.stakesData ? context.stakesData : await getStakesData(account, tokenArray)
            context.setContext({ 'stakesData': stakesData })

            context.setContext({ 'connected': true })
            await getSpartaPrice()
            setConnecting(false)
            setConnected(true)
            //message.success('Loaded!', 2);
        } else {
            await ethEnabled()
            setConnected(false)
        }
    }

    const ethEnabled = () => {
        console.log('connecting')
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            setConnecting(true)
            return true;
        }
        return false;
    }


    const getSpartaPrice = async () => {
        // let resp = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=spartan&vs_currencies=usd')
        // console.log(resp.data.spartan.usd)
        // context.setContext({ 'spartanPrice': resp.data.spartan.usd })
        context.setContext({ 'spartanPrice': 0.3 })
        return
    }


    const InputTable = () => {
        const context = useContext(Context)
        useEffect(() => {
            // updateWallet()

        }, [context.transaction])

        const columns = [
            {
                render: (record) => (
                    <div>
                        <TokenSidebar
                            symbol={record.symbol}
                            address={record.address}
                            size={30} />
                    </div>
                )
            }
        ]

        return (
            <div>
                <Table
                    dataSource={context.walletData.tokens}
                    showHeader={false}
                    pagination={false}
                    columns={columns}
                    rowKey="symbol" />
            </div>
        )
    }

    const OutputTable = () => {
        const context = useContext(Context)

        useEffect(() => {
            // updateWallet()

        }, [context.transaction])

        const columns = [
            {
                render: (record) => (
                    <div>
                        <TokenSidebar
                            symbol={record.symbol}
                            address={record.address}
                            name={record.name}
                            size={30} />
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

    const Content = () => {
        return (
            <div>
                <H1>Transaction Summary</H1>
                <H3>Input</H3>
                <p>Token: </p>
                <p>Amount: </p>
                <br />
                <p>Output</p>
                <p>Token: </p>
                <p>Amount </p>
            </div>
        )
    }

    return (
        <div id="TokenSidepanel" className="sidepanel2">
            <div>
                <button className='closebtn' onClick={closeBar}>X</button>
                <div className='centerObject2'>
                    <p>Avaliable Tokens</p>
                    <Tabs defaultActiveKey="1" onChange={callback} centered="true" type="line" size="large">
                        <TabPane tab="INPUT" key="1">
                            <div>
                                {connected && <InputTable />}
                            </div>
                        </TabPane>
                        <TabPane tab="OUTPUT" key="2">
                            <div>
                                {connected && <OutputTable />}
                            </div>
                        </TabPane>                        
                    </Tabs>
                </div>

            </div>
        </div>
    )
}

export default Sidebar


