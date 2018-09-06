import React from 'react'
import PropTypes from "prop-types";

export const Row = ({row, column}) => {
  const { type, name } = column;
  let content;
  console.log('type', type);
  console.log('row[name]', row[name]);
  switch(type.toLowerCase()) {
    case 'text': 
      content = row[name];
      break;
    case 'checkbox': 
      content = <input type="checkbox" defaultChecked={row[name]} disabled></input>
      break;
    default: 
      content = row[name];
      break;
  }

  return(
    <div className="flex-1 flex-r-center">
      {content}
    </div>
  )
}

Row.propTypes = {
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
};

export default Row