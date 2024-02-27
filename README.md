# File Validator

The File Validator is a web application designed to validate data files against user-defined rules. It allows users to upload both a rules file (rules.txt) and a data file (data.txt). The application checks whether the data file satisfies the rules specified in the rules file for every field.

## Features

- **Rule-based Validation**: Validate data files against custom rules specified in `rules.txt`.
- **Dynamic Editing**: Edit data directly on the user interface and revalidate against the rules.
- **Database Storage**: Store validated data files in a database for future reference.
- **Automatic Download**: Automatically download validated data files upon successful validation.
- **Interactive UI**: User-friendly interface to view validation results, edit data, and submit changes.

## Usage

1. **Access the application:**
   Access the application in your web browser at [http://localhost:3000](http://localhost:3000).

2. **Upload files:**
   Upload `rules.txt` and `data.txt` files using the provided interface.

3. **Validation:**
   The application will validate the data file against the rules specified in `rules.txt`.

4. **Handling Validation Errors:**
   If validation fails:
   - View validation errors in a table on the UI.
   - Edit data fields as necessary.
   - Click "Submit" to revalidate the modified data.
   - Repeat until validation succeeds.

5. **Successful Validation:**
   If validation succeeds:
   - Validated data will be stored in the database.
   - The validated data file will be downloaded automatically.
   - Additionally, a new text file will be dynamically created with the modified data.

## Technologies Used

- ReactJS
- JavaScript
- HTML
- Tailwind CSS
- Material UI
- Java (Backend for validation; only API calls are used in this project)

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
