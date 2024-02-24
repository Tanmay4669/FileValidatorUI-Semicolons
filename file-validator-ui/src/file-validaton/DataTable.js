// DataTable.js

import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { Loader } from "../common/Loader";

const DataTable = ({ validationResult, rulesFile }) => {
  const [editedData, setEditedData] = useState({});
  const [editedContent, setEditedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    // Make the POST request with both files
    fetch("https://validator2.azurewebsites.net/validate", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response if needed
        setIsLoading(false);
        console.log(data);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  const dataRows = validationResult.dataFileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const errorColumnNames = validationResult.errors.map(error=>error.columnName);

  return (
    <>
      <div className="w-[95%] m-16">
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <div className="bg-white p-8 rounded-lg justify-center shadow-lg w-full overflow-x-auto">
          <DataGrid
            //editMode="cell"
            processRowUpdate={(params) => {
              setEditedData((prevState) => ({
                ...prevState,
                [params.columnName]: params.value,
              }));
            }}
            columns={[
              { field: "columnName", headerName: "Column Name", flex: 1.5 },
              {
                field: "value",
                headerName: "Value (Editable)",
                editable: true,
                flex: 1,
              },
              { field: "status", headerName: "Status", flex: 1 },
              {
                field: "expectedFormat",
                headerName: "Expected Format",
                flex: 4,
              },
            ]}
            isCellEditable={(params) => errorColumnNames.includes(params.row.columnName)}
          rows={dataRows.map((row, index) => {
              const [columnName, value] = row.split(":");
              const errorColumns = validationResult.errors;
            console.log(errorColumns);
              const editedValue =
                editedData[columnName] !== undefined
                  ? editedData[columnName]
                  : value;
              const error = validationResult.errors.find(
                (error) => error.columnName === columnName
              );
              const status = error ? "failed" : "success";
              const format = error ? error.format : "";
              return {
                id: index,
                columnName: columnName,
                value: editedValue,
                status: status,
                expectedFormat: format,
              };
            })}
          />
          <button
            onClick={handleValidate}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      {isLoading ? <Loader isLoading={isLoading} /> : null}
    </>
  );
};

export default DataTable;
