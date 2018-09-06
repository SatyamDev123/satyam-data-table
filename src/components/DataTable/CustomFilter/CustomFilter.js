import React, { Component } from 'react'
import PropTypes from 'prop-types';

class CustomFilter extends Component {

  static propTypes = {
    columns: PropTypes.array,
    handleSelectedCustomFilterChange: PropTypes.func.isRequired
  }

  state = {
    showCustomFilter: false,
    customFilterName: '',
    customFilters: [],
    allCustomFilters: [],
  }

  handleCustomFilderClick = () => {
    const { customFilters, showCustomFilter } = this.state;
    this.setState({
      showCustomFilter: !showCustomFilter,
      customFilters: !customFilters.length ? [this.defaultCustomFilter] : customFilters
    });
  }

  handleFilterNameChange = ({target: {value}}) => this.setState({customFilterName: value})

  handleAddMoreFiltersClick = () => {
    console.log('customFilters', this.state.customFilters);
    this.setState({
      customFilters: [...this.state.customFilters, this.defaultCustomFilter]
    })
  }

  handleCustomFilterColumnChange = ({target: {value}}, index) => {
    const { customFilters } = this.state;
    customFilters[index] = {...customFilters[index], column: value};
    this.setState({
      customFilters
    });
  }

  handleCustomFilterColumnInputChange =   ({target: {value}}, index) => {
    const { customFilters } = this.state;
    customFilters[index] = {...customFilters[index], value};
    this.setState({
      customFilters
    });
  }

  clearCustomFilterForm = () => ({
    customFilters: [],
    customFilterName: '',
    showCustomFilter: false
  })

  handleCustomFilterSaveClick = () => {
    const { customFilterName, customFilters, allCustomFilters } = this.state;
    if (customFilterName && customFilters.length) {
      this.setState({
        allCustomFilters: [...allCustomFilters, {
          name: customFilterName,
          filters: customFilters
        }],
        ...this.clearCustomFilterForm()
      })
    }
  }

  handleRemoveFiltersClick = (index) => {
    const { customFilters } = this.state;

    this.setState({
      customFilters: customFilters.filter((filter, FilterIndex) => FilterIndex !== index)
    });
  }

  handleCancel = () => {
    this.setState(this.clearCustomFilterForm())
  }

  render () {

    const { 
      props: {
        columns,
        handleSelectedCustomFilterChange
      },
      state: {
        showCustomFilter,
        customFilters,
        customFilterName,
        allCustomFilters
      }
    } = this;

    return (
      <div className="customFilters m-10 p-10">
          <div className="flex-r-center m-10">
            <label>Select Custom Filter</label>
            <select onChange={(e) => handleSelectedCustomFilterChange(e, allCustomFilters)}>
              <option value="" disabled selected>Select Custom Filters</option>
              {
                allCustomFilters.map(({name}) =>
                  <option value={name}>{name}</option>
                )
              }
            </select>
            <button onClick={this.handleCustomFilderClick}>Add custom filter</button>
          </div>
          {
            showCustomFilter && 
            <div className="flex-c-center">
              <div className="m-b-10">
                <label>Filter Name</label>
                <input value={customFilterName} onChange={this.handleFilterNameChange} />
              </div>
              <div className="m-b-10">
                {
                  customFilters.map((filter, index) => 
                    <div className="m-b-10">
                      <select onChange={(e) => this.handleCustomFilterColumnChange(e, index)}>
                        <option value="" disabled selected>Select Columns</option>
                        {
                          columns.map(column =>
                            <option value={column.name}>{column.displayName}</option>
                          )
                        }
                      </select>
                      <input onChange={(e) => this.handleCustomFilterColumnInputChange(e, index)} />
                      <button onClick={this.handleAddMoreFiltersClick}>Add more</button>
                      {index !== 0 && <button onClick={() => this.handleRemoveFiltersClick(index)}>Remove</button>}
                    </div>
                  )
                }
              </div>
              <div>
                  <button onClick={this.handleCustomFilterSaveClick}>Save</button>
                  <button onClick={this.handleCancel}>Cancel</button>
              </div>
            </div>
          }
        </div>
    )
  }
}

export default CustomFilter