import React, {Component} from 'react';
import './App.css';
import XLSX from 'xlsx';

import DataTabel from './components/DataTable/DataTable';

const useworker = typeof Worker !== 'undefined';


class App extends Component {

  state = {
    columns: [],
    rows: []
  }

  addRows = (rowCount) => {
    const columns = [
      {
        type: 'text',
        name: 'firstName',
        displayName: 'First Name'
      },
      {
        type: 'text',
        name: 'lastName',
        displayName: 'Last Name'
      },
      {
        type: 'number',
        name: 'age',
        displayName: 'Age'
      },
      {
        type: 'checkbox',
        name: 'married',
        displayName: 'Married'
      },
    ];
    const rows = [];
    for (let index = 0; index < rowCount; index++) {
      rows.push({
        firstName: `Satyam--${index}`,
        lastName: `Dev--${index}`,
        age: `26--${index}`,
        married: !index
      });
    }

    this.setState({
      columns,
      rows
    });
  }

  importFiles = (files) => {
    let csvFile = files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      try {
      const csvData = {
        fields: [],
        data: []
      };
      const workbook = XLSX.read(data, {type: 'binary'});
      if (useworker && workbook.SSF) 
        XLSX.SSF.load_table(workbook.SSF);
        const sheetName = workbook.SheetNames[0];
        const result = XLSX
          .utils
          .sheet_to_json(workbook.Sheets[sheetName], {header: 1}) || [];
          result.forEach((resultRow, index) => {
            if (index === 0) { // fields
              csvData.fields = [
                ...csvData.fields,
                ...resultRow
              ];
            } else {
              if (resultRow.length) {
                const csvDataRow = {};
                csvData
                  .fields
                  .forEach((field, fieldIndex) => {
                    csvDataRow[field] = resultRow[fieldIndex] || '';
                  });
                  csvData
                    .data
                    .push(csvDataRow);
              }
            }
          });
          const isDataEmpty = csvData.data.length;
          if (isDataEmpty) {
            const columns = [];
            const rows = [];
            const { fields, data } = csvData;
            fields.forEach(field => {
              columns.push({
                type: 'text',
                name: field,
                displayName: field
              });
            });
            this.setState({
              columns,
              rows: data
            })
          } else {
            alert('Please enter valid csv');
          }
        } catch (e) {
          console.log('reader onload', e);
        }
      }
      reader.onerror = function (ex) {
        console.log('reader onerror', ex);
      };
      reader.readAsBinaryString(csvFile);
    }

    handleFilesChange = (({target: {files}}) => this.importFiles(files))

  render() {
    const {
      state: {
        columns,
        rows
      }
    } = this;
    return (
      <div className="App">
        <div className="m-10 p-10 flex-r-around">
          <button onClick={() => this.addRows(500)}>Add 500 rows</button>
          <button onClick={() => this.addRows(1000)}>Add 1000 rows</button>
          <button onClick={() => this.addRows(5000)}>Add 5000 rows</button>
          <div className="ImportFilesContainer">
            <label htmlFor="ImportFiles" className="flex-r-center-center">
              Import CSV or Excel
            </label>
            <input
              id="ImportFiles"
              type="file"
              name="ImportFiles"
              accept=".csv,.xls,.xlsx"
              onChange={this.handleFilesChange}/>
          </div>
        </div>
        {
          !!columns.length &&
          <DataTabel columns={columns} rows={rows}/>
        }
      </div>
    );
  }
}

export default App;
