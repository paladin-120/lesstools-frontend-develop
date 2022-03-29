// import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import BigNumber from 'bignumber.js/bignumber';
// import backend from '../../../services/backend';

import { useWeb3Context } from '../../../contexts/Web3Connector';
import { useMst } from '../../../store/store';
// import config from '../../../config/index';

import s from '../UserAccount.module.scss';

// import checkMark from '../../../assets/img/icons/checkmark.svg';

// const SECONDS_FOR_UPDATE = 60000;

const VerifiedPage: React.FC = observer(() => {
  const { disconect } = useWeb3Context();
  // const [isCheckMark, setIsCheckMark] = useState(false);
  const { user } = useMst();

  // const [prices, setPrices] = useState<{ holding: number; payment: number }>({
  //   holding: 50000,
  //   payment: 100,
  // });

  // const getPlanPrices = async () => {
  // const res = await backend.getPlanPrices();
  // setPrices({ holding: res.data.holding_amount_in_less, payment: res.data.monthly_price_in_usd });
  // };

  // useEffect(() => {
  // getPlanPrices();
  // }, []);

  // pooling subscription data
  // const [timer, setTimer] = useState(SECONDS_FOR_UPDATE / 1000);
  // const [timersIds, setTimersIds] = useState<Array<NodeJS.Timeout>>([]);

  // const updateUserPlan = async () => {
  //   const res = await backend.getUserPlan();

  //   if (res.data) {
  //     user.setLessBalance(res.data.holdings['bsc testnet']);
  //     user.setUserPlan({
  //       planByHolding: res.data.plan_by_holding,
  //       planByPayments: res.data.plan_by_payments,
  //     });
  //   }
  //   return res.data;
  // };

  // const checkingUserPlan = async () => {
  //   updateUserPlan();

  //   const timerSecondsId = setInterval(() => {
  //     setTimer((prevState) => prevState - 1);
  //   }, 1000);
  //   setTimersIds((prev) => [...prev, timerSecondsId]);

  //   const timerId = setInterval(async () => {
  //     const data = await updateUserPlan();

  //     if (data.plan_by_holding === 'Free' && data.plan_by_payments === 'Free') {
  //       setTimer(SECONDS_FOR_UPDATE / 1000);
  //     } else {
  //       clearInterval(timerSecondsId);
  //       clearInterval(timerId);
  //     }
  //   }, SECONDS_FOR_UPDATE);
  //   setTimersIds((prev) => [...prev, timerId]);
  // };

  // useEffect(() => {
  //   return () => {
  //     timersIds.forEach((timerId) => clearInterval(timerId));
  //   };
  // }, [timersIds]);

  return (
    <>
      <div className={s.block}>
        <div className={s.block_inner}>
          <div className={`${s.block_title} ${s.verification}`}>Verified Wallet</div>
          <div className={s.block_wallet}>
            <span>{user.walletId?.slice(0, 25)}...</span>
          </div>
          <div className={s.block_balance}>
            Balance: <span>{new BigNumber(user.lessBalance).toFormat(0)} Less</span>
          </div>
          <button
            type="button"
            onClick={() => disconect()}
            className={`${s.block_button} ${s.grey}`}
          >
            Disconnect wallet
          </button>
        </div>
      </div>
      {/* {[user.planByHolding, user.planByPayments].some((plan) => plan !== 'Free') ? (
        <div className={s.block}>
          <div className={s.block_inner}>
            <div className={s.block_title}>Your wallet have an active subscription</div>
            <div className={s.block_wallet}>
              Subscription: <span>{user.userPlan}</span>{' '}
            </div>
            <div className={s.block_group}>
              <div className={s.block_group__text}>Plan by holding: {user.planByHolding}</div>
              <div className={s.block_group__text}>Plan by payments: {user.planByPayments}</div>
            </div>
            {user.userPlan === 'Standard' && (
              <div className={s.block_subtext}>
                To get a PREMIUM plan you need to hold{' '}
                {new BigNumber(prices.holding * 2).toFormat(0)} LESS or pay{' '}
                {user.planByPayments === user.userPlan ? prices.payment : prices.payment * 2}$ /
                Monthly Subscription
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={s.block}>
          <div className={s.block_header}>
            ${prices.payment} paid / Monthly Subscription <br /> or <br />
            {new BigNumber(prices.holding).toFormat(0)} Less / HOLD
          </div>
          <div className={s.block_inner}>
            <div className={s.block_subtitle}>Your wallet does not have an active subscription</div>
            <div className={`${s.block_title} ${s.verification}`}>Step 1</div>
            <div className={s.block_subtitle}>
              Send ${prices.payment} in native currency of Ethereum or BSC networks or in LESS token
              to the specified address:
            </div>
            <div className={s.block_wallet}>
              <span>{config.WALLET_TO_PAY}</span>
            </div>
            <div className={s.block_subtext}>
              * if you send funds from another account or an exchange those funds will be lost.
            </div>
            <div className={s.check}>
              <button
                type="button"
                onClick={() => {
                  setIsCheckMark(true);
                  checkingUserPlan();
                }}
                aria-label="check"
                className={`${s.check_mark} ${isCheckMark && s.active}`}
              >
                <img src={checkMark} alt="checkMark" />
              </button>
              <div className={s.block_title}>Step 2</div>
            </div>
            <div className={s.block_subtitle}>
              {isCheckMark
                ? 'We are checking your transfer. This may take 5 minutes.'
                : 'I’ve already done the transfer'}
            </div>
            {isCheckMark && <div className={s.block_subtitle}>Time to next check: {timer}</div>}
          </div>
        </div>
      )} */}
    </>
  );
});

export default VerifiedPage;
