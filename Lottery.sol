pragma solidity ^0.4.17;
/**contract Inbox{
    string public message;
    function Inbox(string initial) public{
        message=initial;
    }
    function setMsg(string i) public{
        message =i;
    }
    function getMsg() public view returns (string){
        return message;
    }

}**/

contract Lottery{
    address public manager; ///type, visibilty, name
    address[] public players;

    function Lottery() public {
        manager=msg.sender; ///this will give us the address of who created the lottery

    }

    function enter() public payable { ///since to wnter the lottery player has to pay some amount of ehter, thus we need payable
        require(msg.value > .01 ether );  ///this is used for validation ;  amount is in wei so by writing out ether it gets converted to wei

        players.push(msg.sender);
    }

    ///next is our function for pseudo random number generator

    function random() private view returns (uint){
        return uint(keccak256(block.difficulty,now,players));                ///sha3 or keccak256 is a global function and block is a global variable; now is for current time
    }

    function pickWinner() public restricted{
        ///require(msg.sender==manager); /// to check that only managaer can call pickwinner function

        uint index=random() % players.length;
        players[index].transfer(this.balance);  /// function available that will attempt to tkae some amount of money from the contract and give it to this address
        players=new address[](0); /// this will give us a new dynamic array so thhat we dont have redeploy our contract everytime a winner is chosen; (0) indicates that we want the initital size to be 0


    }

    //this is a common code snippet which is used in different functions
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    //function to tell number of different players

    function getPlayers() public view returns(address[]){
        return players;
    }



}
