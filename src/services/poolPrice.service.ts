import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Token } from "@uniswap/sdk-core";
import { abi as ERC20ABI } from "../utils/abi/erc20-abi";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";

interface Immutables {
  factory: string;
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  maxLiquidityPerTick: ethers.BigNumber;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
  observationIndex: number;
  observationCardinality: number;
  observationCardinalityNext: number;
  feeProtocol: number;
  unlocked: boolean;
}

export class PoolPriceService {
  public get(): any {
    return FetchPoolPrice();
  }

  public getAllPricesOfPool(): any {
    

    return {};
  }
}



// below, logic to fetch pool price

// export const FetchPoolPrice = async (poolAddress: string, chainId: number) => {
export const FetchPoolPrice = async () => {
  // return await createPool(poolAddress, chainId);
  return await createPool();
};

// async function createPool(poolAddress: string, chainId: number) {
async function createPool() {
  const [immutables, state] = await Promise.all([
    // getPoolImmutables(poolAddress),
    getPoolImmutables(),
    getPoolState(),
  ]);
  console.log(immutables, state);
  const ctTokenA = await getContract(immutables.token0, ERC20ABI);
  const ctTokenB = await getContract(immutables.token1, ERC20ABI);
  
  console.log('ctt', ctTokenA.address, ctTokenB.address);

  // Token dando erro
  const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')
  const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')

  // const TokenA = new Token(
  //   1, //chainId,
  //   immutables.token0,
  //   ctTokenA.decimals(),
  //   ctTokenA.symbol(),
  //   ctTokenA.name()
  // );
  // const TokenB = new Token(
  //   1, //chainId,
  //   immutables.token1,
  //   ctTokenB.decimals(),
  //   ctTokenB.symbol(),
  //   ctTokenB.name()
  // );

  console.log('tokens', TokenA, TokenB);

  const pool = new Pool(
    TokenA,
    TokenB,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );
  console.log('pool', pool);

  return pool;
}

async function getContract(address:any ,abi: any, signer?: any) {
  const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";

  // const infuraKey = process.env.INFURA_KEY;
  // const alchemyEth = process.env.ETH;

  const tokens = {
    // ropsten: {
    //     address: "0x867d5aD572Eff4ec5E596FbC8B5E77E81f282D6c",
    //     provider_url: `https://ropsten.infura.io/v3/${infuraKey}`,
    //     abi,
    // },
    eth: {
      address: "0x0DFcd028b5AD0E789AcB8d1C5bE1218FA59bC62A",
      provider_url:
        "https://eth-mainnet.g.alchemy.com/v2/dVfk0JbYlzHpMU000lJZ39hrwf0f818u", //`${alchemyEth}`,
      id: 137,
      gasPriceGwei: 50,
    },
  };

  const provider = new ethers.providers.WebSocketProvider(
    tokens.eth.provider_url
  );

  const contractAddress = address ?? poolAddress;
  return new ethers.Contract(contractAddress, abi, signer ? signer : provider);
  // return new ethers.Contract(contractAddress, abi, signer ? signer : provider);
}

// async function getPoolImmutables(poolAddress: string) {
async function getPoolImmutables() {
  const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";

  // const poolContract = await getContract(poolAddress, IUniswapV3PoolABI);
  const poolContract = await getContract(poolAddress, IUniswapV3PoolABI);

  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
    await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  };
  return immutables;
}

async function getPoolState() {
  const poolAddress = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
  const poolContract = await getContract(poolAddress,IUniswapV3PoolABI);

  const [liquidity, slot] = await Promise.all([
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  };

  return PoolState;
}
