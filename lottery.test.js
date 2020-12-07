const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');

const web3=new Web3(ganache.provider());  //provider allows us to connect to any given network

const{interface,bytecode}=require('../compile');

//now we will create two variable , one will hold the instance of the contract and the other will hold all the accounts which are present for us for testing purposes

let lottery;
let accounts;

beforeEach(async()=>{
  accounts=await web3.eth.getAccounts();

  lottery=await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0],gas:'1000000'});
});

//now we will write our testcases

describe('Lottery Contract',()=>{

  //first test is to verify that a contract was successfully deployed to a local network
  it('deploys a contract',()=>{
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async()=>{
    await lottery.methods.enter().send({ //send is use to make sure that some amount of money is sent along
      from:accounts[0],
      value: web3.utils.toWei('0.02', 'ether')   //0.02 is minimum amount for an account to enter the lottery
      });
      const players=await lottery.methods.getPlayers().call({from:accounts[0]});

      assert.equal(accounts[0],players[0]);
      assert.equal(1,players.length);
  });

  it('allows multiple accounts to enter', async()=>{
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
      });
    await lottery.methods.enter().send({
      from:accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
      });
    await lottery.methods.enter().send({
      from:accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
      });

      //this is to get the players array
      const players=await lottery.methods.getPlayers().call({from:accounts[0]});

      assert.equal(accounts[0],players[0]);
      assert.equal(accounts[1],players[1]);
      assert.equal(accounts[2],players[2]);
      assert.equal(3,players.length);
  });


//this test is to assure that user has to send in appropriate amount of ether

it('requires a minimum amount of ether',async()=>{
  try{
  await lottery.methods.enter().send({
    from:accounts[0],value:0
  });
  assert(false);//if this line executes, our test would have failed
} catch(err){
  assert(err);
}
});

it('only manager can call pickWinner',async()=>{
  try{
    await lottery.methods.pickWinner().send({
      from:accounts[1]
    });
    assert(false);
  }
  catch(err){
    assert(err);
  }
});

it('sends money to the winner and resets the players array', async()=>{
  await lottery.methods.enter().send({
    from:accounts[0],value:web3.utils.toWei('2','ether')
  });

  const initBalance=await web3.eth.getBalance(accounts[0]);

  await lottery.methods.pickWinner().send({from:accounts[0]});

  const finalBalance=await web3.eth.getBalance(accounts[0]);

  const difference=finalBalance - initBalance;
  console.log(difference);
  assert(difference> web3.utils.toWei('1.8','ether')); //1.8 is allowing for some amountof gas spent

  const pla=await lottery.methods.getPlayers().call({from:accounts[0]});
  assert.equal(0,pla.length);


});



});
