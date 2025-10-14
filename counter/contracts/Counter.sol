// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 public constant FEE_WEI = 0.01 ether;          // taxa por incremento/decremento
    uint256 public constant MIN_BALANCE_WEI = 0.01 ether;  // saldo mínimo para finalizar

    int64   public count;
    address public owner;   // address(0) => finalizado

    // ---- Reentrancy Guard ----
    //uint256 private _entered; // 0 = livre, 1 = ocupado
    uint256 private _entered = 0;
    modifier nonReentrant() {
        require(_entered == 0, "Reentrancy");
        _entered = 1;
        _;
        _entered = 0;
    }

    modifier onlyOwnerActive() {
        require(owner != address(0), "Already finalized");
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ---- Constructor ----
    constructor(int64 startValue) payable {
        owner = msg.sender;
        count = startValue;
        // msg.value entra como saldo inicial do contrato
    }

    // ---- Funções principais ----
    function increment() external payable nonReentrant {
        require(owner != address(0), "Already finalized");
        require(msg.value == FEE_WEI, "Wrong fee");
        unchecked { count += 1; }
    }

    function decrement() external payable nonReentrant {
        require(owner != address(0), "Already finalized");
        require(msg.value == FEE_WEI, "Wrong fee");
        unchecked { count -= 1; }
    }

    function finalize() external onlyOwnerActive nonReentrant {
        require(count >= 3, "Count not high enough");
        require(address(this).balance >= MIN_BALANCE_WEI, "Insufficient balance");

        // 1) transfere todo o saldo ao dono atual
        (bool ok, ) = payable(owner).call{value: address(this).balance}("");
        require(ok, "Transfer failed");

        // 2) trava o contrato
        owner = address(0);
    }

}
