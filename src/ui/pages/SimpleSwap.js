import { Container } from '../layout/theme/components'
import SVGArrowDown from '../../assets/svg/SVGArrowDown'
import React, { useState, useEffect, useContext } from 'react'
import ReactDOM from 'react-dom'
import { Context } from '../../context'
import { MenuOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons'
import { SPARTA_ADDR, BNB_ADDR, WBNB_ADDR, getAssets, getSpartaContract, getTokenContract, getTokenDetails, getTokenData, getPoolsData, getListedTokens, getListedPools, getPoolsContract, getRouterContract, ROUTER_ADDR, getWalletData, getPool, getPoolData, getAlltokens, getTokenSymbol } from '../../client/web3'
import { Input, notification, Menu, Dropdown, Table } from 'antd';
import { bn, formatBN, convertFromWei, convertToWei, one, getAddressShort } from '../../utils'
import { getSwapOutput, getSwapSlip, getSwapFee } from '../../math'
import { Center, Button, H1, H2, H3, LabelWhite, P, HR } from '../components/elements';
import { card, approvalNotification, swapNotification, ModalTable, TokenSymbol } from '../components/common';
import 'antd/dist/antd.css'
import spinner from '../../assets/images/spinner.svg'
import { SpinnerWrapper } from '../layout/theme';
import { white } from 'color-name';

//const { TabPane } = Tabs;
var utils = require('ethers').utils;

function openAddress() {
    document.getElementById("myModal").style.display = "block";
}

function closeAddress() {
    document.getElementById("myModal").style.display = "none";
}

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
    const [inputSymbol, setInputSymbol] = useState({
        'symbol': 'XXX',
     })

    const [outputSymbol, setOutputSymbol] = useState({
        'symbol': 'XXX',
     })

    const [key, setKey] = useState({
        'key': '1',
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
        setInputSymbol('SPARTA')
        setOutputSymbol('BNB')

        const account = (await window.web3.eth.getAccounts())[0];
        let tokenDetails = await getTokenData(AddressFrom, context.walletData)
        setInputTokenData(tokenDetails)

        let assetArray = context.assetArray ? context.assetArray : await getAssets()
        context.setContext({ 'assetArray': assetArray })

        let tokenArray = await getListedTokens()
        context.setContext({ 'tokenArray': tokenArray })

        let poolArray = await getListedPools()
        context.setContext({ 'poolArray': poolArray })
        context.setContext({ 'poolsData': await getPoolsData(tokenArray) })

        let allTokens = assetArray.concat(tokenArray)

        var sortedTokens = [...new Set(allTokens)].sort()

        let tokenDetailsArray = context.tokenDetailsArray ? context.tokenDetailsArray : await getTokenDetails(account, sortedTokens)
        context.setContext({ 'tokenDetailsArray': tokenDetailsArray })

        let walletData = await getWalletData(account, tokenDetailsArray)
        context.setContext({ 'walletData': walletData })
        console.log(walletData)

        setPool(await getPoolData(AddressTo, context.poolsData))
        setSwapData(await getSwapData(inputTokenData.balance, inputTokenData, outputTokenData, pool))
    }

    const getSwapData = async (inputAmount, inputTokenData, outputTokenData, pool) => {

        var output, slip
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
        return swapData
    }

    const checkApproval = async (address) => {
        if (address == BNB_ADDR || address == WBNB_ADDR) {
            setApproval(true)
        }
        else {
            const contract = getTokenContract(address)
            const approval = await contract.methods.allowance(context.walletData.address, ROUTER_ADDR).call()
            if (+approval > 0) {
                setApproval(true)
            }
        }
    }

    const setMaxBalance = () => {
        let maxBalance = inputTokenData.balance
        onInputAmountChange(maxBalance)
    }



    /* ______________________________________________INPUTS __________________________________________________________ */

    const onInputChange = async (e) => {
        try {
            if (e === SPARTA_ADDR || e === BNB_ADDR || e === WBNB_ADDR) /*TO-DO: A Check against valid addresses in wallet instead of set ones*/ {
                setApproval(false)
                setAssetFrom(e)
                let token = await getTokenData(e, context.walletData)
                setInputTokenData(token)
                checkApproval(AddressFrom)
                setSwapData(await getSwapData(inputAmount, e, outputTokenData, pool))
            }
            else {
                try {
                    setInputTokenData({
                        'symbol': 'NaN',
                        'name': 'NaN',
                        'balance': 0,
                        'address': 'NaN'
                    })
                }
                catch (err) {
                    console.log(err)
                }
            }
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
        approvalNotification()
    }

    /* Step 2 */
    const swap = async () => {
        setStartTx(true)
        let contract = getRouterContract()
        let amount = convertToWei(inputAmount)

        await contract.methods.swap(amount, AddressFrom, AddressTo).send({
            from: context.walletData.address,
            gasPrice: '',
            gas: '',
        })
        setStartTx(false)
        setEndTx(true)
        swapNotification()
        context.setContext({ 'tokenDetailsArray': await getTokenDetails(context.walletData.address, context.tokenArray) })
    }

    /* __________________________________________________________________________________________________ */

    

    function GetIcon(address) {
        if (address == SPARTA_ADDR) {
            return <img src={'favicon.png'} width='40px' height='40px' />
        }
        else if (address == BNB_ADDR || props.symbol == 'BNB') {
            return <img src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png"} width='40px' height='40px' />
        }
        else {
            return <img src={"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/" + address + "/logo.png"} width='40px' height='40px' />
        }
    }

    function setInputSelection() {
        openAddress()
        setKey('1')
        console.log(key)  
        
    }
    function setOutputSelection() {
        openAddress()
        setKey('2')
        console.log(key)        
    }
    

    async function setData(address, symbol) {
        try {
            if (key === '1') {
                setApproval(false)
                setAssetFrom(address)
                setInputSymbol(symbol)
                let token = await getTokenData(address, context.walletData)
                setInputTokenData(token)
                checkApproval(AddressFrom)
                console.log(address)
                console.log(symbol)
                console.log(AddressFrom)
            }
            else if (key === '2') {
                setAssetTo(address)
                setOutputSymbol(symbol)
                console.log(address)
                console.log(symbol)
                console.log(AddressTo)
            }
            else {
                console.log(key)
            }
            return
        }
        catch(err){
            console.log(err)
        }
    }

    const AddressModal = (props) => {

        const context = useContext(Context)
        const TokenTable = () => {
            
            const columns = [
                {
                    render: (record) => (
                        <Button
                            onClick={() => setData(record.address, record.symbol)}>
                            <ModalTable
                                address={record.address} 
                                symbol={record.symbol}
                                size={35} />
                        </Button>
                    )
                }
            ]
            return (
                <div>
                    <div>
                        <Input
                            id="search_input"
                            placeholder={'Enter a token symbol'}
                            onChange={''}
                        /> <Button><SearchOutlined /></Button></div>
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

    /*__________________________________________________________________________________________________________________*/

    return (
        <div>
            <div className='outerContainer'>
                <Container>
                    <AddressModal />
                    <br />
                    {!context.connected &&
                        <>
                            <div className='centerObject2'>
                                <img src="favicon.png" height='100' width="100" />
                                <br />
                                <br />
                                <p>Connecting Metamask...</p>
                                <p>Ensure your Metamask is connected to the BSC Mainnet to use this application</p>
                                <p>Taking a while? Try refreshing the page</p>
                                <br />
                                <SpinnerWrapper src={spinner} />
                            </div>
                        </>
                    }
                    {context.connected && <>
                        <div className='centerObject2'>
                            <H3>Swap </H3>
                        </div>
                        <div className='container2'>
                            <Center>
                                <Container>
                                    <div className='align2'>
                                        <H2>Input</H2>
                                    </div>
                                    <div>
                                        <div className='rightAlign'>
                                            <Button type={'third'} style={{ width: 110 }} icon={GetIcon(AddressFrom)} onClick={() => setInputSelection()}><>&nbsp; {inputSymbol.toString()} <DownOutlined /></></Button>
                                        </div>
                                        <div className='leftAlign'>
                                            <Input
                                                bordered={false}
                                                placeholder='0.0'
                                                onChange={(e) => onInputAmountChange(e.target.value)}
                                                style={{ height: 30, fontSize: 30, color: 'white' }}
                                            />
                                        </div>
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
                                    <div className='align2'>
                                        <H2>Output</H2>
                                    </div>
                                    <div>
                                        <div className='rightAlign'>
                                            <Button type={'third'} style={{ width: 110 }} icon={GetIcon(AddressTo)} onClick={() => setOutputSelection()}><>&nbsp; {outputSymbol.toString()} <DownOutlined /></></Button>&nbsp;
                                        </div>
                                        <div className='leftAlign'>
                                            <Input
                                                bordered={false}
                                                placeholder='0.0'
                                                value={''}
                                                style={{ height: 30, fontSize: 30, color: 'white' }}
                                            />
                                        </div>
                                        < br />
                                    </div>
                                </Container>
                            </Center>
                        </div>
                    </>}
                </Container>
                <div className='centerObject2'>
                    {!context.connected &&
                        <p> </p>}
                    {
                        !approval && context.connected &&
                        <Button type={'wallet'} style={{ width: 300, height: 40 }} onClick={approve}>APPROVE</Button>
                    }
                    {
                        approval && !startTx &&
                        <Button type={'wallet'} style={{ width: 300, height: 40 }} onClick={swap}>SWAP</Button>
                    }
                    {
                        approval && startTx && !endTx &&
                        <Button type={'wallet'} style={{ width: 300, height: 40 }} onClick={swap}>SWAP</Button>
                    }

                    <br /><br />
                </div>
            </div>
            {context.connected &&
                <>
                    <div className="bottomContainer">
                        <div className="centerObject2">
                            <Container>
                            <P>Slippage: </P>
                            <P>Fee: </P>
                            <P>Sending Token Address: {AddressFrom.toString()}</P>
                            <P>Receiving Token Address: {AddressTo.toString()}</P>
                           < br/>
                           
                            </Container>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default SimpleSwap
