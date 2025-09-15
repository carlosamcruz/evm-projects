// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract HelloWorld {
    // Mensagem inicial fixa (definida na criação do contrato)
    string public message = "Hello World";

    // Dono do contrato (quem fez o deploy)
    address public owner;

    constructor() {
        owner = msg.sender;
        // message já está definida acima (fixa); nada a fazer aqui
    }

    function update(string memory newMessage) public {
        require(owner != address(0)); // bloqueia alterações após finalize()
        message = newMessage;
    }

    function finalize() public {
        require(msg.sender == owner, "Not owner");
        require(
            keccak256(bytes(message)) == keccak256(bytes("finalize")),
            "Message must be 'finalize'"
        );
        owner = address(0);
        // Opcional: limpar a mensagem ao finalizar
        // message = "";
    }
}
