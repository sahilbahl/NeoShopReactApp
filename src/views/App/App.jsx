import React, {Component} from "react";
import injectSheet from "react-jss";
import Header from "./../../components/Header";
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import UploadItem from "./UploadItem";
import ProductDetail from "./ProductDetail";
import MyListings from "./MyListings";
import EditItem from "./EditItem";
import { react } from "@nosplatform/api-functions";
const { injectNOS, nosProps } = react.default;
import {ipfsConnection, ipfsFileEndpoint} from "./../../utils/ipfsConnection.js";
import { ToastContainer, ToastStore } from 'react-toasts';
import axios from 'axios';

const DEFAULT_IMGE = 'https://i.imgur.com/PdkNg7F.jpg';
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
  },
  CardDiv: {
    marginBottom: "15px"
  }
};

const scriptHash = '2b108cf8a0bde49c31365697b985128b45cce3cf';
const key = "bd65600d-8669-4903-8a14-af88203add38";
const getStorage = { scriptHash, key };

class App extends Component {
  async componentDidMount() {
     let self = this;
     if (this.props.nos.exists) {
	this.props.nos.getAddress().then(async (response) => {
          this.setState({userAddress: response});
          this.props.nos.getStorage(getStorage).then( async (dataHash) => {
		 ipfsConnection.get(dataHash, function(err, res){

	   		if(err || !res) return console.error("ipfs get error", err, res);
	    		res.forEach((file) => {
				    let prods = JSON.parse(file.content.toString('utf8'));
	          let visibleProds = prods.filter(function(prod){
              return (prod.isSold == false) && (prod.address != self.state.userAddress);
            });
            let prodMap = prods.reduce(function(map, product) {
              map[product.id] = product;
              return map;
            }, {});
            console.log(JSON.stringify(prods));
            self.setState({products: prods, productMap: prodMap, visibleProds: visibleProds});
	      });
		});
  	    });
       });
     }
   }

  constructor(props) {
    super(props);
    this.state = {
      userAddress: '',
      products: [],
      productMap: {},
      visibleProds: []
    };
  }

  updateProdList(prods) {
    let self = this;
    let visibleProds = prods.filter(function(prod){
      return (prod.isSold == false) && (prod.address != self.state.userAddress);
    });
    let prodMap = prods.reduce(function(map, product) {
      map[product.id] = product;
      return map;
    }, {});

    self.setState({products: prods, productMap: prodMap, visibleProds: visibleProds});
  }

  render() {
    if (!this.props.nos.exists) {
	return null;
    }
    var self = this;
    const { classes , nos } = this.props;
      return (
        <Router>
            <div>
                <ToastContainer
                  position={ToastContainer.POSITION.BOTTOM_RIGHT}
		  store={ToastStore}
                />
                <div className={classes.App}>
                  <Header title="NeoShop: Buy and sell using Neo Tokens" />
                </div>
                <Route exact={true} path="/" render = {() => (
                  <div>
                      <div className={classes.CenterDiv}>
                          <Link to={'/upload'}><Button color="success">List Item</Button>{' '}</Link>
			  <Link to={'/myListings'}><Button color="success">View My Unsold Listings</Button>{' '}</Link>
                      </div>
                      <div className={classes.CardContainer}>
			<Row>
                          {this.state.visibleProds.map(function(product, index){
				if (product) {
				     let imgUrl = product.images[0] ? ipfsFileEndpoint + product.images[0]: DEFAULT_IMGE;
            console.log(imgUrl);
             return (
				      <Col key={product.id} sm="3">
                            	  <Card className ={classes.CardDiv} key={product.id}>
                                   <CardImg top width="200px" src={imgUrl} alt="Card image cap" />
                                      <CardBody style={{ height: '250px' }}>
                                         <CardTitle>{product.name}</CardTitle>
					 <CardSubtitle><b>Price</b><br></br>{product.price} Neo</CardSubtitle>
                                         <CardText><b>Listed On<br></br></b>{product.listedOn}</CardText>
                                          
					  <Link to={'/product/' + product.id}><Button color="success">View Details</Button></Link>
                                      </CardBody>
                                </Card>
                                </Col>)
				}
                 	  })}
			</Row>
                      </div>
                  </div>
                )}/>
                <Route exact={true} path="/upload" render = {() => (
                    <UploadItem updateProdList = {this.updateProdList.bind(this)} userAddress={this.state.userAddress} products={this.state.products}></UploadItem>
                )}/>
                <Route exact={false} path="/product/:productId" render = {(route) => (
                    <ProductDetail updateProdList = {this.updateProdList.bind(this)} userAddress={this.state.userAddress} product ={this.state.productMap[route.match.params.productId]} products={this.state.products}></ProductDetail>
                )}/>
		<Route exact={true} path="/myListings" render = {() => (
                    <MyListings updateProdList = {this.updateProdList.bind(this)} userAddress={this.state.userAddress} products={this.state.products}></MyListings>
                )}/>
                 <Route exact={false} path="/editListing/:productId" render = {(route) => (
                    <EditItem updateProdList = {this.updateProdList.bind(this)} userAddress={this.state.userAddress} product ={this.state.productMap[route.match.params.productId]} products={this.state.products}></EditItem>
                )}/>
            </div>
        </Router>
      );
  }
}

export default injectNOS(injectSheet(styles)(App));
