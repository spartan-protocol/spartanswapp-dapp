import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ModalTable } from '../components/common'

const tokenDropdown = (props) => {
    
    return (
        <div>
            <Dropdown.Button
                overlay={menu}
                icon={<ModalTable address={props.address} />}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>Hover me
                    <DownOutlined />
                </a>
            </Dropdown.Button>
        </div>
    )

    ReactDOM.render(<Dropdown overlay={menu}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>Hover me <DownOutlined /></a></Dropdown>, document.getElementById('dropdown'));

}

export const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
      </a>
        </Menu.Item>
        <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
);

export default tokenDropdown






//<UserOutlined
//    style={{
//        fontSize: '28px',
//        backgroundColor: '#f0f0f0',
//        borderRadius: '50%',
//    }}
///>
