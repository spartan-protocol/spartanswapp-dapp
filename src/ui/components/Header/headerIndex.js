import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../../context'
import { Layout, message } from 'antd';
import Web3 from 'web3'
import { getAddressShort, } from '../../../utils'
import { getAssets, getTokenDetails, getListedTokens, getWalletData, getStakesData, getListedPools, getPoolsData} from '../../../client/web3'
import { HeaderFrame, MigrateBannerLarge, HeaderElement, HeaderSpan } from '../StyleSheets/headerStyles'
import '../../../App.css'
import Sidebar, { openNav, closeNav } from '../../layout/Sidebar'
import TokenSidebar, { openBar, closeBar } from '../../layout/TokenSidebar'
import AddressModal from '../../layout/AddressModal'
import { CheckOutlined } from '@ant-design/icons'
import { Button } from '../elements'

const { Header } = Layout;

const Headbar = (props) => {

    const context = useContext(Context)
    const [connecting, setConnecting] = useState(false)
    const [connected, setConnected] = useState(false)
  
    useEffect(() => {
        connectWallet()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const connectWallet = async () => {
        setConnecting(true)
        window.web3 = new Web3(window.ethereum);
        const account = (await window.web3.eth.getAccounts())[0];
        if (account) {
            //message.loading('Loading tokens', 3);
            let assetArray = context.assetArray ? context.assetArray : await getAssets()
            context.setContext({ 'assetArray': assetArray })
            //let assetDetailsArray = context.assetDetailsArray ? context.assetDetailsArray : await getTokenDetails(account, assetArray)
            //context.setContext({ 'assetDetailsArray': assetDetailsArray })

            let tokenArray = context.tokenArray ? context.tokenArray : await getListedTokens()
            context.setContext({ 'tokenArray': tokenArray })

            let poolsData = context.poolsData ? context.poolsData : await getPoolsData(tokenArray)
            context.setContext({ 'poolsData': poolsData })

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

    const addr = () => {
        return getAddressShort(context.walletData?.address)
    }     



    return (
        <div>
            <HeaderFrame>
                <MigrateBannerLarge>
                    <HeaderSpan>
                        <HeaderElement>
                            <span>
                                <img src='spartan-logo.png' width='250' height='40'></img>
                            </span>
                        </HeaderElement>
                        <HeaderElement>
                            {!connected && !connecting &&
                                <Button type={'wallet'} style={{width: 150}}onClick={connectWallet}>CONNECT</Button>
                            }
                            {connecting &&
                                <Button type={'wallet'} style={{ width: 150 }}>CONNECTING</Button>
                            }   
                            {connected &&
                                <Button type={'wallet'} style={{ width: 150 }} onClick={openNav}><CheckOutlined /> &nbsp;{addr()}</Button>
                            }
                        </HeaderElement>
                    </HeaderSpan>
                </MigrateBannerLarge>
            </HeaderFrame>
            <Sidebar />
            <TokenSidebar />
            <AddressModal />
        </div>
    )
}

export default Headbar




