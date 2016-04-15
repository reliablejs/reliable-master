/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

const React = require('react');

const Charts = require('./charts');
const Layout = require('../common/layout');

class Home extends React.Component {

  render() {
    return (
      <Layout {...this.props}>
        <div className="wrapper">
          <canvas id="canvas"></canvas>
          <section className="landing">
            <div className="site-container">
              <h1>{this.props.gettext('page.global.slogan')}</h1>
            </div>
          </section>
          <section className="notes">
            <div className="site-container">
              <div className="social-wrapper">
                <p className="github">
                  <a href="">
                    <i className="icon-github-landing" href=""></i>
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="feature-wrapper">
          <div className="row container">
            <div className="col-xs-6 col-md-4">
              <h3>{this.props.gettext('home.intro1.title')}</h3>
              <dl>
                <dd>{this.props.gettext('home.intro1.content1')}</dd>
                <dd>{this.props.gettext('home.intro1.content2')}</dd>
              </dl>
            </div>
            <div className="col-xs-6 col-md-4">
              <h3>{this.props.gettext('home.intro2.title')}</h3>
              <dl>
                <dd>{this.props.gettext('home.intro2.content1')}</dd>
                <dd>{this.props.gettext('home.intro2.content2')}</dd>
              </dl>
            </div>
            <div className="col-xs-6 col-md-4">
              <h3>{this.props.gettext('home.intro3.title')}</h3>
              <dl>
                <dd>{this.props.gettext('home.intro3.content1')}</dd>
                <dd>{this.props.gettext('home.intro3.content2')}</dd>
              </dl>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

module.exports = Home;
