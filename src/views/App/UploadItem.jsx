import React, {Component} from "react";
import injectSheet from "react-jss";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import ipfsConnection from "./../../utils/ipfsConnection.js";
import { react } from "@nosplatform/api-functions";
const { injectNOS, nosProps } = react.default;
let uuid = require('react-native-uuid');

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

class UploadItem extends Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.saveFileToIpfs = this.saveFileToIpfs.bind(this);
    this.state ={
      name: '',
      desc: '',
      price: '',
      pickLocation: '',
      images: [],
      address: props.userAddress,
      id: uuid.v4(),
      listedOn: new Date().toLocaleString()
    }
  }

  onSubmitButtonClick() {
    const reader = new FileReader();
    const file = document.getElementById("file").files[0];
    //reader.onloadend = () => this.saveFileToIpfs(reader);
    //reader.readAsArrayBuffer(file);
    ipfsConnection.add(new Buffer(JSON.stringify(this.state)), function (err, res){
      if(err || !res) return console.error("ipfs add error", err, res);

      res.forEach(function(file) {
        console.log('successfully stored' + file.hash);
      });
    });
  }

  captureFile(event) {
   let index;
   const reader = new FileReader();
   const file = event.target.files[0];
   reader.readAsBinaryString(file);
 }

 saveFileToIpfs(reader) {
   let ipfsId;
   let allImages;
   const buffer = Buffer.from(reader.result);
   /*console.log("buffer");
   ipfsConnection.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
     .then((response) => {
       console.log(response);
       ipfsId = response[0].hash;
       allImages = this.state.images.concat(ipfsId);
       this.setState({images: allImages});
     }).catch((err) => {
       console.error(err)
     });*/
 }



  handleNameChange(event) {
     this.setState({name: event.target.value});
  }

  handleDescChange(event) {
     this.setState({desc: event.target.value});
  }

  handlePriceChange(event) {
     this.setState({price: event.target.value});
  }

  handleAddressChange(event) {
     this.setState({pickLocation: event.target.value});
  }

  render() {
     const { classes } = this.props;
     return (
        <div className={classes.CenterDiv}>
            <Form>
                <FormGroup>
                  <Label for="name">Product Name</Label>
                  <Input type="email" name="productName" id="name" value={this.state.name} onChange={this.handleNameChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price in Neo</Label>
                  <Input type="number" name="price" id="price" value={this.state.price} onChange={this.handlePriceChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="description">Product Description</Label>
                  <Input type="textarea" name="description" id="description" value={this.state.desc} onChange={this.handleDescChange}/>
                </FormGroup>
                <FormGroup>
                  <Label for="address">Pick Up Location</Label>
                  <Input type="textarea" name="address" id="address" value={this.state.pickLocation} onChange={this.handleAddressChange}/>
                </FormGroup>
                <FormGroup>
                 <Label for="file">Upload item photos</Label>
                 <Input type="file" name="file" id="file" multiple onChange={this.captureFile}/>
               </FormGroup>
                <Button color="success" onClick={() => this.onSubmitButtonClick()} >Submit</Button>
          </Form>
      </div>
      );
  }
}

export default injectNOS(injectSheet(styles)(UploadItem));
