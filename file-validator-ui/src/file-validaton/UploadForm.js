import React, { useState } from "react";
import Result from "./Result";

function UploadForm({ onValidate }) {
  const [templateFile, setTemplateFile] = useState(null);
  const [textFile, setTextFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // State to manage validation result

  const handleTemplateFileChange = (e) => {
    const file = e.target.files[0];
    setTemplateFile(file);
  };

  const handleTextFileChange = (e) => {
    const file = e.target.files[0];
    setTextFile(file);
  };

  const handleValidate = () => {
    // Pass files to the parent component for validation
    // onValidate(templateFile, textFile);
    onValidate(templateFile, textFile).then((result) => {
      setValidationResult(result); // Update state with validation result
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">File Validator</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="templateFile" className="text-gray-700">
              Upload Template File
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="templateFile"
                className="hidden"
                onChange={handleTemplateFileChange}
              />
              <label
                htmlFor="templateFile"
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md"
              >
                Choose File
              </label>
              {templateFile && (
                <span className="text-sm text-gray-500">
                  {templateFile.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="textFile" className="text-gray-700">
              Upload Text File
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="textFile"
                className="hidden"
                onChange={handleTextFileChange}
              />
              <label
                htmlFor="textFile"
                className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 cursor-pointer rounded-lg px-6 py-3 text-white text-lg font-semibold shadow-md"
              >
                Choose File
              </label>
              {textFile && (
                <span className="text-sm text-gray-500">{textFile.name}</span>
              )}
            </div>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-3 px-6 rounded-lg shadow-md text-lg"
            onClick={handleValidate}
          >
            Validate
          </button>
        </div>
      </div>
      {validationResult && <Result validationResult={validationResult} />}{" "}
      {/* Render Result component only when there are validation results */}
    </div>
  );
}

export default UploadForm;
