// DataTable.js

import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { Loader } from "../common/Loader";
import { DialogBox } from "../common/DialogBox";
import { Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./UploadForm.css";

const DataTable = ({ validationResult, rulesFile, onYesClick }) => {
  const [editedData, setEditedData] = useState({});
  const [editedContent, setEditedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editedValidationResult, setEditedValidationResult] = useState(null);
  const [initialValidationResult, setInitialValidationResult] =
    useState(validationResult);

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const originalContent = initialValidationResult.dataFileContent.split("\n");

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

    setTrigger(false);

    setEditedContent(content);
  }, [editedData, initialValidationResult.dataFileContent, trigger]);

  const handleValidate = () => {
    // Create a new Blob with the edited content

    const updatedContent = editedContent.replace(/:undefined/g, "");
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

        if (data.status === "success") {
        }

        setEditedValidationResult(data);
        setInitialValidationResult(data);
        setTrigger(true);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const dataRows = initialValidationResult.dataFileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const errorColumnNames = initialValidationResult.errors.map(
    (error) => error.columnName
  );

  const downloadTxtFile = (data) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `validated_file_${new Date().getDate()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const onDownload = () => {
    downloadTxtFile(editedValidationResult.dataFileContent);
  };

  return (
    <>
      <div className="w-[95%] m-16 z-50">
        <h2 className="text-2xl font-bold mb-4 z-50">Result</h2>
        <div className="bg-white p-8 rounded-lg justify-center shadow-lg w-full overflow-x-auto">
          {initialValidationResult?.status ? (
            <Box height={370}>
              <DataGrid
                headerClassName="header-column"
                initialState={{
                  ...initialValidationResult.initialState,
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                pageSizeOptions={[5, 25, 50]}
                key={trigger ? "reset" : "normal"}
                processRowUpdate={(params) => {
                  setEditedData((prevState) => ({
                    ...prevState,
                    [params.columnName]: params.value,
                  }));
                }}
                sx={{ border: "1px solid #ddd", fontWeight: "400px" }}
                columns={[
                  {
                    field: "columnName",
                    headerName: "Column Name",
                    flex: 1.5,
                    cellClassName: "header-column",
                    headerClassName: "header-column",
                  },
                  {
                    field: "value",
                    headerName: "Value",
                    editable: true,
                    flex: 1,
                    cellClassName: "header-column",
                    headerClassName: "header-column",
                    renderCell: (dataItem) => {
                      return (
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          width={"100%"}
                        >
                          <Box>{dataItem.value}</Box>
                          {dataItem?.row?.status === "failed" ? (
                            <EditIcon fontSize="small" />
                          ) : null}
                        </Box>
                      );
                    },
                  },
                  {
                    field: "status",
                    headerName: "Status",
                    flex: 1,
                    cellClassName: "header-column",
                    headerClassName: "header-column",
                    renderCell: (dataItem) => {
                      return (
                        <Box
                          color={dataItem.value === "failed" ? "red" : "green"}
                        >
                          {dataItem.value.charAt(0).toUpperCase() +
                            dataItem.value.slice(1)}
                        </Box>
                      );
                    },
                  },
                  {
                    field: "expectedFormat",
                    headerName: "Expected Format",
                    flex: 4,
                    cellClassName: "header-column",
                    headerClassName: "header-column",
                  },
                ]}
                isCellEditable={(params) =>
                  errorColumnNames.includes(params.row.columnName)
                }
                // onCellEditStop={(params, event) => {
                //   if(errorColumnNames.includes(params.row.columnName)){
                //     if (params.reason === GridCellEditStopReasons.cellFocusOut) {
                //       event.defaultMuiPrevented = true;
                //     }
                //   }
                //   else{
                //     return;
                //   }

                // }}
                rows={dataRows.map((row, index) => {
                  const [columnName, value] = row.split(":");
                  const editedValue =
                    editedData[columnName] !== undefined
                      ? editedData[columnName]
                      : value;
                  const error = initialValidationResult.errors.find(
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
            </Box>
          ) : null}
          <button
            onClick={handleValidate}
            className="mt-4 bg-[#020381] hover:bg-gray-100 hover:text-[#020381] text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
      {isLoading ? <Loader isLoading={isLoading} /> : null}
      <DialogBox
        open={editedValidationResult?.status === "success" ? true : false}
        onClick={() => {
          onYesClick();
          onDownload();
        }}
      />
    </>
  );
};

export default DataTable;
