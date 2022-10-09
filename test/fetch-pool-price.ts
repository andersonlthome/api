import { ethers } from 'hardhat'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { abi as ERC20ABI } from '../src/utils/abi/erc20-abi'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}
export const FetchPoolPrice = async (poolAddress: string, chainId: number) => {
  return await createPool(poolAddress, chainId)
}

async function createPool(poolAddress: string, chainId: number) {
  const [immutables, state] = await Promise.all([
    getPoolImmutables(poolAddress),
    getPoolState(),
  ])

  const ctTokenA = await getContract(immutables.token0, ERC20ABI)
  const ctTokenB = await getContract(immutables.token1, ERC20ABI)

  const TokenA = new Token(
    chainId,
    immutables.token0,
    ctTokenA.decimals(),
    ctTokenA.symbol(),
    ctTokenA.name(),
  )
  const TokenB = new Token(
    chainId,
    immutables.token1,
    ctTokenB.decimals(),
    ctTokenB.symbol(),
    ctTokenB.name(),
  )

  const pool = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick,
  )

  return pool
}

async function getContract(contractAddress: string, abi: any, signer?: any) {
  return new ethers.Contract(
    contractAddress,
    abi,
    signer ? signer : ethers.provider,
  )
}

async function getPoolImmutables(poolAddress: string) {
  const poolContract = await getContract(poolAddress, IUniswapV3PoolABI)

  const [
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  ] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ])

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  }
  return immutables
}

async function getPoolState() {
  const poolContract = await getPoolContract()

  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ])

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }

  return PoolState
}
