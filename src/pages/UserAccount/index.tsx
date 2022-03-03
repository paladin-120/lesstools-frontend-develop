import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';

import { useMst } from '../../store/store';
import { useWeb3Context } from '../../contexts/Web3Connector';
import { Web3Service } from '../../services/web3/index';
import backend from '../../services/backend';
import VerifiedPage from './VerifiedPage/index';
// import { CardsSlider } from '../MainPage/UsersPlans/index';
import InfoModal from '../../components/Modals/InfoModal/index';

import s from './UserAccount.module.scss';

const web3 = new Web3Service();

const UserAccount: React.FC = observer(() => {
  const { user } = useMst();
  const { handleInit } = useWeb3Context();

  const verifyUser = async () => {
    const messageToSign = await backend.getMetamaskMessage();
    const signedStr = await web3.signMessage({
      userAdress: user.walletId || '',
      message: messageToSign.data,
    });
    const token = await backend.postMetamaskLogin({
      address: user.walletId || '',
      msg: messageToSign.data,
      signed_msg: signedStr,
    });
    if (token.data.key) {
      user.setIsUserVerified(true);
      localStorage.setItem('lesstools_token', token.data.key);
      const res = await backend.getUserPlan();
      if (res.data) {
        user.setLessBalance(res.data.holdings.ethereum ? res.data.holdings.ethereum : 0);
        user.setUserPlan({
          planByHolding: res.data.plan_by_holding,
          planByPayments: res.data.plan_by_payments,
        });
      }
    }
  };

  return (
    <main className={s.page}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Account - LessTools</title>
        <meta
          name="description"
          content="Multi-Chain Decentralized
Fundraising Capital"
        />
      </Helmet>
      <InfoModal />
      <div className={s.container}>
        {!user.isVerified ? (
          <>
            <div className={s.block}>
              <div className={s.block_inner}>
                <div className={s.block_title}>Connect your Wallet</div>
                <div className={s.block_subtitle}>Connect your wallet with LessTools.</div>
                {user.walletId ? (
                  <div className={s.block_button}>
                    {user.walletId.slice(0, 8)}...{user.walletId.slice(-5)}
                  </div>
                ) : (
                  <div
                    role="button"
                    className={s.block_button}
                    tabIndex={0}
                    onKeyDown={() => {}}
                    onClick={() => handleInit()}
                  >
                    Connect to Metamask
                  </div>
                )}
              </div>
            </div>
            <div className={s.block}>
              <div className={s.block_inner}>
                <div className={s.block_title}>Verify your wallet</div>
                <div className={s.block_subtitle}>
                  <p>Verify your wallet into LessTools</p>
                  <p>By verifying your wallet we will validate the ownership of your wallet.</p>
                </div>
                {user.isVerified ? (
                  <div className={s.block_button}>Verified wallet</div>
                ) : (
                  <button
                    className={`${s.block_button} ${!user.walletId && s.grey}`}
                    disabled={!user.walletId}
                    type="button"
                    onKeyDown={() => {}}
                    onClick={() => verifyUser()}
                  >
                    Verify your wallet
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <VerifiedPage />
        )}
        {/* <CardsSlider userPlan={user.userPlan} /> */}
      </div>
    </main>
  );
});

export default UserAccount;
