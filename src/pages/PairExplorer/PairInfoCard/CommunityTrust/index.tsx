import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import backend from '../../../../services/backend/index';
import { useMst } from '../../../../store/store';

import s from './CommunityTrust.module.scss';

import thumbUp from '../../../../assets/img/icons/thumb-up.svg';
import thumbDown from '../../../../assets/img/icons/thumb-down.svg';

interface ICommunityTrust {
  likes: number;
  dislikes: number;
  currentVote: 0 | 1 | -1;
  pairId: string;
}

interface IVoteItem {
  voteType: 1 | -1;
  percent: string;
  vote: (voteType: 1 | -1) => void;
  isDisabled: boolean;
  currentUserVote: 0 | 1 | -1;
}

const VoteItem: React.FC<IVoteItem> = ({
  voteType,
  percent,
  vote,
  isDisabled,
  currentUserVote,
}) => {
  return (
    <div
      data-tip="To vote u should verify your wallet"
      data-place={voteType === 1 ? 'right' : 'top'}
      data-effect="solid"
      data-tip-disable={!isDisabled}
      className={`${s.vote} ${currentUserVote === voteType && s.active}`}
    >
      <button
        className={s.vote_img}
        onClick={() => vote(voteType)}
        onKeyDown={() => {}}
        tabIndex={0}
        disabled={isDisabled}
        type="button"
      >
        <img src={voteType === 1 ? thumbUp : thumbDown} alt="vote" />
      </button>
      <div className={s.vote_count}>{percent}%</div>
    </div>
  );
};

const CommunityTrust: React.FC<ICommunityTrust> = observer(
  ({ likes, dislikes, currentVote, pairId }) => {
    const { user } = useMst();
    const [currentUserVote, setCurrentUserVote] = useState(currentVote);
    const [likesAmount, setLikesAmount] = useState(likes);
    const [dislikesAmount, setDislikesAmount] = useState(dislikes);

    useEffect(() => {
      setCurrentUserVote(currentVote);
      setDislikesAmount(dislikes);
      setLikesAmount(likes);
    }, [currentVote, likes, dislikes]);

    const vote = async (voteType: 1 | -1) => {
      const res = await backend.voteForPair({
        pair_address: pairId,
        platform: 'ETH',
        vote: voteType,
        token: localStorage.getItem('lesstools_token') || '',
      });
      if (res.data) {
        setCurrentUserVote(res.data?.vote);
        setLikesAmount(res.data.pair.likes);
        setDislikesAmount(res.data.pair.dislikes);
      }
    };

    return (
      <section className={s.block}>
        <div className={s.block_inner}>
          <div className={s.title}>Community Trust</div>
          <div className={s.votes}>
            <VoteItem
              vote={vote}
              voteType={1}
              percent={(likesAmount + dislikesAmount > 0
                ? (likesAmount / (likesAmount + dislikesAmount)) * 100
                : 0
              ).toFixed(2)}
              isDisabled={!user.isVerified}
              currentUserVote={currentUserVote}
            />
            <div className={s.info}>
              <div className={s.info_count}>
                <span>({likesAmount + dislikesAmount} votes)</span>
              </div>
              <div className={s.info_bar}>
                <div
                  className={s.info_bar__bg}
                  style={{
                    width: `${
                      likesAmount ? (likesAmount / (likesAmount + dislikesAmount)) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <VoteItem
              vote={vote}
              voteType={-1}
              percent={(likesAmount + dislikesAmount > 0
                ? (dislikesAmount / (likesAmount + dislikesAmount)) * 100
                : 0
              ).toFixed(2)}
              isDisabled={!user.isVerified}
              currentUserVote={currentUserVote}
            />
          </div>
        </div>
      </section>
    );
  },
);

export default CommunityTrust;
