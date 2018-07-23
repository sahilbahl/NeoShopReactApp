import React, {Component} from "react";
import injectSheet from "react-jss";
import { Button, Form, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import {ipfsConnection} from "./../../utils/ipfsConnection.js";
import { react } from "@nosplatform/api-functions";
const { injectNOS, nosProps } = react.default;
import { withRouter } from 'react-router-dom';
let uuid = require('react-native-uuid');
const scriptHash = '2b108cf8a0bde49c31365697b985128b45cce3cf';
const key = "bd65600d-8669-4903-8a14-af88203add38";
const getStorage = { scriptHash, key };
const operation = "UpdateProductListHash";
import { ToastStore } from 'react-toasts';
import { BounceLoader } from 'react-spinners';

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
    width: "50%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
};

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.saveFileToIpfs = this.saveFileToIpfs.bind(this);
    this.updateProdListAndStoreHash = this.updateProdListAndStoreHash.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.handleContactNumberChange = this.handleContactNumberChange.bind(this);
    this.onCancelButtonClick = this.onCancelButtonClick.bind(this);
    this.select =  this.select.bind(this);
    this.updateProdList = props.updateProdList;
    this.history = props.history;
    this.state ={
      product : props.product,
      products: props.products,
      dropdownOpen: false,
      loading: false,
      loadingMsg: ''
    }
  }



  toggleCategory() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  select(event) {
    let cat = event.target.innerText;
    let product = {...this.state.product};
    product.category = cat;
    this.setState({product});
  }

  onEditButtonClick(nos) {
    this.setState({loading: true, loadingMsg: 'Saving Changes'});
    let prodIndex = this.state.products.findIndex(prod => prod.id == this.state.product.id);
    let existingProducts = this.state.products;
    existingProducts.splice(prodIndex, 1);
    existingProducts.push(this.state.product);
    this.updateProdListAndStoreHash(existingProducts, nos, this);
  }

  onCancelButtonClick(nos) {
	this.history.push('/');
  }

  updateProdListAndStoreHash(products, nos, self) {
    ipfsConnection.add(new Buffer(JSON.stringify(products)), function (err, res){
      		if(err || !res) return console.error("ipfs add error", err, res);      
		res.forEach(function(file) {
		    const args = [];
        args.push('' + file.hash);
        self.setState({loading: false, loadingMsg: ''});
		    nos.invoke({scriptHash, operation, args})
            		.then(txid => {
                  console.log(txid);
                  ToastStore.success('Product updated');
                  self.updateProdList(products);
                  self.history.push('/');
                })
            		.catch(err => console.log(`Error: ${err.message}`));
      		});
    	});
  }

 captureFile (event) {
    let files = event.target.files;

    for (var i = 0, f; f = files[i]; i++) {
    	const file = files[i];
    	let reader = new window.FileReader();
    	let self = this;
    	reader.onloadend = () => self.saveFileToIpfs(reader);
    	reader.readAsArrayBuffer(file);
    }
  }

  saveFileToIpfs (reader) {
    this.setState({loading: true, loadingMsg: 'Uploading Files'});
    let ipfsId;
    const buffer = Buffer.from(reader.result);
    let self = this;
    ipfsConnection.add(buffer)
      .then((response) => {
        self.setState({loading: false, loadingMsg: ''});
        ipfsId = response[0].hash;
	      let imageHashes  = self.state.product.images;
        imageHashes =  imageHashes.concat(ipfsId);
        let product = {...self.state.product};
        product.images = imageHashes;
	      self.setState({product});
      }).catch((err) => {
        console.error(err);
      })
  }

  handleNameChange(event) {
    let product = {...this.state.product};
    product.name = event.target.value;
    this.setState({product});
  }

  handleDescChange(event) {
    let product = {...this.state.product};
    product.desc = event.target.value;
    this.setState({product});
  }

  handlePriceChange(event) {
    let product = {...this.state.product};
    product.price = event.target.value;
    this.setState({product});
  }

  handleAddressChange(event) {
    let product = {...this.state.product};
    product.pickLocation = event.target.value;
    this.setState({product});
  }

  handleContactNumberChange(event) {
    let product = {...this.state.product};
    product.contactNumber = event.target.value;
    this.setState({product});
  }

  render() {
     const { classes, nos } = this.props;
     return (
        <div className={classes.CenterDiv}>
        <div className='sweet-loading' style={{position: "absolute", top: "50%", right: "50%", backgroundColor: '#f7f7f7', fontSize: "15px", fontWeight: "bold"}}>
          <center><BounceLoader
          color={'#63bc46'} 
          loading={this.state.loading} 
          /></center>
	  <div>{this.state.loadingMsg}</div>
          </div>
            <Form>
                <FormGroup>
                  <Label for="name">Product Name</Label>
                  <Input type="email" name="productName" id="name" value={this.state.product.name} onChange={this.handleNameChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="name">Product Category</Label>
                  <Dropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggleCategory}>
                    <DropdownToggle caret>
                    {this.state.product.category}
                    </DropdownToggle>
                    <DropdownMenu
                      modifiers={{
                        setMaxHeight: {
                          enabled: true,
                          order: 890,
                          fn: (data) => {
                            return {
                              ...data,
                              styles: {
                                ...data.styles,
                                overflow: 'auto',
                                maxHeight: 200,
                              },
                            };
                          },
                        },
                      }}
                    >
                      <DropdownItem onClick={this.select}>Appliances</DropdownItem>
                      <DropdownItem onClick={this.select}>Baby & kids</DropdownItem>
                      <DropdownItem onClick={this.select}>Bags & luggage</DropdownItem>
                      <DropdownItem onClick={this.select}>Bicycles</DropdownItem>
                      <DropdownItem onClick={this.select}>Books, films & music</DropdownItem>
                      <DropdownItem onClick={this.select}>Car parts</DropdownItem>
                      <DropdownItem onClick={this.select}>Cars, vans & motorcycles</DropdownItem>
                      <DropdownItem onClick={this.select}>Clothing & shoes - men</DropdownItem>
                      <DropdownItem onClick={this.select}>Clothing & shoes - women</DropdownItem>
                      <DropdownItem onClick={this.select}>Electronics & computers</DropdownItem>
                      <DropdownItem onClick={this.select}>Furniture</DropdownItem>
                      <DropdownItem onClick={this.select}>Health & beauty</DropdownItem>
                      <DropdownItem onClick={this.select}>Household</DropdownItem>
                      <DropdownItem onClick={this.select}>Jewellery & accessories</DropdownItem>
                      <DropdownItem onClick={this.select}>Mobile Phones</DropdownItem>
                      <DropdownItem onClick={this.select}>Pet supplies</DropdownItem>
                      <DropdownItem onClick={this.select}>Property for sale</DropdownItem>
                      <DropdownItem onClick={this.select}>Property for rent</DropdownItem>
                      <DropdownItem onClick={this.select}>Sport & outdoors</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price in Neo</Label>
                  <Input type="number" name="price" id="price" value={this.state.product.price} onChange={this.handlePriceChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Product Description</Label>
                  <Input type="textarea" name="description" id="description" value={this.state.product.desc} onChange={this.handleDescChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="address">Pick Up Location</Label>
                  <Input type="textarea" name="address" id="address" value={this.state.product.pickLocation} onChange={this.handleAddressChange}/>
		            </FormGroup>
		            <FormGroup>
                  <Label for="phoneNumber">Contact Number</Label>
                  <Input type="text" name="phoneNumber" id="phoneNumber" value={this.state.product.contactNumber} onChange={this.handleContactNumberChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="photos">Item photos </Label>
		              <input type="file" onChange={this.captureFile} multiple/>
                </FormGroup>

                <Button disabled= {this.state.loading} color="success" onClick={() => this.onEditButtonClick(nos)} >Save Changes</Button>{' '}
                <Button color="success" onClick={() => this.onCancelButtonClick(nos)} >Cancel</Button>{' '}
          </Form>
      </div>
      );
  }
}

export default withRouter(injectNOS(injectSheet(styles)(EditItem)));
