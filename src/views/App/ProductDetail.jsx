import React, {Component} from "react";
import { react } from "@nosplatform/api-functions";
import injectSheet from "react-jss";
import "react-image-gallery/styles/css/image-gallery.css";
const { injectNOS, nosProps } = react.default;
const scriptHash = '2b108cf8a0bde49c31365697b985128b45cce3cf';
const key = "bd65600d-8669-4903-8a14-af88203add38";
import ImageGallery from 'react-image-gallery';
import { Button } from "reactstrap";
const DEFAULT_IMAGE = 'https://i.imgur.com/PdkNg7F.jpg';
import { ipfsConnection, ipfsFileEndpoint } from "./../../utils/ipfsConnection.js";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
const operation = "UpdateProductListHash";
import { BounceLoader } from 'react-spinners';

const styles = {
  CenterDiv: {
    width: "50%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  ImageGallery: {
    width: "100%;",
    height: "300px",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
};
const IMAGES_SIZE = '80vw';
class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.history = props.history;
    this.state = {
      product: props.product,
      products: props.products,
      userAddress: props.userAddress,
      loading: false,
      loadingMsg: ''
    }
    this.showBuyAlert = this.showBuyAlert.bind(this);
    this.updateProdList = props.updateProdList;
  }
  render() {
    const images = [];
    const { classes , nos } = this.props;
    let product = this.state.product;
    if (product.images.length >0 ){
      product.images.forEach(imageHash => {
        images.push({original: ipfsFileEndpoint + imageHash, sizes: IMAGES_SIZE});
      });
    } else {
      images.push({original: DEFAULT_IMAGE, sizes: IMAGES_SIZE});
    }

    return (
      <div className={classes.CenterDiv}>
      <div className='sweet-loading' style={{position: "absolute", top: "50%", right: "40%", backgroundColor: '#f7f7f7', fontSize: "15px", fontWeight: "bold", zIndex: "2"}}>
          <center><BounceLoader
          color={'#63bc46'} 
          loading={this.state.loading} 
          /></center>
	  <div>{this.state.loadingMsg}</div>
          </div>
        <h3>{this.state.product.name}</h3>
        <div className= {classes.ImageGallery}>
            <ImageGallery showThumbnails = {false} showFullscreenButton = {false} showPlayButton = {false} items={images} />
        </div>
        <div>
          <h5>Description</h5>
          <div style={{whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto'}} >{this.state.product.desc}</div>
        </div>
        <div>
          <h5>Price</h5>
          <div>{this.state.product.price} Neo</div>
        </div>
        <div>
          <h5>Listed On</h5>
          <div>{this.state.product.listedOn}</div>
        </div>
        <div>
          <h5>Pick Up Location</h5>
          <div style={{whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto'}} >{this.state.product.pickLocation}</div>
        </div>
        <div style= {{magintTop: '5px'}}>
          <Button disabled= {this.state.loading} color="success" onClick = {() => this.showBuyAlert(nos)}>Buy Now</Button>{' '}
	  <Button color="success" onClick={() => this.history.push('/')} >Cancel</Button>{' '}
        </div>    
      </div>  
    );
  }

  showBuyAlert(nos) {
      let self = this;
      let price = this.state.product.price;
      confirmAlert({
       title: 'Buy Now',
       message: 'Confirm withdrawl of ' + price + ' Neo for purchase',
       buttons: [
        {
          label: 'Yes',
          onClick: () => self.executePurchase(nos)
        },
        {
          label: 'Cancel'
        }
      ]
    });
  }

  executePurchase(nos) {
    let self = this;
    const amount = this.state.product.price;
    const receiver = this.state.product.address;
    const NEO = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b';
    this.props.nos.send({ asset: NEO, amount, receiver})
      .then((txid) => {
        self.updateProductList(txid, nos, self);
      })
      .catch((err) => {
        ToastStore.error('Purchase Failed');
        self.history.push('/');
      });
  }

  updateProductList(txid, nos, self) {
    self.setState({loading: true, loadingMsg: 'Completing Transaction'});
    let prodIndex = this.state.products.findIndex(prod => prod.id == self.state.product.id);
    let prods = self.state.products;
    prods[prodIndex].isSold = true;
    prods[prodIndex]['soldOn'] = new Date().toLocaleString();
    prods[prodIndex]['transactionId'] = txid;
    prods[prodIndex]['buyerAddress'] = self.state.userAddress;
    
    ipfsConnection.add(new Buffer(JSON.stringify(prods)), function (err, res){
      		if(err || !res) return console.error("ipfs add error", err, res);      
		res.forEach(function(file) {
		    const args = [];
		    args.push('' + file.hash);
		    nos.invoke({scriptHash, operation, args})
            		.then(txid => {
		  self.setState({loading: false, loadingMsg: ''});
                  ToastStore.success('Product purchase Success');
                  self.updateProdList(prods);
		              self.history.push('/');
                })
            	  .catch(err => console.log(`Error: ${err.message}`));
      		});
    	});
  }
}

export default withRouter(injectNOS(injectSheet(styles)(ProductDetail)));
