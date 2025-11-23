# Storage Provider Configuration System

This system allows you to easily add new storage providers by defining their configuration in a declarative way.

## How to Add a New Provider

### 1. Create Provider Configuration

Create a new file in `providers/` directory (e.g., `providers/myProvider.ts`):

```typescript
import { z } from "zod";
import { ProviderConfig } from "../types/provider";

export const myProvider: ProviderConfig = {
  name: "myprovider",
  title: "My Storage Provider",
  description: "Configure your My Storage Provider connection",
  fields: [
    {
      name: "api_key",
      type: "password",
      label: "API Key",
      required: true,
      placeholder: "Enter your API key",
      schema: z.string().min(1, "API Key is required"),
    },
    {
      name: "endpoint",
      type: "text",
      label: "API Endpoint",
      required: true,
      placeholder: "https://api.mystorage.com",
      schema: z.string().url("Must be a valid URL"),
    },
    {
      name: "use_ssl",
      type: "toggle",
      label: "Use SSL",
      description: "Enable SSL for secure connections",
      schema: z.boolean().default(true), // Default value defined in schema
    },
    {
      name: "timeout",
      type: "counter",
      label: "Connection Timeout (seconds)",
      min: 1,
      max: 300,
      step: 5,
      schema: z.number().min(1).max(300).default(30), // Default value defined in schema
    },
  ],
  layout: [
    {
      fields: ["api_key"],
    },
    {
      fields: ["endpoint"],
    },
    {
      fields: ["use_ssl", "timeout"],
    },
  ],
};
```

### 2. Register the Provider

Add your provider to the registry in `providers/index.ts`:

```typescript
import { myProvider } from "./myProvider";

export const providerRegistry: Record<string, ProviderConfig> = {
  s3: s3Provider,
  gcp: gcpProvider,
  azure: azureProvider,
  redis: redisProvider,
  localfiles: localFilesProvider,
  myprovider: myProvider, // Add your provider here
};
```

## Field Types

### Available Field Types

- `text`: Regular text input
- `password`: Password input (hidden)
- `number`: Numeric input
- `select`: Dropdown selection
- `toggle`: Boolean toggle switch
- `counter`: Numeric counter with min/max
- `textarea`: Multi-line text input
- `hidden`: Hidden input field (no visual styling or layout)

### Field Properties

```typescript
{
  name: string;           // Field name (used in form data)
  type: FieldType;        // Field type (see above)
  label: string;          // Display label
  description?: string;   // Help text
  placeholder?: string;   // Placeholder text
  required?: boolean;     // Whether field is required
  schema: z.ZodTypeAny;  // Zod validation schema with defaults
  options?: Array<{ value: string; label: string }>; // For select fields
  min?: number;          // For number/counter fields
  max?: number;          // For number/counter fields
  step?: number;         // For number/counter fields
  autoComplete?: string; // For input fields
  gridCols?: number;     // How many columns this field should span (1-12)
  readOnly?: boolean;    // Whether field is read-only (not editable by user)
  dependsOn?: {          // Field dependency configuration
    field: string;       // Name of the field this depends on
    value: any | ((dependencyValue: any, formData: Record<string, any>) => boolean); // The value or function to check if field should be enabled
  };
}
```

## Default Values

Default values can be defined in two ways:

### 1. Schema Defaults (Recommended)

Default values are defined directly in the Zod schema using `.default()`:

```typescript
{
  name: "use_ssl",
  type: "toggle",
  label: "Use SSL",
  schema: z.boolean().default(true), // Default: true
},
{
  name: "timeout",
  type: "counter",
  label: "Connection Timeout",
  schema: z.number().min(1).max(300).default(30), // Default: 30
},
{
  name: "region",
  type: "select",
  label: "Region",
  schema: z.string().default("us-east-1"), // Default: "us-east-1"
},
```

The system automatically extracts these default values from the schemas using the `extractDefaultValues()` function.

### 2. Custom Default Values

You can also provide custom default values when using the `StorageProviderForm` component:

```typescript
const customDefaults = {
  s3: {
    region: "us-west-2",
    bucket: "my-default-bucket",
  },
  gcp: {
    project_id: "my-default-project",
    bucket: "my-default-bucket",
  },
};

<StorageProviderForm
  // ... other props
  defaultValues={customDefaults}
/>
```

Custom defaults take precedence over schema defaults. The structure is:
```typescript
{
  [providerName: string]: {
    [fieldName: string]: any
  }
}
```

## Read-Only Fields

You can mark fields as read-only by setting the `readOnly` property to `true`. Read-only fields will be displayed but cannot be edited by users:

```typescript
{
  name: "api_endpoint",
  type: "text",
  label: "API Endpoint",
  description: "The endpoint URL for the API",
  schema: z.string().url("Must be a valid URL"),
  readOnly: true, // This field cannot be edited
},
{
  name: "region",
  type: "select",
  label: "Region",
  schema: z.string().default("us-east-1"),
  options: [
    { value: "us-east-1", label: "US East (N. Virginia)" },
    { value: "us-west-2", label: "US West (Oregon)" },
  ],
  readOnly: true, // This field cannot be edited
},
```

Read-only fields are useful for:
- Pre-configured values that shouldn't be changed
- System-generated values
- Fields that are set by environment variables
- Default configurations that should remain fixed

## Hidden Fields

Hidden fields are rendered as `<input type="hidden">` elements with no visual styling or layout. They're useful for storing values that shouldn't be visible to users but need to be included in form submissions:

```typescript
{
  name: "api_version",
  type: "hidden",
  schema: z.string().default("v1"),
},
{
  name: "client_id",
  type: "hidden",
  schema: z.string().default("my-client"),
},
```

Hidden fields:
- Are not included in the layout grid
- Have no visual styling (no padding, margins, borders)
- Are still included in form validation and submission
- Can have dependencies and default values
- Are useful for storing configuration values, API versions, client IDs, etc.

## Field Dependencies

You can create field dependencies using the `dependsOn` property. This allows you to disable fields based on the state of other fields. The `value` property can be either a static value or a dynamic function.

### Static Value Dependencies

```typescript
{
  name: "presigned_urls",
  type: "toggle",
  label: "Use Presigned URLs",
  description: "Generate presigned URLs for file access",
  schema: z.boolean().default(false),
},
{
  name: "ttl",
  type: "counter",
  label: "TTL (seconds)",
  description: "Time to live for presigned URLs",
  schema: z.number().min(1).max(3600).default(3600),
  dependsOn: {
    field: "presigned_urls",
    value: true, // TTL field is only enabled when presigned_urls is true
  },
},
```

### Dynamic Function Dependencies

For more complex logic, you can use a function that receives the dependency value and the entire form data:

```typescript
{
  name: "encryption_type",
  type: "select",
  label: "Encryption Type",
  schema: z.string().default("none"),
  options: [
    { value: "none", label: "No Encryption" },
    { value: "aes", label: "AES-256" },
    { value: "custom", label: "Custom Encryption" },
  ],
},
{
  name: "encryption_key",
  type: "password",
  label: "Encryption Key",
  description: "Key for encryption",
  schema: z.string().min(1, "Encryption key is required"),
  dependsOn: {
    field: "encryption_type",
    value: (encryptionType, formData) => {
      // Enable only when encryption type is not "none"
      return encryptionType !== "none";
    },
  },
},
{
  name: "custom_algorithm",
  type: "text",
  label: "Custom Algorithm",
  description: "Custom encryption algorithm",
  schema: z.string().min(1, "Algorithm is required"),
  dependsOn: {
    field: "encryption_type",
    value: (encryptionType, formData) => {
      // Enable only when encryption type is "custom"
      return encryptionType === "custom";
    },
  },
},
```

### Toggle Field Dependencies

For toggle fields, you can check the `checked` state:

```typescript
{
  name: "use_ssl",
  type: "toggle",
  label: "Use SSL",
  description: "Enable SSL for secure connections",
  schema: z.boolean().default(true),
},
{
  name: "ssl_certificate",
  type: "textarea",
  label: "SSL Certificate",
  description: "Paste your SSL certificate",
  schema: z.string().min(1, "SSL certificate is required"),
  dependsOn: {
    field: "use_ssl",
    value: (useSsl, formData) => {
      // Enable only when SSL is enabled
      return useSsl === true;
    },
  },
},
```

In these examples:
- Static values work for simple equality checks
- Dynamic functions allow complex conditional logic
- Functions receive the dependency field value and the entire form data
- Toggle fields can be checked for their boolean state

Field dependencies are useful for:
- Conditional field visibility
- Multi-step form logic
- Feature toggles
- Optional configuration sections

## Layout Configuration

The `layout` array defines how fields are arranged in rows:

```typescript
layout: [
  {
    fields: ["field1"],           // Single field on one row
  },
  {
    fields: ["field2", "field3"], // Two fields on the same row
  },
  {
    fields: ["field4"],           // Another single field
  },
]
```

## Validation

Each field includes a Zod schema for validation:

```typescript
{
  name: "api_key",
  type: "password",
  label: "API Key",
  required: true,
  schema: z.string().min(1, "API Key is required"),
}
```

The system automatically assembles all field schemas into a complete validation schema for the entire form.

## Helper Functions

The system provides several helper functions:

- `getProviderConfig(providerName)`: Get provider configuration
- `getProviderSchema(providerName)`: Get validation schema for provider
- `getProviderDefaultValues(providerName)`: Get default values for provider
- `extractDefaultValues(fields)`: Extract defaults from field schemas

## Example: Complete Provider

See `providers/example.ts` for a complete example of a new provider configuration.

## Example: Using Custom Default Values

Here's a complete example of how to use the `StorageProviderForm` with custom default values:

```typescript
import { StorageProviderForm } from '@humansignal/app-common';

// Define custom default values for different providers
const customDefaults = {
  s3: {
    region: "us-west-2",
    bucket: "my-default-bucket",
    prefix: "data/",
  },
  gcp: {
    project_id: "my-default-project",
    bucket: "my-default-bucket",
    prefix: "annotations/",
  },
  azure: {
    container: "my-default-container",
    account_name: "myaccount",
    prefix: "exports/",
  },
};

// Use the form with custom defaults
function MyStorageForm() {
  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <StorageProviderForm
      onSubmit={handleSubmit}
      target="import"
      project={123}
      storageTypes={[
        { title: "Amazon S3", name: "s3" },
        { title: "Google Cloud Storage", name: "gcp" },
        { title: "Azure Blob Storage", name: "azure" },
      ]}
      providers={providerRegistry}
      defaultValues={customDefaults}
      title="Configure Storage Provider"
    />
  );
}
```

In this example:
- When a user selects "S3", the form will be pre-filled with `region: "us-west-2"`, `bucket: "my-default-bucket"`, and `prefix: "data/"`
- When a user selects "GCP", the form will be pre-filled with `project_id: "my-default-project"`, `bucket: "my-default-bucket"`, and `prefix: "annotations/"`
- Custom defaults take precedence over any defaults defined in the provider schemas

## Example: Using Read-Only Fields

Here's an example of how to use read-only fields in a provider configuration:

```typescript
export const myProvider: ProviderConfig = {
  name: "myprovider",
  title: "My Storage Provider",
  description: "Configure your My Storage Provider connection",
  fields: [
    {
      name: "api_endpoint",
      type: "text",
      label: "API Endpoint",
      description: "The endpoint URL for the API",
      schema: z.string().url("Must be a valid URL"),
      readOnly: true, // This field cannot be edited
    },
    {
      name: "api_key",
      type: "password",
      label: "API Key",
      required: true,
      placeholder: "Enter your API key",
      schema: z.string().min(1, "API Key is required"),
    },
    {
      name: "region",
      type: "select",
      label: "Region",
      schema: z.string().default("us-east-1"),
      options: [
        { value: "us-east-1", label: "US East (N. Virginia)" },
        { value: "us-west-2", label: "US West (Oregon)" },
      ],
      readOnly: true, // This field cannot be edited
    },
    {
      name: "use_ssl",
      type: "toggle",
      label: "Use SSL",
      description: "Enable SSL for secure connections",
      schema: z.boolean().default(true),
    },
  ],
  layout: [
    {
      fields: ["api_endpoint"],
    },
    {
      fields: ["api_key"],
    },
    {
      fields: ["region", "use_ssl"],
    },
  ],
};
```

In this example:
- The `api_endpoint` field is read-only and will be pre-filled but cannot be changed by users
- The `region` field is also read-only and will show the default value but cannot be modified
- The `api_key` and `use_ssl` fields are editable as normal

## Example: Combining Read-Only Fields and Dependencies

Here's an example that combines both read-only fields and field dependencies:

```typescript
export const advancedProvider: ProviderConfig = {
  name: "advancedprovider",
  title: "Advanced Storage Provider",
  description: "Configure your advanced storage provider with conditional features",
  fields: [
    {
      name: "api_endpoint",
      type: "text",
      label: "API Endpoint",
      description: "The endpoint URL for the API",
      schema: z.string().url("Must be a valid URL"),
      readOnly: true, // This field cannot be edited
    },
    {
      name: "api_key",
      type: "password",
      label: "API Key",
      required: true,
      placeholder: "Enter your API key",
      schema: z.string().min(1, "API Key is required"),
    },
    {
      name: "use_presigned_urls",
      type: "toggle",
      label: "Use Presigned URLs",
      description: "Generate presigned URLs for secure file access",
      schema: z.boolean().default(false),
    },
    {
      name: "ttl_seconds",
      type: "counter",
      label: "TTL (seconds)",
      description: "Time to live for presigned URLs",
      schema: z.number().min(1).max(3600).default(3600),
      dependsOn: {
        field: "use_presigned_urls",
        value: (usePresignedUrls, formData) => {
          // Only enabled when presigned URLs are enabled
          return usePresignedUrls === true;
        },
      },
    },
    {
      name: "encryption_enabled",
      type: "toggle",
      label: "Enable Encryption",
      description: "Enable client-side encryption",
      schema: z.boolean().default(false),
    },
    {
      name: "encryption_key",
      type: "password",
      label: "Encryption Key",
      description: "Key for client-side encryption",
      schema: z.string().min(1, "Encryption key is required"),
      dependsOn: {
        field: "encryption_enabled",
        value: (encryptionEnabled, formData) => {
          // Only enabled when encryption is enabled
          return encryptionEnabled === true;
        },
      },
    },
  ],
  layout: [
    {
      fields: ["api_endpoint"],
    },
    {
      fields: ["api_key"],
    },
    {
      fields: ["use_presigned_urls", "ttl_seconds"],
    },
    {
      fields: ["encryption_enabled", "encryption_key"],
    },
  ],
};
```

In this example:
- `api_endpoint` is read-only and cannot be changed
- `ttl_seconds` is only enabled when `use_presigned_urls` is `true`
- `encryption_key` is only enabled when `encryption_enabled` is `true`
- The form dynamically shows/hides fields based on user selections

## Benefits

1. **Declarative**: Define providers in a simple configuration object
2. **Type-safe**: Full TypeScript support with Zod validation
3. **Flexible**: Easy to add new field types and layouts
4. **Maintainable**: All provider logic in one place
5. **Consistent**: All providers follow the same structure
6. **Extensible**: Easy to add new features to all providers at once
7. **Single Source of Truth**: Default values are defined in the schema, not separately

## Migration from Old System

The old system used hardcoded React components for each provider. The new system:

1. Uses a generic `ProviderForm` component
2. Renders fields based on configuration
3. Handles validation automatically
4. Makes adding new providers much easier
5. Uses Zod schemas for both validation and defaults

To migrate an existing provider:

1. Extract field definitions from the old component
2. Create a new provider configuration file
3. Define the layout and validation schemas with defaults
4. Register the provider in the registry
5. Remove the old component file 