import Web3 from 'web3';

declare global {
  interface Window {
    web3: Web3;
    ethereum: any;
  }
}

type SignMessageProps = {
  userAdress: string;
  message: string;
};

export class Web3Service {
  public provider: any;

  public web3Provider: any;

  constructor() {
    this.provider = window.ethereum;
    this.web3Provider = new Web3(this.provider);
  }

  public connect = async () => {
    return this.provider.request({ method: 'eth_requestAccounts' });
  };

  public getBalance = async (walletId: string) => {
    const balance = await this.web3Provider.eth.getBalance(walletId);
    return balance;
  };

  public signMessage = async ({ userAdress, message }: SignMessageProps) => {
    try {
      return await this.web3Provider.eth.personal.sign(message, userAdress);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
