// Airtable OpenAPI 3.1.0 Schema Generator for GPT Actions (Read-Only)
// This script generates an OpenAPI 3.1.0 schema for read-only operations on an Airtable base,
// compatible with Custom GPT Actions.

// Include standard Airtable field type mappings
const AIRTABLE_TO_OPENAPI_DEFS = {
    'singleLineText': { 'type': 'string' },
    'email': { 'type': 'string', 'format': 'email' },
    'url': { 'type': 'string', 'format': 'uri' },
    'multilineText': { 'type': 'string' },
    'number': { 'type': 'number' },
    'percent': { 'type': 'number', 'format': 'percent' }, // Added format
    'currency': { 'type': 'number', 'format': 'currency' }, // Added format
    'singleSelect': { 'type': 'string' },
    'multipleSelects': { 'type': 'array', 'items': { 'type': 'string' } },
    'singleCollaborator': {
        'type': 'object',
        'properties': {
            'id': { 'type': 'string' },
            'email': { 'type': 'string', 'format': 'email' },
            'name': { 'type': 'string' }
        },
        'required': ['id', 'email']
    },
    'multipleCollaborators': {
        'type': 'array',
        'items': {
            'type': 'object',
            'properties': {
                'id': { 'type': 'string' },
                'email': { 'type': 'string', 'format': 'email' },
                'name': { 'type': 'string' }
            },
            'required': ['id', 'email']
        }
    },
    'multipleRecordLinks': {
        'type': 'array',
        'items': { 'type': 'string' }
    },
    'date': { 'type': 'string', 'format': 'date' },
    'dateTime': { 'type': 'string', 'format': 'date-time' },
    'phoneNumber': { 'type': 'string' },
    'multipleAttachments': {
        'type': 'array',
        'items': {
            'type': 'object',
            'properties': {
                'id': { 'type': 'string' },
                'url': { 'type': 'string', 'format': 'uri' },
                'filename': { 'type': 'string' },
                'size': { 'type': 'integer' },
                'type': { 'type': 'string' }
            }
        }
    },
    'checkbox': { 'type': 'boolean' },
    'formula': { 'type': 'string' },
    'createdTime': { 'type': 'string', 'format': 'date-time' },
    'rollup': { 'type': 'string' },
    'count': { 'type': 'integer' },
    'multipleLookupValues': { 'type': 'array', 'items': { 'type': 'string' } },
    'autoNumber': { 'type': 'integer' },
    'barcode': {
        'type': 'object',
        'properties': {
            'text': { 'type': 'string' },
            'type': { 'type': 'string' }
        }
    },
    'rating': { 'type': 'integer' },
    'richText': { 'type': 'string' },
    'duration': { 'type': 'integer' },
    'lastModifiedTime': { 'type': 'string', 'format': 'date-time' },
    'button': {
        'type': 'object',
        'properties': {
            'label': { 'type': 'string' },
            'url': { 'type': 'string', 'format': 'uri' }
        }
    },
    'lastModifiedBy': {
        'type': 'object',
        'properties': {
            'id': { 'type': 'string' },
            'email': { 'type': 'string', 'format': 'email' },
            'name': { 'type': 'string' }
        },
        'required': ['id', 'email']
    },
    'createdBy': {
        'type': 'object',
        'properties': {
            'id': { 'type': 'string' },
            'email': { 'type': 'string', 'format': 'email' },
            'name': { 'type': 'string' }
        },
        'required': ['id', 'email']
    }
};

function getTableTemplate(table) {
    return {
        get: {
            operationId: `list${table.name.replace(/[^a-zA-Z0-9]/g, '')}`,
            tags: [table.name],
            summary: `List records in ${table.name}`,
            parameters: [
                {
                    "in": "query",
                    "name": "fields[]",
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "style": "form",
                    "explode": true,
                    "description": "Array of field names to be returned in the records. If not specified, all fields are returned."
                },
                {
                    "in": "query",
                    "name": "filterByFormula",
                    "schema": {
                        "type": "string"
                    },
                    "description": "A formula used to filter records."
                },
                {
                    "in": "query",
                    "name": "maxRecords",
                    "schema": {
                        "type": "integer"
                    },
                    "description": "The maximum total number of records that will be returned in your requests."
                },
                {
                    "in": "query",
                    "name": "pageSize",
                    "schema": {
                        "type": "integer"
                    },
                    "description": "The number of records returned in each request. Must be less than or equal to 100."
                },
                {
                    "in": "query",
                    "name": "sort[0][field]",
                    "schema": {
                        "type": "string"
                    },
                    "description": "The field name to sort on."
                },
                {
                    "in": "query",
                    "name": "sort[0][direction]",
                    "schema": {
                        "type": "string",
                        "enum": ["asc", "desc"]
                    },
                    "description": "The sort direction: 'asc' or 'desc'."
                },
                {
                    "in": "query",
                    "name": "view",
                    "schema": {
                        "type": "string"
                    },
                    "description": "The name or ID of a view in the table."
                },
                {
                    "in": "query",
                    "name": "offset",
                    "schema": {
                        "type": "string"
                    },
                    "description": "The pagination offset."
                }
            ],
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/List${table.name.replace(/[^a-zA-Z0-9]/g, '')}Response`
                            }
                        }
                    }
                }
            }
        }
    };
}

let unmappedFieldTypes = new Set();

function getFieldType(f) {
    if (typeof f.type === 'undefined') {
        console.warn(`Field type is undefined for field: ${f.name}`);
        return { type: 'string', description: `Unknown field type for ${f.name}` };
    }

    var field_schema = AIRTABLE_TO_OPENAPI_DEFS[f.type];

    if (!field_schema) {
        console.warn(`No OpenAPI definition found for Airtable field type: ${f.type}`);
        unmappedFieldTypes.add(f.type);
        return { type: 'string', description: `Unmapped Airtable type: ${f.type}` };
    }

    field_schema = JSON.parse(JSON.stringify(field_schema)); // Deep clone

    // If descriptions are available in the Scripting Extension, you can include them:
    // field_schema.description = f.description;

    if (f.type === 'singleSelect' || f.type === 'multipleSelects') {
        if (f.options && f.options.choices) {
            field_schema.enum = f.options.choices.map((o) => o.name);
        }
    }

    return field_schema;
}

function generateSchema(table) {
    var schema = {};
    for (let f of table.fields) {
        schema[f.name] = getFieldType(f);
    }

    return {
        type: 'object',
        properties: schema
    };
}

function generateResponseBody(schema_name) {
    return {
        type: 'object',
        properties: {
            records: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        createdTime: {
                            type: 'string',
                            format: 'date-time'
                        },
                        fields: {
                            $ref: `#/components/schemas/${schema_name}`
                        }
                    }
                }
            },
            offset: {
                type: 'string'
            }
        }
    };
}

function getSchemaName(table) {
    return table.name.replace(/[^a-zA-Z0-9]/g, '');
}

function baseToOpenAPI(base) {
    const base_path = `/${base.id}`;
    var base_structure = {
        openapi: '3.1.0',
        info: {
            title: `${base.name} API (Read-Only)`,
            description: `Airtable API definition for read-only operations into ${base.name}`,
            version: 'v0'
        },
        servers: [{
            url: 'https://api.airtable.com/v0',
            description: 'API URL'
        }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer'
                }
            },
            schemas: {}
        },
        security: [{
            BearerAuth: []
        }],
        paths: {}
    };

    for (var table of base.tables) {
        var table_structure = getTableTemplate(table);
        var content_def = generateSchema(table);

        var schema_name = getSchemaName(table);

        base_structure.components.schemas[schema_name] = content_def;

        var response_schema = generateResponseBody(schema_name);
        base_structure.components.schemas[`List${schema_name}Response`] = response_schema;

        const table_path = `${base_path}/${encodeURIComponent(table.name)}`;
        base_structure.paths[table_path] = table_structure;
    }
    return base_structure;
}

// Main execution
let base_schema = baseToOpenAPI(base);
let schema_json = JSON.stringify(base_schema, null, 2);

// Output the schema
output.markdown(`# OpenAPI Schema (Read-Only)`);
output.markdown(`Copy the following JSON and paste it into the **Schema** input field of your custom GPT:`);
output.text(schema_json);

// Log any fields that weren't mapped
if (unmappedFieldTypes.size > 0) {
    output.markdown(`\n## Warning: Unmapped Field Types`);
    output.markdown(`The following Airtable field types were not mapped to OpenAPI types:`);
    for (let fieldType of unmappedFieldTypes) {
        output.markdown(`- ${fieldType}`);
    }
    output.markdown(`These fields have been set to type 'string' in the schema. You may want to update their definitions manually.`);
}
