
### OpenAI

You can only have one OpenAI key per organization. This grants you access to set of whitelisted models. For a list of these models, see [Supported base models](#Supported-base-models). 

If you don't already have one, you can [create an OpenAI account here](https://platform.openai.com/signup).

You can find your OpenAI API key on the [API key page](https://platform.openai.com/api-keys). 

### Gemini

You can only have one Gemini key per organization. This grants you access to set of whitelisted models. For a list of these models, see [Supported base models](#Supported-base-models). 

For information on getting a Gemini API key, see [Get a Gemini API key](https://ai.google.dev/gemini-api/docs/api-key).

### Vertex AI

You can only have one Vertex AI key per organization. This grants you access to set of whitelisted models. For a list of these models, see [Supported base models](#Supported-base-models). 

Follow the instructions here to generate a credentials file in JSON format: [Authenticate to Vertex AI Agent Builder - Client libraries or third-party tools](https://cloud.google.com/generative-ai-app-builder/docs/authentication#client-libs)

The JSON credentials are required. You can also optionally provide the project ID and location associated with your Google Cloud Platform environment. 

### Anthropic

You can only have one Anthropic key per organization. This grants you access to set of whitelisted models. For a list of these models, see [Supported base models](#Supported-base-models). 

For information on getting an Anthropic API key, see [Anthropic - Accessing the API](https://docs.anthropic.com/en/api/getting-started#accessing-the-api).

### Azure OpenAI

Each Azure OpenAI key is tied to a specific deployment, and each deployment comprises a single OpenAI model. So if you want to use multiple models through Azure, you will need to create a deployment for each model and then add each key to Label Studio. 

For a list of the Azure OpenAI models we support, see [Supported base models](#Supported-base-models). 

To use Azure OpenAI, you must first create the Azure OpenAI resource and then a model deployment:

1. From the Azure portal, [create an Azure OpenAI resource](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource). 


2. From Azure OpenAI Studio, [create a deployment](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource?pivots=web-portal#deploy-a-model). This is a base model endpoint. 

When adding the key to Label Studio, you are asked for the following information:

| Field | Description|
| --- | --- |
| **Deployment** | The is the name of the deployment. By default, this is the same as the model name, but you can customize it when you create the deployment. If they are different, you must use the deployment name and not the underlying model name. |
| **Endpoint** | This is the target URI provided by Azure.  |
| **API key** | This is the key provided by Azure. |

You can find all this information in the **Details** section of the deployment in Azure OpenAI Studio. 

![Screenshot of the Azure deployment details](/images/prompts/azure_deployment.png)

### Azure AI Foundry

Use the Azure AI Foundry model catalog to deploy a model: [AI Foundry docs](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/model-catalog-overview).

Once deployed, navigate to the Details page of the deployed model. The information you will need to set up the connection to Label Studio is under **Endpoint**:

![Screenshot of the AI Foundry endpoint details](/images/prompts/ai-foundry.png)

When adding the key to Label Studio, you are asked for the following information:

| Field | Description|
| --- | --- |
| **Model** | The is model name. This is provided as a parameter with your endpoint information (see the screenshot above). |
| **Endpoint** | This is the **Target URI** provided by AI Foundry.  |
| **API key** | This is the **Key** provided by AI Foundry. |


### Custom LLM

You can use your own self-hosted and fine-tuned model as long as it meets the following criteria:

* Your server must provide [JSON mode](https://js.useinstructor.com/concepts/patching/#json-schema-mode) for the LLM, specifically, the API must accepts `response_format` with `type: json_object` and `schema` with a valid JSON schema: ` {"response_format": {"type": "json_object", "schema": <schema>}}`
* The server API must follow [OpenAI format](https://platform.openai.com/docs/api-reference/chat/create#chat-create-response_format). 

Examples of compatible LLMs include [Ollama](https://ollama.com/) and [sglang](https://github.com/sgl-project/sglang?tab=readme-ov-file#openai-compatible-api). 

To add a custom model, enter the following:

* A name for the model. 
* The endpoint URL for the model. For example, `https://my.openai.endpoint.com/v1`
* An API key to access the model. An API key is tied to a specific account, but the access is shared within the org if added. (Optional)
* An auth token to access the model API. An auth token provides API access at the server level. (Optional)

#### Example with Ollama

1. Setup [Ollama](https://ollama.com/), e.g. `ollama run llama3.2`
2. [Verify your local OpenAI-compatible API is working](https://ollama.com/blog/openai-compatibility), e.g. `http://localhost:11434/v1`
3. Create an externally facing endpoint, e.g. `https://my.openai.endpoint.com/v1` -> `http://localhost:11434/v1`
4. Add connection to Label Studio:
    - Name: `llama3.2` (must match the model name in Ollama)
    - Endpoint: `https://my.openai.endpoint.com/v1` (note `v1` suffix is required)
    - API key: `ollama` (default)
    - Auth token: empty


#### Example with Hugging Face Inference Endpoints
1. Use [DeepSeek model](https://huggingface.co/deepseek-ai/DeepSeek-R1)
2. In `API Keys`, add to `Custom` provider:
    - Name: `deepseek-ai/DeepSeek-R1`
    - Endpoint: `https://router.huggingface.co/together/v1`
    - API key: `<your-hf-api-key>`
    - Auth token: empty