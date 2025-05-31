// https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
function convertToCSV(arr) {
    const array = [Object.keys(arr[0])].concat(arr)
  
    return array.map(it => {
      return Object.values(it).toString()
    }).join('\n')
  }

const exportCSV = (object) => {

    const csvText = convertToCSV(object)

    const downloadObject = `data:text/plain;chatset=utf-8,${csvText}`;

    const link = document.createElement("a");
    link.href = downloadObject;
    link.download = "data.csv";

    link.click();
};

export default exportCSV;
