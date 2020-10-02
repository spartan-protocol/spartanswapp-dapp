import { Container } from '../layout/theme/components'
import SVGArrowDown from '../../assets/svg/SVGArrowDown'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { MenuOutlined } from '@ant-design/icons'
import { SPARTA_ADDR, BNB_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getTokenData, getPoolsData, getListedTokens, getListedPools, getPoolsContract, getRouterContract, ROUTER_ADDR, getWalletData, getPool } from '../../client/web3'
import { Input, Dropdown, message } from 'antd';
import { bn, formatBN, convertFromWei, convertToWei } from '../../utils'
import { getSwapOutput, getSwapSlip } from '../../math'
import { Center, Button, H1, H2, LabelWhite } from '../components/elements';
import 'antd/dist/antd.css'
import { openBar } from '../layout/TokenSidebar'
//import { openAddress, AddressModal, closeAddress } from '../layout/AddressModal'
//import '../../App.css'

//const { TabPane } = Tabs;
var utils = require('ethers').utils;

const SimpleSwap = (props) => {

    const context = useContext(Context)
    const [message, setMessage] = useState()

    const [tokenFrom, setAssetFrom] = useState(SPARTA_ADDR);
    const [tokenTo, setAssetTo] = useState(BNB_ADDR);
    const [inputAmount, setinputAmount] = useState('0')
    const [outputPool, setOutputPool] = useState({
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
    const [outTokenData, setOutTokenData] = useState({
        'symbol': 'BNB',
        'name': 'BINANCE CHAIN TOKEN',
        'balance': 0,
        'address': BNB_ADDR
    })

    const [approval, setApproval] = useState(false)


    const [tokenData, setTokenData] = useState({
        'symbol': 'SPARTA',
        'name': 'SPARTAN PROTOCOL TOKEN',
        'balance': 0,
        'address': SPARTA_ADDR
    })

    const [_swapData, setSwapData] = useState({
        address: SPARTA_ADDR,
        balance: 0,
        input: 0,
        symbol: "XXX",
        output: 0,
        outputSymbol: "XXX",
        slip: 0
    })

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
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
        let tokenArray = context.tokenArray ? context.tokenArray : await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })
        let poolData = context.poolsData ? context.poolsData : await getPoolsData(tokenArray)
        setOutputPool(poolData)
        context.setContext({ 'poolData': poolData })
        let listedPools = await getListedPools()
        console.log("Listed Pools " + listedPools)
        setSwapData(await getSwapData(inputAmount, tokenData, outTokenData, poolData))
    }

    const onSwapChange = async () => {
        setSwapData(await getSwapData(inputAmount, tokenData, outTokenData, outputPool))
    }

    const getSwapData = async (input, inputTokenData, outTokenData, poolData) => {

        var output; var slip
        output = getSwapOutput(input, poolData, false)
        slip = getSwapSlip(input, poolData, false)
        console.log(formatBN(output), formatBN(slip))

        const swapData = {
            address: poolData.address,
            balance: inputTokenData.balance,
            input: formatBN(bn(input), 0),
            inputSymbol: inputTokenData.symbol,
            output: formatBN(output, 0),
            outputSymbol: outTokenData.symbol,
            slip: formatBN(slip)
        }
        console.log(swapData)
        return swapData
    }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
        console.log(approval)
        if (+approval > 0) {
            setApproval(true)
        }
        else {
            setApproval(false)
        }
    }

    /* ______________________________________________INPUTS __________________________________________________________ */

    const onInputChange = async (e) => {
        setApproval(false)
        setAssetFrom(e)
        console.log(e)
        let token = await getTokenData(e, context.walletData)
        console.log(token)
        setTokenData(token)
        checkApproval(tokenFrom)
        onSwapChange()
    }

    const onInputAmountChange = async (e) => {
        setinputAmount(e)
        onSwapChange()
    }


    /*________________________________________________OUTPUTS_________________________________________________________*/


    const onOutputChange = async (e) => {
        setAssetTo(e)
        let token = await getTokenData(e, context.walletData)
        console.log(token)
        setOutTokenData(token)
        let pool = getPool(tokenTo)
        setOutputPool(pool)
        onSwapChange()
    }

    /* ______________________________________________STEPS TO SWAP_____________________________________________________ */


    /* Step 1 */
    const approve = async () => {
        checkApproval(tokenTo)
        const contract = getTokenContract(tokenFrom)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(ROUTER_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
    }

    /* Step 2 */
    /* to send to self*/
    const swap = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        let amount = convertToWei(inputAmount)
        console.log(_swapData)

        await contract.methods.swap(amount, tokenFrom, tokenTo).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
        })
        message.success(`Transaction Sent!`, 2);
        setStartTx(false)
        setEndTx(true)
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }
    /* __________________________________________________________________________________________________ */


    const Image = () => {
        return (
            <div>
                <br /><br /><br />
                <Center>
                    <img src='favicon.png' />
                    <br /><br />
                </Center>
                <div class='centerObject2'>
                    <H1>Swap</H1>
                </div>
            </div>
        )
    }

    const setMaxBalance = () => {
        let maxBalance = tokenData.balance
        onInputAmountChange(maxBalance)
    }

    return (
        <div>
            <Image />< br />< br />
            <div class='outerContainer'>
                <Container>
                    <div class='container2'>
                        <Center>
                            <Container>
                                < br />
                                <H2>Input</H2>
                                <div>
                                    <Input onChange={(e) => onInputChange(e.target.value)} placeholder={'Enter BEP2E Asset Address'} style={{ width: 350 }}></Input><Button style={{ width: 60 }} onClick={openBar}><MenuOutlined /></Button>
                                    < br />
                                    <Input placeholder={'0.0'} onChange={(e) => onInputAmountChange(e.target.value)} style={{ width: 350 }}></Input><Button style={{ width: 60 }} onClick={setMaxBalance}>{'Max'}</Button>
                                    < br />
                                    <LabelWhite>Balance: {convertFromWei(tokenData?.balance, { commify: true })}&nbsp; {tokenData.symbol}</LabelWhite>
                                    < br />
                                </div>
                            </Container>
                        </Center>
                    </div>
                    <div class='arrow'>
                        <SVGArrowDown />
                    </div>
                    <br />
                    <div class='container2'>
                        <Center>
                        <Container>
                                < br />
                                <H2>Output</H2><br />
                                <div>
                                    <Input placeholder={'Enter BEP2E Asset Address'} onChange={(e) => onOutputChange(e.target.value)} style={{ width: 350 }}></Input><Button style={{ width: 60 }} onClick={openBar}><MenuOutlined /></Button>
                                < br />< br />
                                    <LabelWhite>Output: {/*utils.formatEther(swapData.output, { commify: true })*/}{outTokenData.symbol}</LabelWhite>
                                    <br />
                                    <LabelWhite>Slippage: {_swapData.slip}%</LabelWhite>
                                    <br />
                                </div>                            
                            </Container>
                        </Center>
                    </div>
                    
                </Container>
                <br />
                <div class='centerObject2'>
                    {!context.connected &&
                        <p> Please Wait for Metamask to connect</p>}
                    {
                        !approval && context.connected &&
                        <Button style={{ width: 200}} onClick={approve}>APPROVE</Button>
                    }
                    {
                        approval && !startTx &&
                        <Button onClick={swap}>UPGRADE</Button>
                    }
                    {
                        approval && startTx && !endTx &&
                        <Button onClick={swap}>UPGRADE</Button>
                    }
                </div>
            </div>
            <br /><br /><br /><br /><br />
        </div>
    )
}
export default SimpleSwap