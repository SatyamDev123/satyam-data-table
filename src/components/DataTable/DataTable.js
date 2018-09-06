import React, { Component } from 'react'
import PropTypes from "prop-types";
import './DateTable.css';

import { isEqual } from 'lodash';

import CustomFilter from './CustomFilter/CustomFilter';
import Pagination from './Pagination/Pagination';
import Row from './Row/Row';

class DataTable extends Component {

  static propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.defaultCustomFilter = {column: '', value: ''};
    this.pageLimt = 20;

    this.state = {
      rows: this.handlePageLimt(props.rows),
      currentPage: null,
      totalPages: null
    }
  }

  handlePageLimt = rows => rows.slice(0, this.pageLimt)

  onPageChanged = data => {
    const { rows } = this.props;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentRows = rows.slice(offset, offset + pageLimit);

    this.setState({
      currentPage,
      rows: currentRows, 
      totalPages 
    });
  };

  componentWillReceiveProps({rows}) {
    if (!isEqual(rows,this.state.rows)) {
      this.setState({
        rows: this.handlePageLimt(rows)
      })
    }
  }

  handleColumnFilter = (e, column) => {
    const {value} = e.target;
    const { rows } = this.props;
    const filteredRows = rows.filter(row => {
      const lowerCaseRowValue = row[column].toLowerCase();
      const lowerCaseValue = value.toLowerCase();
      return lowerCaseRowValue.includes(lowerCaseValue);
    })
    this.setState({
      rows: value !== '' ? 
        this.handlePageLimt(filteredRows) : this.handlePageLimt(rows)
    })
  }

  handleSelectedCustomFilterChange = ({target: {value}}, allCustomFilters) => {
    const { rows } = this.props;
    const { filters } = allCustomFilters.filter(({name}) => name === value)[0];
    const filterRows = rows.filter(rowObject => {
      let isTrue = null;
      filters.filter(({column, value}) => {
        for (let rowColumnName in rowObject) {
          if (rowColumnName === column) {
            const lowerCaseRowValue = String(rowObject[column]).toLowerCase();
            const lowerCaseValue = String(value).toLowerCase();
            const isValid = lowerCaseRowValue === lowerCaseValue;
            isTrue = isTrue === null ? isValid : isValid && isTrue;
          }
        }
      })
      return isTrue;
    })
    this.setState({
      rows: filterRows
    })
  }

  render () {
    const { 
      props: {
        columns
      },
      state: {
        rows
      }
    } = this;
    
    return (
      <div>
        <CustomFilter 
          columns={columns}
          handleSelectedCustomFilterChange={this.handleSelectedCustomFilterChange}
        />
        <Pagination
            totalRecords={this.props.rows.length}
            pageLimit={this.pageLimt}
            pageNeighbours={1}
            onPageChanged={this.onPageChanged}
            />
        <div className="flex-r columns">
          {
            columns.map(column => 
              <div className="flex-1 column flex-c-center">
                <div className="m-b-10 font-bold">
                  {column.displayName}
                </div>
                <div>
                  <input onChange={(e) => this.handleColumnFilter(e,column.name)} />
                </div>
              </div>
            )
          }
        </div>
        <div className="rows">
          {
            rows.map(row => 
              <div className="flex-r row">
                {
                  columns.map(column => 
                    <Row column={column} row={row} />
                  )
                }  
              </div>
            )
          }
          {!rows.length && <div className="flex-r-center m-20">No data found</div>}
        </div>
      </div>
    )
  }
}

export default DataTable