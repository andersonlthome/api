import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import dotenv from 'dotenv'

dotenv.config()

const { ETH, ETHERSCAN, ETH_ACC_1 } = process.env

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  gasReporter: {
    enabled: true,
  },
  networks: {
    hardhat: {
      forking: {
        url: `${ETH}`,
        blockNumber: 15677043,
      },
    },
    ethereum: {
      url: `${ETH}`,
      accounts: [`${ETH_ACC_1}`],
    },
  },
  etherscan: {
    apiKey: `${ETHERSCAN}`,
  },
}

export default config
