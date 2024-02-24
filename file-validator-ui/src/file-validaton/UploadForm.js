import React, { useState } from "react";
import DataTable from "./DataTable";
import { Loader } from "../common/Loader";
import { DialogBox } from "../common/DialogBox";
import "./UploadForm.css";

function UploadForm() {
  const [rulesFile, setRulesFile] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage validation result

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
      setIsLoading(true);
      // Example API call using fetch
      fetch("https://validator2.azurewebsites.net/validate", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          // Handle API response
          setValidationResult(result); // Update state with validation result
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      console.log("Please upload both files before validating.");
    }
  };

  // Check if both files are uploaded
  const isValidationDisabled = !rulesFile || !dataFile;
  const downloadTxtFile = (data) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `validated_file_${Date.now()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  const onYesClick = () => {
    if (validationResult.status === "success") {
      downloadTxtFile(validationResult.dataFileContent);
    }
    setValidationResult(null);
    setDataFile(null);
    setRulesFile(null);
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h2 className="mb-4 text-bold text-4xl font-bold ">File Validator</h2>
        <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full card">
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
                  className="bg-[#020381] hover:bg-gray-100 hover:text-[#020381] transition-colors duration-300 cursor-pointer rounded-lg px-4 py-2 text-white text-base font-semibold shadow-md"
                >
                  Select File
                </label>
                {rulesFile && (
                  <span className="text-sm text-gray-500">
                    {rulesFile.name}
                  </span>
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
                  className="bg-[#020381] hover:bg-gray-100 hover:text-[#020381] transition-colors duration-300 cursor-pointer rounded-lg px-4 py-2 text-white text-base font-semibold shadow-md"
                >
                  Select File
                </label>
                {dataFile && (
                  <span className="text-sm text-gray-500">{dataFile.name}</span>
                )}
              </div>
            </div>
            <button
              className={`${
                isValidationDisabled
                  ? "bg-gray-300   cursor-not-allowed"
                  : "bg-[#020381] hover:bg-gray-100 hover:text-[#020381]"
              } transition-colors duration-300 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg`}
              onClick={handleValidate}
              disabled={isValidationDisabled}
            >
              Validate
            </button>
          </div>
        </div>
        {validationResult?.status === "failed" ? (
          <DataTable
            validationResult={validationResult}
            rulesFile={rulesFile}
            onYesClick={onYesClick}
          />
        ) : null}
        {/* Pass rulesFile as a prop to the Result component */}
      </div>
      {isLoading ? <Loader isLoading={isLoading} /> : null}
      <DialogBox
        open={validationResult?.status === "success" ? true : false}
        onClick={onYesClick}
      />
    </>
  );
}

export default UploadForm;
