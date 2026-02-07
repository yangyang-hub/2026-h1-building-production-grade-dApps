// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

/// @notice miniSwap 简化版：
/// 1) 兑换比例永远 1:1
/// 2) 无手续费
/// 3) 无 LP 奖励
contract MiniSwap {
    struct PairReserves {
        uint256 reserveA;
        uint256 reserveB;
    }

    // pairKey(tokenA, tokenB) => reserves（按 token 排序后的 A/B）
    mapping(bytes32 => PairReserves) public reserves;

    // msg.sender 在某个 pair 上提供的 liquidity（用 tokenA 的数量作为记账单位）
    mapping(address => mapping(bytes32 => uint256)) public liquidity;

    event LiquidityAdded(address indexed provider, address indexed tokenA, address indexed tokenB, uint256 amount);
    event LiquidityRemoved(address indexed provider, address indexed tokenA, address indexed tokenB, uint256 amount);
    event Swapped(address indexed trader, address indexed tokenIn, address indexed tokenOut, uint256 amount);

    function _sort(address token0, address token1) internal pure returns (address a, address b) {
        require(token0 != token1, "SAME_TOKEN");
        (a, b) = token0 < token1 ? (token0, token1) : (token1, token0);
    }

    function _pairKey(address token0, address token1) internal pure returns (bytes32) {
        (address a, address b) = _sort(token0, token1);
        return keccak256(abi.encodePacked(a, b));
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");

        (address a, address b) = _sort(tokenA, tokenB);
        bytes32 key = keccak256(abi.encodePacked(a, b));

        // 约定：必须同时提供 tokenA 和 tokenB 各 amount（比例 1:1）
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amount), "TRANSFER_FROM_A_FAIL");
        require(IERC20(tokenB).transferFrom(msg.sender, address(this), amount), "TRANSFER_FROM_B_FAIL");

        PairReserves storage r = reserves[key];
        if (tokenA == a) {
            r.reserveA += amount;
            r.reserveB += amount;
        } else {
            r.reserveA += amount;
            r.reserveB += amount;
        }

        liquidity[msg.sender][key] += amount;
        emit LiquidityAdded(msg.sender, tokenA, tokenB, amount);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");

        (address a, address b) = _sort(tokenA, tokenB);
        bytes32 key = keccak256(abi.encodePacked(a, b));

        uint256 liq = liquidity[msg.sender][key];
        require(liq >= amount, "INSUFFICIENT_LIQUIDITY");
        liquidity[msg.sender][key] = liq - amount;

        PairReserves storage r = reserves[key];
        require(r.reserveA >= amount && r.reserveB >= amount, "INSUFFICIENT_RESERVE");
        r.reserveA -= amount;
        r.reserveB -= amount;

        require(IERC20(tokenA).transfer(msg.sender, amount), "TRANSFER_A_FAIL");
        require(IERC20(tokenB).transfer(msg.sender, amount), "TRANSFER_B_FAIL");

        emit LiquidityRemoved(msg.sender, tokenA, tokenB, amount);
    }

    function swap(address tokenIn, address tokenOut, uint256 amount) external {
        require(amount > 0, "AMOUNT_ZERO");

        (address a, address b) = _sort(tokenIn, tokenOut);
        bytes32 key = keccak256(abi.encodePacked(a, b));

        PairReserves storage r = reserves[key];

        // 1:1：用户转入 amount 的 tokenIn，合约转出 amount 的 tokenOut
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amount), "TRANSFER_FROM_IN_FAIL");

        if (tokenIn == a) {
            require(r.reserveB >= amount, "INSUFFICIENT_OUT");
            r.reserveA += amount;
            r.reserveB -= amount;
        } else {
            require(r.reserveA >= amount, "INSUFFICIENT_OUT");
            r.reserveB += amount;
            r.reserveA -= amount;
        }

        require(IERC20(tokenOut).transfer(msg.sender, amount), "TRANSFER_OUT_FAIL");
        emit Swapped(msg.sender, tokenIn, tokenOut, amount);
    }
}
