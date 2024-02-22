import React from "react";
import UploadForm from "./file-validaton/UploadForm";

function App() {
  const handleValidate = (templateFile, textFile) => {
    // Your validation logic goes here
    // Return a promise with the validation result
    return new Promise((resolve, reject) => {
      // Simulated validation result for demonstration
      const validationResult = {
        status: "success",
        errors: [
          {
            columnName: "DATE",
            format: "It should follow {MM-DD-YYYY} format.",
            expectedFormat: "{MM-DD-YYYY}",
            value: "01-02-12344",
            lineNo: 2,
          },
          {
            columnName: "GENDER",
            format:
              "It should be from [male|female|other|Preferred not to say]",
            expectedFormat: "[male|female|other|Preferred not to say]",
            value: "females",
            lineNo: 3,
          },
        ],
        dataFileContent:
          "SSN:123-11-1234\r\nDATE:01-02-12344\r\nGENDER:females",
        errorDetails: {
          DATE: {
            2: "01-02-12344",
          },
          GENDER: {
            3: "females",
          },
        },
      };

      // Simulating an asynchronous operation
      setTimeout(() => {
        resolve(validationResult);
      }, 1000);
    });
  };

  return (
    <div className="App">
      <UploadForm onValidate={handleValidate} />
    </div>
  );
}

export default App;
