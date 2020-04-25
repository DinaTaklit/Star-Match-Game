import React from 'react';
import utils from '../math-utils';

// Extract stars as component and since a component should hold one sigle element and here we are using map we need to wrap it into a fragment
const StarsDisplay = (props) => (
    <>
        {utils.range(1, props.count).map((starId) => (
        <div key={starId} className="star" />
        ))}
    </>
);

export default StarsDisplay;
