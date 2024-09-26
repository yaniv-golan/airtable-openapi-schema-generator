# Airtable OpenAPI 3.1.0 Schema Generator for GPT Actions (Read-Only)

This script generates an OpenAPI 3.1.0 schema based on your Airtable base structure. The schema is designed to be used with Custom GPT (ChatGPT) Actions, allowing the GPT assistant to interact with your Airtable data via the Airtable API.

## Table of Contents

- [Purpose](#purpose)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Usage](#setup-and-usage)
  - [1. Open the Airtable Scripting Extension](#1-open-the-airtable-scripting-extension)
  - [2. Paste the Script](#2-paste-the-script)
  - [3. Run the Script](#3-run-the-script)
  - [4. Retrieve the Generated Schema](#4-retrieve-the-generated-schema)
  - [5. Configure Your Custom GPT Assistant](#5-configure-your-custom-gpt-assistant)
  - [6. Specify the API Key](#6-specify-the-api-key)
  - [7. Update the Assistant Instructions](#7-update-the-assistant-instructions)
  - [8. Test the Assistant](#8-test-the-assistant)
- [Script Explanation](#script-explanation)
- [Generated Schema Usage](#generated-schema-usage)
- [Handling Linked Records](#handling-linked-records)
- [Unmapped Field Types](#unmapped-field-types)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Purpose

The script automates the creation of an OpenAPI schema that reflects your Airtable base's tables, fields, and relationships. This schema can then be used to configure a Custom GPT assistant that can answer queries by interacting directly with your Airtable data.

## Features

- **Automatic Schema Generation**: Generates an OpenAPI 3.1.0 schema based on your Airtable base.
- **Field Type Mapping**: Maps Airtable field types to appropriate OpenAPI data types.
- **Linked Records Handling**: Expresses relationships between tables using custom `x-linkedTable` properties.
- **Preservation of Field Descriptions**: Includes existing field descriptions from your Airtable base.
- **Error Reporting**: Identifies and reports unmapped field types for manual attention.

## Prerequisites

- **Airtable Account**: Access to the base you wish to generate a schema for.
- **Airtable Scripting Extension**: Enabled for your base.
- **OpenAI Account**: With access to the Custom GPT feature and the ability to configure actions and upload schemas.
- **API Key**: Your Airtable API key.
  - You can find your Airtable API key by logging into Airtable and visiting your account page.
  - Keep your API key secure and do not share it publicly.

## Setup and Usage

### 1. Open the Airtable Scripting Extension

- Navigate to your Airtable base.
- Click on the "Extensions" button in the top-right corner.
- Add a new extension and select "Scripting".

### 2. Paste the Script

- Copy the entire script from the `script.js` file.
- Paste it into the scripting editor within the Airtable Scripting Extension.

### 3. Run the Script

- Click the "Run" button to execute the script.
- The script will generate the OpenAPI schema based on your base's structure.

### 4. Retrieve the Generated Schema

- After running, the script outputs markdown containing the OpenAPI schema JSON.
- Copy the JSON text displayed in the output section.

### 5. Configure Your Custom GPT Assistant

- Log into your OpenAI account and navigate to the Custom GPT settings.
- Create a new GPT or select an existing one to configure.
- In the "Actions" section, click on "Create new action" to create a new action.
- Paste the OpenAPI schema you copied into the **Schema** input field.
- **Set the Authentication Method**:
  - Select **"API Key"** as the authentication method.
- Proceed to the next step to set up the authentication details.

### 6. Specify the API Key

- In the **API Key** authentication settings:
  - **API Key Header Name**: Enter `Authorization`.
  - **API Key Value Prefix**: Enter `Bearer ` (including the space).
  - **API Key**: Enter your Airtable API key.
    - Ensure that your API key is stored securely.
    - The API key will be encrypted and stored securely by OpenAI.

### 7. Update the Assistant Instructions

- Copy the sample assistant instructions from the [sample_gpt_instructions.md](sample_gpt_instructions.md) file.
- Paste them into the **Instructions** field of your Custom GPT assistant.
- These instructions guide the assistant on how to interact with the API and handle data appropriately.

### 8. Test the Assistant

- Interact with your GPT assistant by asking queries related to your Airtable data.
- Verify that it can retrieve and present information accurately.
- Troubleshoot any issues using the guidance provided in this README.

## Script Explanation

The script performs the following actions:

- **Field Type Mapping**: Maps Airtable field types to OpenAPI data types via the `AIRTABLE_TO_OPENAPI_DEFS` object.
- **Schema Generation**: Iterates through each table in the base to generate corresponding schemas and endpoint definitions.
- **Linked Records Handling**:
  - Identifies fields of type `multipleRecordLinks`.
  - Uses a helper function `getTableById` to resolve linked table IDs to names.
  - Adds a custom `x-linkedTable` property to express relationships without nesting.
- **Preserving Descriptions**: Includes any existing field descriptions in the schema.
- **Output Generation**: Constructs the OpenAPI schema and outputs it as JSON.

## Generated Schema Usage

- The generated OpenAPI schema defines the structure of your Airtable base for API interactions.
- **Endpoints**: Each table has an endpoint for listing records.
- **Security**: The schema includes a `BearerAuth` security scheme for API key authentication.
- **Schemas**: Defines the data structures for each table, including fields and their types.
- **Linked Records**:
  - Represented as arrays of record IDs (strings).
  - Include an `x-linkedTable` property indicating the related table.

## Handling Linked Records

- **No Nested Data**: The Airtable API returns linked records as arrays of record IDs, not nested objects.
- **Expressing Relationships**: The `x-linkedTable` property in the schema indicates which table a linked record field references.
- **Assistant Behavior**:
  - When encountering a linked record field, use the `x-linkedTable` property to determine the related table.
  - Make additional API calls to the appropriate table's endpoint to retrieve related records using the record IDs.
  - Do not expose record IDs to the user; present human-readable names or relevant information.

## Unmapped Field Types

- If the script encounters field types that are not mapped in `AIRTABLE_TO_OPENAPI_DEFS`, it will:
  - Add them to the `unmappedFieldTypes` set.
  - Output a warning at the end of script execution.
- **Action Required**:
  - Review any unmapped field types listed.
  - Update the `AIRTABLE_TO_OPENAPI_DEFS` object to include appropriate mappings.
  - Rerun the script to regenerate the schema with the new mappings.

## Troubleshooting

### Error: `UnrecognizedKwargsError: fields`

- **Cause**: The parameter name `fields[]` may cause issues with serialization.
- **Solution**:
  - The script has been updated to use `fields` instead of `fields[]`.
  - Ensure you are using the latest version of the script.
  - Regenerate and update the schema in your Custom GPT configuration.

### Assistant Not Resolving Linked Records

- **Cause**: The assistant may not be programmed to utilize the `x-linkedTable` property.
- **Solution**:
  - Update the assistant's instructions to handle linked records using the `x-linkedTable` metadata (see `instructions.txt`).
  - Ensure it makes additional API calls to fetch related records as needed.

### Unmapped Field Types Warning

- **Cause**: New or custom field types not defined in the script.
- **Solution**:
  - Add mappings for these field types in the `AIRTABLE_TO_OPENAPI_DEFS` object.
  - If unsure, map them to `'type': 'string'` as a default.
  - Rerun the script after making changes.

## Contributing

- If you make improvements to the script or encounter issues, consider sharing your updates.
- Contributions can help others who are using similar setups.
- Feel free to fork the script or submit pull requests with enhancements.

## License

This script is provided as-is without any warranty. Use it at your own risk. Make sure to comply with Airtable's API usage policies and OpenAI's terms of service when using the script and integrating it with GPT assistants.

---

**Note**: Always ensure that you handle sensitive data securely and comply with any relevant data protection regulations when exposing your Airtable data to external systems.

---

**Disclaimer**: The instructions provided in this README are meant for informational purposes and to aid in setting up the script and GPT assistant. OpenAI's policies and Airtable's terms may change over time; always refer to the official documentation for the most current information.
