import React, { useState, useCallback } from "react";

function Result({ validationResult, rulesFile }) {
  const [editedErrors, setEditedErrors] = useState({});
  const [updatedContent, setUpdatedContent] = useState(
    validationResult.dataFileContent
  );

  const handleInputChange = useCallback((fieldName, lineNo, value) => {
    setEditedErrors((prevState) => ({
      ...prevState,
      [`${fieldName}-${lineNo}`]: value,
    }));
  }, []);

  const handleSave = useCallback(
    (fieldName, lineNo, value) => {
      setEditedErrors((prevState) => ({
        ...prevState,
        [`${fieldName}-${lineNo}`]: value,
      }));
      const lines = updatedContent.split("\n");
      lines[lineNo - 1] = `${fieldName}:${value}`;
      const newContent = lines.join("\n");
      setUpdatedContent(newContent);
    },
    [updatedContent]
  );

  const createEditedErrorsContent = useCallback(() => {
    let editedErrorsContent = "";
    Object.entries(editedErrors).forEach(([key, value]) => {
      const [fieldName, lineNo] = key.split("-");
      editedErrorsContent += `${fieldName}:${value}\n`;
    });
    return editedErrorsContent;
  }, [editedErrors]);

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("rulesFile", rulesFile);

    const editedErrorsFile = new File(
      [createEditedErrorsContent()],
      "editedData.txt",
      { type: "text/plain" }
    );

    formData.append("dataFile", editedErrorsFile);

    fetch("https://filevalidator.azurewebsites.net/validate", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Submission Result:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [createEditedErrorsContent, rulesFile]);

  return (
    <div className="mt-20 bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Validation Result
      </h2>
      {validationResult && (
        <div>
          {validationResult.status === "failed" ? (
            <div>
              <h3 className="text-red-500 mb-2">Errors Found:</h3>
              {validationResult.errors.map((error, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">{error.columnName}</p>
                  <p className="text-gray-600">
                    Expected Format: {error.expectedFormat}
                  </p>
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={
                        editedErrors[`${error.columnName}-${error.lineNo}`] ||
                        error.value
                      }
                      className="border rounded px-3 py-2 mr-2"
                      onChange={(e) =>
                        handleInputChange(
                          error.columnName,
                          error.lineNo,
                          e.target.value
                        )
                      }
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-2 px-4 rounded"
                      onClick={() =>
                        handleSave(
                          error.columnName,
                          error.lineNo,
                          editedErrors[`${error.columnName}-${error.lineNo}`]
                        )
                      }
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-500">No errors found in the file.</p>
          )}
        </div>
      )}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Updated Content:</h3>
        <textarea
          className="w-full h-48 border rounded-md px-4 py-2"
          value={updatedContent}
          onChange={(e) => setUpdatedContent(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={handleSubmit}
      >
        Validate
      </button>
    </div>
  );
}

export default Result;
