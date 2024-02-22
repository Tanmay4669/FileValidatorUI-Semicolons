import React, { useState } from "react";

function Result({ validationResult }) {
  const [editedErrors, setEditedErrors] = useState({});

  const handleInputChange = (fieldName, lineNo, value) => {
    setEditedErrors({
      ...editedErrors,
      [`${fieldName}-${lineNo}`]: value,
    });
  };

  return (
    <div className=" mt-20 bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full">
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
                    <button className="bg-blue-500 hover:bg-blue-600 transition-colors duration-300 text-white font-bold py-2 px-4 rounded">
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
    </div>
  );
}

export default Result;
