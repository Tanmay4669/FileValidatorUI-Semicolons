import React, { useState } from "react";
import DataTable from "./DataTable";

function UploadForm() {
  const [rulesFile, setRulesFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // State to manage validation result

  const handlerulesFileChange = (e) => {
    const file = e.target.files[0];
    setRulesFile(file);
  };

  const handledataFileChange = (e) => {
    const file = e.target.files[0];
    setDataFile(file);
  };

  const handleValidate = () => {
    // Check if both rulesFile and dataFile are selected
    if (rulesFile && dataFile) {
      // Make API call with both files
      const formData = new FormData();
      formData.append("rulesFile", rulesFile);
      formData.append("dataFile", dataFile);

      // Example API call using fetch
      fetch("https://validator2.azurewebsites.net/validate", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // Handle API response
          setValidationResult(result); // Update state with validation result
          console.log("Print Data", result);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Please upload both files before validating.");
    }
  };

  // Check if both files are uploaded
  const isValidationDisabled = !rulesFile || !dataFile;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">File Validator</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="rulesFile" className="text-gray-700">
              Upload Rules File (.txt)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="rulesFile"
                className="hidden"
                accept=".txt" // Accept only .txt files
                onChange={handlerulesFileChange}
              />
              <label
                htmlFor="rulesFile"
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md"
              >
                Choose File
              </label>
              {rulesFile && (
                <span className="text-sm text-gray-500">{rulesFile.name}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="dataFile" className="text-gray-700">
              Upload Data File (.txt)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="dataFile"
                className="hidden"
                accept=".txt" // Accept only .txt files
                onChange={handledataFileChange}
              />
              <label
                htmlFor="dataFile"
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md"
              >
                Choose File
              </label>
              {dataFile && (
                <span className="text-sm text-gray-500">{dataFile.name}</span>
              )}
            </div>
          </div>
          <button
            className={`${
              isValidationDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition-colors duration-300 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg`}
            onClick={handleValidate}
            disabled={isValidationDisabled}
          >
            Validate
          </button>
        </div>
      </div>
{validationResult && (
        <DataTable validationResult={validationResult} rulesFile={rulesFile} />
      )}
      {/* Pass rulesFile as a prop to the Result component */}
    </div>
  );
}

export default UploadForm;
