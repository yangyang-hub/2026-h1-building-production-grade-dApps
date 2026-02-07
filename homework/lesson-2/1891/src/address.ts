import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { ethers } from "ethers";

const SS58_PREFIX = 42;

export function ss58ToAccountId32(ss58: string): Uint8Array {
  return decodeAddress(ss58);
}

export function accountId32ToSs58(accountId32: Uint8Array): string {
  return encodeAddress(accountId32, SS58_PREFIX);
}

function isEthDerived(accountId: Uint8Array): boolean {
  if (accountId.length !== 32) return false;
  for (let i = 20; i < 32; i++) {
    if (accountId[i] !== 0xee) return false;
  }
  return true;
}

// EVM(H160) -> Substrate(AccountId32)
// 规则：前 20 字节是地址，后 12 字节填充 0xEE
export function h160ToAccountId32(address: string): Uint8Array {
  const normalized = ethers.getAddress(address);
  const bytes = ethers.getBytes(normalized);
  if (bytes.length !== 20) {
    throw new Error(`H160 address must be 20 bytes, got ${bytes.length}`);
  }

  const accountId = new Uint8Array(32);
  accountId.fill(0xee);
  accountId.set(bytes, 0);
  return accountId;
}

// Substrate(AccountId32) -> EVM(H160)
// 如果是 eth-derived（后 12 字节全 0xEE），直接取前 20 字节
// 否则：keccak256(accountId32) 的后 20 字节
export function accountId32ToH160(accountId32: Uint8Array): string {
  if (accountId32.length !== 32) {
    throw new Error(`AccountId32 must be 32 bytes, got ${accountId32.length}`);
  }

  if (isEthDerived(accountId32)) {
    const h160Bytes = accountId32.slice(0, 20);
    return ethers.getAddress(ethers.hexlify(h160Bytes));
  }

  const hash = ethers.keccak256(accountId32);
  const hashBytes = ethers.getBytes(hash);
  const h160Bytes = hashBytes.slice(12, 32);
  return ethers.getAddress(ethers.hexlify(h160Bytes));
}
