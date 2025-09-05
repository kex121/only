import { HistoricalFact } from '@utils/data/types';

import './fact-card.scss';

const FactCard = ({ fact }: { fact: HistoricalFact }) => (
  <div className="fact">
    <div className="fact_year">{fact.year}</div>
    <div className="fact_description" title={fact.description}>
      {fact.description}
    </div>
  </div>
);

export default FactCard;
