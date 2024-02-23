// DataTable.js

import React, { useState, useEffect } from "react";

const DataTable = ({ validationResult, rulesFile }) => {
  const [editedData, setEditedData] = useState({});
  const [editedContent, setEditedContent] = useState("");

  const handleInputChange = (columnName, value) => {
    setEditedData((prevState) => ({
      ...prevState,
      [columnName]: value,
    }));
  };

  useEffect(() => {
    const originalContent = validationResult.dataFileContent.split("\n");

    // Construct edited data content
    const content = originalContent
      .map((line) => {
        const [columnName, originalValue] = line.split(":");
        const editedValue =
          editedData[columnName] !== undefined
            ? editedData[columnName]
            : originalValue;
        return `${columnName}:${editedValue}`;
      })
      .join("\n");

    setEditedContent(content);
  }, [editedData, validationResult.dataFileContent]);

  const handleValidate = () => {
    // Create a new Blob with the edited content

    const updatedContent = editedContent.replace(/:undefined/g, "");

    console.log(updatedContent);

    const editedFile = new Blob([updatedContent], { type: "text/plain" });

    // Create a FormData object to hold both files
    const formData = new FormData();
    formData.append("rulesFile", rulesFile);
    formData.append("dataFile", editedFile);

    // Make the POST request with both files
    fetch("https://filevalidator.azurewebsites.net/validate", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response if needed
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const dataRows = validationResult.dataFileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Validation Errors</h2>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border border-gray-200">Column Name</th>
              <th className="py-2 px-4 border border-gray-200">Value</th>
              <th className="py-2 px-4 border border-gray-200">Status</th>
              <th className="py-2 px-4 border border-gray-200">
                Expected Format
              </th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, index) => {
              const [columnName, value] = row.split(":");
              const canEdit = ["DATE", "GENDER"].includes(columnName);
              const editedValue =
                editedData[columnName] !== undefined
                  ? editedData[columnName]
                  : value;
              const error = validationResult.errors.find(
                (error) => error.columnName === columnName
              );
              const status = error ? "failed" : "pass";
              const format = error ? error.format : "";
              return (
                <tr key={index} className="bg-white">
                  <td className="py-2 px-4 border border-gray-200">
                    {columnName}
                  </td>
                  <td className="py-2 px-4 border border-gray-200">
                    {canEdit ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                        value={editedValue}
                        onChange={(e) =>
                          handleInputChange(columnName, e.target.value)
                        }
                      />
                    ) : (
                      <span>{editedValue}</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border border-gray-200">{status}</td>
                  <td className="py-2 px-4 border border-gray-200">{format}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          onClick={handleValidate}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DataTable;
