import React, { useContext, useEffect, useState } from 'react'
import '../../App.css'
import { Context } from '../../context'
import { CoinRow } from '../components/common'
import { HR } from '../components/elements'
import { Table, Drawer, Divider } from 'antd'
import { getAssets, getTokenDetails, getListedTokens, getWalletData, getStakesData, getListedPools } from '../../client/web3'
import Web3 from 'web3'

export function openNav() {
    document.getElementById("mySidepanel").style.width = "370px";
}

export function closeNav() {
    document.getElementById("mySidepanel").style.width = "0";
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


    const AssetTable = () => {

        const context = useContext(Context)
        useEffect(() => {
            // updateWallet()

        }, [context.transaction])

        // const updateWallet = async () => {
        //     context.setContext({ walletData: await getWalletData(context.poolArray) })
        // }

        const columns = [
            {
                render: (record) => (
                    <div>                        
                        <CoinRow
                            symbol={record.symbol}
                            name={record.name}
                            balance={record.balance}
                            address={record.address}
                            size={35} />                                               
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

    return (
        <div id="mySidepanel" className="sidepanel">
            <div>
                <button className='closebtn' onClick={closeNav}>X</button>               
                <div className='centerObject2'>
                    <p>Tokens</p>
                    <h4>{connected && context.walletData.address}</h4>
                </div>               
                {connected && <AssetTable />}                 
            </div>
        </div>
    )
}

export default Sidebar


