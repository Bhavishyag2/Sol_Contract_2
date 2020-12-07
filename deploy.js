
//here we will specify which account and what outside node we will be using

const HDWalletProvider=require('truffle-hdwallet-provider');
const Web3=require('web3');
const {interface,bytecode}=require('./compile');

const provider=new HDWalletProvider(
'garment brother clay novel afraid skin box ladder human crew expose pond',
'https://rinkeby.infura.io/v3/5b14919a8e99406e91c8173663f657a8'

);

const web3=new Web3(provider);

const deploy=async()=>{
  const accounts=await web3.eth.getAccounts();

  console.log('Attempting to deploy from account',accounts[0]);

  const result=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data:bytecode}) //in our inbox contract we had initial arg, but in lottery one , we dont have any so we dont want arg  ,arguments:['Hi there!']
    .send({gas:'1000000',from:accounts[0]});

  console.log('Contract deployed to', result.options.address);

};
deploy();
