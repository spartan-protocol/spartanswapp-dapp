import { Container } from '../layout/theme/components'
import SVGArrowDown from '../../assets/svg/SVGArrowDown'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { MenuOutlined, } from '@ant-design/icons'
import { SPARTA_ADDR, BNB_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getTokenData, getPoolsData, getListedTokens, getListedPools, getPoolsContract, getRouterContract, ROUTER_ADDR, getWalletData, getPool, getPoolData } from '../../client/web3'
import { Input, Dropdown, notification } from 'antd';
import { bn, formatBN, convertFromWei, convertToWei, one } from '../../utils'
import { getSwapOutput, getSwapSlip, getSwapFee } from '../../math'
import { Center, Button, H1, H2, LabelWhite, P, message, openNotification } from '../components/elements';
import 'antd/dist/antd.css'
import { openBar } from '../layout/TokenSidebar'

//import { openAddress, AddressModal, closeAddress } from '../layout/AddressModal'
//import '../../App.css'

//const { TabPane } = Tabs;
var utils = require('ethers').utils;

const SimpleSwap = (props) => {

    const context = useContext(Context)
    const [message, setMessage] = useState()

    const [AddressFrom, setAssetFrom] = useState(SPARTA_ADDR);
    const [AddressTo, setAssetTo] = useState(BNB_ADDR);
    const [inputAmount, setinputAmount] = useState('0')

    const [swapData, setSwapData] = useState({
        'address': BNB_ADDR,
        'balance': 0,
        'input': 0,
        'inputSymbol': 'XXX',
        'output': 0,
        'outputSymbol': 'XXX',
        'slip': 0
    })


    const [pool, setPool] = useState({
        'symbol': 'XXX',
        'name': 'XXX',
        'address': BNB_ADDR,
        'price': 0,
        'volume': 0,
        'baseAmt': 0,
        'token': 0,
        'depth': 0,
        'txCount': 0,
        'apy': 0,
        'units': 0,
        'fees': 0
    })

    /*___________________Token Data_____________________________ */

    const [inputTokenData, setInputTokenData] = useState({
        'symbol': 'SPARTA',
        'name': 'SPARTAN PROTOCOL TOKEN',
        'balance': 0,
        'address': SPARTA_ADDR
    })
    const [outputTokenData, setOutputTokenData] = useState({
        'symbol': 'BNB',
        'name': 'BINANCE CHAIN TOKEN',
        'balance': 0,
        'address': BNB_ADDR
    })
    /*_________________________________________________________________*/

    const [approval, setApproval] = useState(false)
    const [startTx, setStartTx] = useState(false);
    const [endTx, setEndTx] = useState(false);

    useEffect(() => {
        if (context.connected) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context.connected])

    /* _________________________________FUNCTIONS_______________________________________________________ */


    const getData = async () => {
        let tokenDetails = await getTokenData(AddressFrom, context.walletData)
        setInputTokenData(tokenDetails)
        let tokenArray = await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })
        let poolArray = await getListedPools()
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': await getPoolsData(tokenArray) })
        setPool(getPoolData(AddressTo, context.poolsData))
        setSwapData(await getSwapData(inputTokenData.balance, inputTokenData, outputTokenData, pool))
    }

    const getSwapData = async (inputAmount, inputTokenData, outputTokenData, pool) => {

        var output, slip
        //console.log(formatBN(inputAmount))
        output = getSwapOutput(inputAmount, pool, false)
        slip = getSwapSlip(inputAmount, pool, false)

        const swapData = {
            address: pool.address,
            balance: inputTokenData.balance,
            input: formatBN(bn(inputAmount), 0),
            inputSymbol: inputTokenData.symbol,
            output: formatBN(output, 0),
            outputSymbol: outputTokenData.symbol,
            slip: formatBN(slip)
        }
        console.log(swapData)
        return swapData
    }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
        if (+approval > 0) {
            setApproval(true)
        }
    }

    /* ______________________________________________INPUTS __________________________________________________________ */

    const onInputChange = async (e) => {
        try {
            setApproval(false)
            setAssetFrom(e)
            let token = await getTokenData(e, context.walletData)
            console.log(token)
            setInputTokenData(token)
            checkApproval(AddressFrom)
            setSwapData(await getSwapData(inputAmount, e, outputTokenData, pool))
        }
        catch (err) {
            console.log(err)
        }
    }

    const onInputAmountChange = async (e) => {
        try {
            setinputAmount(e)
            setSwapData(await getSwapData(convertToWei(e), inputTokenData, outputTokenData, pool))
        }
        catch (err) {
            console.log(err)
        }
    }

    /*________________________________________________OUTPUTS_________________________________________________________*/

    const onOutputChange = async (e) => {
        try {
            setAssetTo(e)
            let token = await getTokenData(e, context.walletData)
            setOutputTokenData(token)
            let _pool = await getPool(AddressTo)
            setPool(_pool)
            setSwapData(await getSwapData(inputAmount, inputTokenData, e, _pool))
        }
        catch (err) {
            console.log(err)
        }
    }
    /* ______________________________________________STEPS TO SWAP_____________________________________________________ */

    /* Step 1 */
    const approve = async () => {
        checkApproval(AddressTo)
        const contract = getTokenContract(AddressFrom)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        //message.success(`Transaction Sent!`, 2);
    }

    /* Step 2 */
    /* to send to self*/
    const swap = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        let amount = convertToWei(inputAmount)
        //console.log(swapInfo)

        await contract.methods.swap(amount, AddressFrom, AddressTo).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
        })
        //message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        await getData()
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }
    /* __________________________________________________________________________________________________ */


    const setMaxBalance = () => {
        let maxBalance = inputTokenData.balance
        onInputAmountChange(maxBalance)
    }

    return (
        <div>
            <div className='outerContainer'>
                <Container>
                    <br />
                    <div className='centerObject2'>
                        <H1>Swap</H1>
                        {!context.connected &&
                            <>
                                <br />
                                <p>Connecting Metamask...</p>
                                <p>Ensure your Metamask is connected to the BSC Mainnet to use this application</p>
                                <p>If it taking a while, Try refreshing the page</p>
                                <br />
                                <img src="favicon.png" height='70' width="70" />
                            </>
                        }
                    </div>
                    {context.connected && <>
                        <div className='container2'>
                            <Center>
                                <Container>
                                    < br />
                                    <H2>Input</H2>
                                    <div>
                                        <Input
                                            onChange={(e) => onInputChange(e.target.value)}
                                            placeholder={'Enter BEP2E Asset Address'}
                                            style={{ width: 400 }}></Input>
                                        <Button style={{ width: 60 }} onClick={openBar}><MenuOutlined /></Button>
                                        < br />
                                        <Input
                                            placeholder={'0.0'}
                                            onChange={(e) => onInputAmountChange(e.target.value)}
                                            style={{ width: 400 }}>
                                        </Input><Button style={{ width: 60 }} onClick={setMaxBalance}>{'Max'}</Button>
                                        < br />
                                        <P>Balance: {convertFromWei(inputTokenData.balance)} &nbsp; {inputTokenData.symbol}</P>
                                        < br />
                                    </div>
                                </Container>
                            </Center>
                        </div>
                        <div className='arrow'>
                            <SVGArrowDown />
                        </div>
                    </>}
                    <br />
                    {context.connected && <>
                        <div className='container2'>
                            <Center>
                                <Container>
                                    < br />
                                    <H2>Output</H2><br />
                                    <div>
                                        <Input
                                            placeholder={'Enter BEP2E Asset Address'}
                                            onChange={(e) => onOutputChange(e.target.value)}
                                            style={{ width: 400 }}></Input>
                                        <Button style={{ width: 60 }} onClick={openBar}><MenuOutlined /></Button>
                                        < br />
                                        <P>Output: </P>
                                        <P>Slippage: </P>
                                        <P>Fee: </P>
                                    </div>
                                </Container>
                            </Center>
                        </div>
                    </>}
                </Container>

                <div className='centerObject2'>

                    <br />
                    {!context.connected &&
                        <p> </p>}
                    {
                        !approval && context.connected &&
                        <Button style={{ width: 150 }} onClick={approve}>APPROVE</Button>
                    }
                    {
                        approval && !startTx &&
                        <Button style={{ width: 150 }} onClick={swap}>UPGRADE</Button>
                    }
                    {
                        approval && startTx && !endTx &&
                        <Button style={{ width: 150 }} onClick={swap}>UPGRADE</Button>
                    }
                    <br /><br />
                </div>
            </div>
            <br /><br /><br />
        </div>
    )
}
export default SimpleSwap