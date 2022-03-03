import { useState, useEffect } from 'react';

import s from '../PairInfoBody.module.scss';

// import scoreBg from '../../../../../assets/img/icons/less-score-bg.svg';

interface ILessScoreProps {
  txCount: string;
  holdersCount: number;
  cost24H: number;
  links: Array<string>;
  totalLiquidity: string;
}

const LessScore: React.FC<ILessScoreProps> = ({
  txCount,
  holdersCount,
  cost24H,
  links,
  totalLiquidity,
}) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let newScore = 0;

    if (+txCount > 1_000_000) {
      newScore += 29;
    } else if (+txCount > 100_000) {
      newScore += 19;
    } else if (+txCount > 5_000) newScore += 9;

    if (holdersCount > 50_000) {
      newScore += 29;
    } else if (holdersCount > 10_000) {
      newScore += 19;
    } else if (holdersCount > 1_000) newScore += 9;

    if (+cost24H > 15) {
      newScore += 9;
    } else if (+cost24H > 5) newScore += 4;

    if (links.length > 0) newScore += 9;

    if (+totalLiquidity > 1_000_000) {
      newScore += 19;
    } else if (+totalLiquidity > 100_000) newScore += 9;

    setScore(newScore);
  }, [txCount, holdersCount, cost24H, links, totalLiquidity]);

  return (
    <div className={s.score}>
      <div className={s.score_info}>
        <div className={s.score_title}>LessScore</div>
        <div className={s.score_number}>
          <span>{score}%</span>
        </div>
      </div>
    </div>
  );
};

export default LessScore;
