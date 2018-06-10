import React, {Component} from "react";
import injectSheet from "react-jss";
import Header from "./../../components/Header";
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import UploadItem from "./UploadItem";
import { react } from "@nosplatform/api-functions";
const { injectNOS, nosProps } = react.default;

const styles = {
  "@import": "https://fonts.googleapis.com/css?family=Source+Sans+Pro",
  "@global html, body": {
    fontFamily: "Source Sans Pro",
    margin: 0,
    padding: 0,
    backgroundColor: "#ffffff"
  },
  App: {
    textAlign: "center"
  },
  intro: {
    fontSize: "large"
  },
  lineBreak: {
    width: "75%",
    borderTop: "1px solid #333333",
    margin: "32px auto"
  },
  CenterDiv: {
    textAlign: "center",
    marginBottom: "10px"
  },
  CardContainer: {
      marginLeft: "10%",
      marginRight: "10%",
      display: "flex"
  }
};

const scriptHash = 'aff5fb3ef77607031c1860dd05a09398bd5f9812';
const operation = 'GetProductListHash';

class App extends Component {

  async componentDidMount() {
     if (this.props.nos.exists) {
       this.props.nos.getAddress().then(async (response) => {
          this.setState({userAddress: response});
          this.props.nos.invoke({scriptHash,operation})
            .then((txid) => console.log(`Invoke txid: ${txid} `));
       }).catch((err) => {
         console.error(err)
       });
     }
   }

  constructor(props) {
    super(props);
    this.state = {
      userAddress: '',
      products: []
    };
  }

  render() {
    const { classes , nos } = this.props;
    if (!this.props.nos.exists) {
      return null;
    }
      return (
        <Router>
            <div>
                <div className={classes.App}>
                  <Header title="NeoShop: Buy and sell using Neo Tokens" />
                </div>
                <Route exact={true} path="/" render = {() => (
                  <div>
                      <div className={classes.CenterDiv}>
                          <Link to={'/upload'}><Button color="success">List Item</Button></Link>
                      </div>
                      <div className={classes.CardContainer}>
                        <Row>
                          <Col sm="3">
                            <Card>
                              <CardImg top width="200px" src="https://i.imgur.com/jRVDeI8.jpg" alt="Card image cap" />
                              <CardBody style={{ height: '200px' }}>
                                <CardTitle>Headphone</CardTitle>
                                <CardSubtitle>4 Neo</CardSubtitle>
                                <CardText>JBl 2500 . High woofer headphones with dolby digital sound</CardText>
                                <Button style={{ position: 'absolute', bottom: '0', marginBottom: '10px'}} color="success">Buy</Button>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col sm="3">
                            <Card>
                              <CardImg top width="200px" src="https://i.imgur.com/t7DTziH.jpg" alt="Card image cap" />
                              <CardBody style={{ height: '200px' }}>
                                <CardTitle>Cupcake</CardTitle>
                                <CardSubtitle>1 Neo</CardSubtitle>
                                <CardText>Delicious chocolate cupcakes</CardText>
                                <Button id='' style={{ position: 'absolute', bottom: '0', marginBottom: '10px'}} color="success">Buy</Button>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </div>
                  </div>
                )}/>
                <Route exact={true} path="/upload" render = {() => (
                    <UploadItem userAddress={this.state.userAddress} ></UploadItem>
                )}/>
            </div>
        </Router>
      );
  }
}

export default injectNOS(injectSheet(styles)(App));
