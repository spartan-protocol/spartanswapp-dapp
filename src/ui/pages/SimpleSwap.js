import { Container } from '../layout/theme/components'
import SVGArrowDown from '../../assets/svg/SVGArrowDown'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { SPARTA_ADDR, BNB_ADDR, getSpartaContract, getTokenContract, getTokenDetails, getTokenData, getPoolsData, getListedTokens, getListedPools, getPoolsContract, getRouterContract, ROUTER_ADDR } from '../../client/web3'
import { message, Input } from 'antd';
import { bn, formatBN, convertFromWei, convertToWei, formatUSD } from '../../utils'
import { getSwapOutput, getSwapSlip } from '../../math'
import { Center } from '../components/elements';



//const { TabPane } = Tabs;
var utils = require('ethers').utils;

const SimpleSwap = (props) => {

    const context = useContext(Context)
    const [message, setMessage] = useState()

    const [tokenFrom, setAssetFrom] = useState(SPARTA_ADDR);
    const [tokenAmount, setTokenAmount] = useState('0')
    const [tokenTo, setAssetTo] = useState(BNB_ADDR);
    const [approval, setApproval] = useState(false)
    const [tokenData, setTokenData] = useState({
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

    const [swapData, setSwapData] = useState({
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


    const getData = async () => {
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
        let poolData = context.poolsData ? context.poolsData : await getPoolsData(tokenArray)
        context.setContext({ 'poolData': poolData })
        let poolArray = await getListedPools()
        context.setContext({ 'poolArray': poolArray })
        let tokenArray = context.tokenArray ? context.tokenArray : await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })

        setSwapData(getSwapData(tokenAmount, tokenData, outputTokenData, context.poolsData))
    }


    const changeToken = async (e) => {
        setAssetFrom(e.target.value)
        setApproval(false)
        checkApproval(e.target.value)
        let tokenDetails = await getTokenData(tokenFrom, context.walletData)
        setTokenData(tokenDetails)
        setSwapData(getSwapData(tokenAmount, tokenData, outputTokenData, context.poolsData))
        console.log(swapData)
        return
    }

    const changeOutputToken = async (e) => {
        setAssetTo(e.target.value)
        let outputToken = await getTokenData(tokenTo, context.walletData)
        setOutputTokenData(outputToken)
        return
    }

    const getSwapData = async (input, inputTokenData, outputTokenData, poolData) => {

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
            outputSymbol: outputTokenData.symbol,
            slip: formatBN(slip)
        }
        console.log(swapData)
        return swapData
    }

    const checkApproval = async (address) => {
        const contract = getTokenContract(address)
        const approval = await contract.methods.allowance(context.walletData.address, SPARTA_ADDR).call()
        console.log(approval)
        if (+approval > 0) {
            setApproval(true)
        }
    }

    const setToken = (e) => {
        setTokenAmount(e.target.value)
    }

    /* __________________________________________________________________________________________________ */

    /* Step 1 */
    const unlock = async () => {
        let spartaContract = getSpartaContract()
        await spartaContract.methods.transferFrom(context.walletData.address, tokenAmount).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
    }

    /* Step 2 */
    const approve = async () => {
        const contract = getTokenContract(tokenFrom)
        const supply = await contract.methods.totalSupply().call()
        await contract.methods.approve(SPARTA_ADDR, supply).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
        })
        message.success(`Transaction Sent!`, 2);
    }

    /* Step 3 */
    const swap = async () => {
        setStartTx(true)
        let routerContract = getRouterContract()
        await routerContract.methods.swapTo(swapData.input, tokenFrom, tokenTo).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: ''
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
                    <h1>Swap</h1>
                </div>
            </div>
        )
    }

    return (

        <div>
            <Image />
            <div class='outerContainer'>
                <Container>
                    <div class='container2'>
                        <div class='centerObject2'>
                            <Container>
                                <h2>Input</h2><Input onChange={changeToken} placeholder={'Enter BEP2E Asset Address'}></Input>
                                < br />< br />
                                <Input onChange={setToken} placeholder={'0.0'}></Input>
                                <h4>&nbsp; Balance: {utils.formatEther(tokenData?.balance, { commify: true })}&nbsp; {tokenData.symbol}</h4>
                            </Container>
                        </div>
                    </div>
                    <div class='arrow'>
                        <SVGArrowDown />
                    </div>

                    <br />
                    <div class='container2'>
                        <Container>
                            <div class='centerObject2'>
                                <h2>Output</h2>
                                <Input placeholder={'Enter BEP2E Asset Address'} onChange={changeOutputToken}></Input>
                                < br />< br />
                                <h4>&nbsp; Output: {/*utils.formatEther(swapData.output, { commify: true })*/} {swapData.symbol}</h4>
                            </div>
                        </Container>
                    </div>
                    <h4>&nbsp; Slippage: {swapData.slip}%</h4>
                </Container>
                <br /><br />
                <div class='centerObject2'>
                    {!context.connected &&
                        <p> Please Wait for Metamask to connect</p>}
                    {
                        !approval && context.connected &&
                        <button1 onClick={unlock}>UNLOCK</button1>
                    }
                    {
                        approval && !startTx &&
                        <button1 onClick={swap}>UPGRADE</button1>
                    }
                    {
                        approval && startTx && !endTx &&
                        <button1 onClick={swap}>UPGRADE</button1>
                    }
                </div>
            </div>
            <br /><br /><br /><br /><br />
        </div>
    )
}
export default SimpleSwap