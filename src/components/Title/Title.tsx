import { forwardRef } from 'react';

import './title.scss';

const Title = forwardRef<HTMLDivElement, NonNullable<unknown>>((_props, ref) => (
  <div ref={ref} className="title-container">
    <h1 className="title">
      Исторические <br />
      даты
    </h1>
  </div>
));

Title.displayName = 'Title';

export default Title;
