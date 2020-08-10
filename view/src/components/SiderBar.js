'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';

const Sider = Layout.Sider;

export default class SiderBar extends React.Component {
  handleMenuClick (e) {
    this.setState({
      currentPath: e.key,
    });
  }

  render () {
    return (
      <Sider
        trigger={null}
        collapsible
        width="200px"
        collapsed={this.props.collapsed}
      >
        <div className="logo">
          <Link to="/">
            <img alt="logo" src="https://macacajs.github.io/reliable/logo/reliable.svg" />
            <h1>Reliable</h1>
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={[location.pathname]}
          onClick={this.handleMenuClick.bind(this)}
        >
          <Menu.Item key="/">
            <Link to="/">
              <Icon type="flag" />
              <span>
                <FormattedMessage id='sidebar.buildinfo' />
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/insight">
            <Link to="/insight">
              <span>
                <Icon type="line-chart" />
                <FormattedMessage id='sidebar.insight' />
              </span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/setting">
            <Link to="/setting">
              <Icon type="setting" />
              <span>
                <FormattedMessage id='sidebar.setting' />
              </span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

