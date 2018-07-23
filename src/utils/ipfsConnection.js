var ipfsAPI = require('ipfs-api');
var ipfsFileEndpoint = 'https://ipfs.infura.io/ipfs/';
var ipfsConnection = new ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
export {
    ipfsConnection,
    ipfsFileEndpoint
}
