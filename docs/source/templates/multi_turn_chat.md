---
title: Multi-Turn Chat Evaluation
type: templates
category: LLM Evaluations
cat: llm-evaluations
order: 972
meta_title: Multi-Turn Chat Evaluation Template
meta_description: Use the SDK to create a dynamic template for evaluating multi-turn chats. 
date: 2025-01-21 10:49:57
---


<img src="/images/templates/multi-turn-chat.png" alt="" class="gif-border" width="552px" />

This template uses the example available here: [Multi-turn Chat Labeling: Evaluating Virtual Assistant Conversations](https://github.com/HumanSignal/label-studio-examples/blob/main/multi-turn-chat/Readme.md)

You can use this example to evaluate multi-turn chat conversations in Label Studio, identifying areas to enhance your virtual assistant’s performance and user experience.

For this example, you will need the following:

- Label Studio instance
- Label Studio SDK (`pip install label-studio-sdk`)
- Python 3.8+ with pandas

## Labeling configuration

In this example, the labeling configuration is dynamically generated. This is necessary because each chat has a different number of turns (questions and responses). 

To build your own template XML, you will need to follow the steps outlined in the following notebook: [**Evaluating Virtual Assistant Conversations.ipynb**](https://github.com/HumanSignal/label-studio-examples/blob/main/multi-turn-chat/Evaluating%20Virtual%20Assistant%20Conversations.ipynb)

However, here is an example of the labeling configuration for a 5-turn chat:

```xml
<View>
    <Style>
        
.root {
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh; /* Full height of the viewport */
    margin: 0;
    padding: 0;
}

.container {
    display: flex;
    flex: 1;
    gap: 20px;
    height: 100%; /* Ensure it stretches to fill the root height */
    overflow: hidden; /* Prevent scrolling at the container level */
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent column itself from scrolling */
}

.dialogue {
    max-width: 750px;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    overflow-y: auto; /* Enable vertical scrolling */
    flex: 1; /* Stretch to fill the available height */
}

.questions {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    background-color: #f8f9fa;
    overflow-y: auto; /* Enable vertical scrolling */
    flex: 1; /* Stretch to fill the available height */
}

.panel {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #e9ecef;
    border-radius: 5px;
    background-color: #f8f9fa;
}

.panel-header {
    font-weight: bold;
    margin-bottom: 10px;
}

.section-header {
    margin-bottom: 10px;
}

    .turn-1 {
        border: 2px solid #6A5ACD;
        background-color: #EDEDFD;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-2 {
        border: 2px solid #2E8B57;
        background-color: #EAF5F1;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-3 {
        border: 2px solid #FF4500;
        background-color: #FFF4EC;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-4 {
        border: 2px solid #DC143C;
        background-color: #FDECEC;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .turn-5 {
        border: 2px solid #4B0082;
        background-color: #F3EAFD;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    </Style>
    <View className="root">
        <Header value="Dialogue and Questions" />
        <View className="container">
            <View className="column">
                <View className="dialogue">
                    <Header value="Full Conversation" />
                    <Paragraphs name="prg" value="$messages" layout="dialogue" nameKey="role" textKey="content" />
                </View>
            </View>
            <View className="column">
                <View className="questions">
                    <Header value="Answer the questions for each turn" className="section-header" />
                    <Collapse>
                        
    <Panel value="Turn 1" className="panel-header">
        <View className="panel-turn turn-1">
            <Paragraphs name="turn1_prg" value="$turn1_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn1_user_intent" toName="turn1_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn1_response_address_intent" toName="turn1_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn1_response_accuracy_helpfulness" toName="turn1_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn1_response_action" toName="turn1_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 2" className="panel-header">
        <View className="panel-turn turn-2">
            <Paragraphs name="turn2_prg" value="$turn2_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn2_user_intent" toName="turn2_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn2_response_address_intent" toName="turn2_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn2_response_accuracy_helpfulness" toName="turn2_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn2_response_action" toName="turn2_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 3" className="panel-header">
        <View className="panel-turn turn-3">
            <Paragraphs name="turn3_prg" value="$turn3_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn3_user_intent" toName="turn3_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn3_response_address_intent" toName="turn3_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn3_response_accuracy_helpfulness" toName="turn3_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn3_response_action" toName="turn3_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 4" className="panel-header">
        <View className="panel-turn turn-4">
            <Paragraphs name="turn4_prg" value="$turn4_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn4_user_intent" toName="turn4_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn4_response_address_intent" toName="turn4_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn4_response_accuracy_helpfulness" toName="turn4_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn4_response_action" toName="turn4_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
    <Panel value="Turn 5" className="panel-header">
        <View className="panel-turn turn-5">
            <Paragraphs name="turn5_prg" value="$turn5_dialogue" layout="dialogue" nameKey="role" textKey="content" />
            
            <Header value="What is the user's intent in this turn?" />
            <Choices name="turn5_user_intent" toName="turn5_prg" choice="multiple">
                <Choice value="Product Inquiry" />
                <Choice value="Order Status" />
                <Choice value="Return/Exchange Inquiry" />
                <Choice value="Payment/Refund Inquiry" />
                <Choice value="Complaint" />
                <Choice value="Store/Location Information" />
                <Choice value="Other" />
            </Choices>

            <Header value="Did the assistant’s response address the user's intent?" />
            <Choices name="turn5_response_address_intent" toName="turn5_prg" choice="single">
                <Choice value="Fully Addressed" />
                <Choice value="Partially Addressed" />
                <Choice value="Not Addressed" />
            </Choices>

            <Header value="Is the assistant’s response accurate and helpful?" />
            <Choices name="turn5_response_accuracy_helpfulness" toName="turn5_prg" choice="single">
                <Choice value="Yes, Accurate and Helpful" />
                <Choice value="Yes, Accurate but Unhelpful" />
                <Choice value="No, Inaccurate" />
                <Choice value="No Response" />
            </Choices>

            <Header value="What action is implied by the assistant’s response (if any)?" />
            <Choices name="turn5_response_action" toName="turn5_prg" choice="multiple">
                <Choice value="Provide More Information to the User" />
                <Choice value="Request More Information from the User" />
                <Choice value="Escalate to Human Support" />
                <Choice value="Redirect to a Different Team/Resource" />
                <Choice value="Confirm Action Taken" />
                <Choice value="No Action/Response" />
            </Choices>
        </View>
    </Panel>
    
                    </Collapse>
                </View>
            </View>
        </View>
    </View>
</View>

<!-- {
    "data": {
        "messages": [
        {
          "role": "user",
          "content": "Hello, I need help with my account."
        },
        {
          "role": "assistant",
          "content": "Sure, I'd be happy to assist you. What seems to be the issue?"
        },
        {
          "role": "user",
          "content": "I can't access my account settings."
        },
        {
          "role": "assistant",
          "content": "Let's reset your password to regain access."
        }
      ],
      "turn1_dialogue": [
        {
          "role": "user",
          "content": "Hello, I need help with my account."
        },
        {
          "role": "assistant",
          "content": "Sure, I'd be happy to assist you. What seems to be the issue?"
        }
      ],
      "turn2_dialogue": [
        {
          "role": "user",
          "content": "I can't access my account settings."
        },
        {
          "role": "assistant",
          "content": "Let's reset your password to regain access."
        }
      ],
      "turn3_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ],
      "turn4_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ],
      "turn5_dialogue": [
        {
          "role": "",
          "content": ""
        },
        {
          "role": "",
          "content": ""
        }
      ]
    }
  } -->
```
## About the labeling configuration

#### Paragraphs

```xml
<Paragraphs name="prg" value="$messages" layout="dialogue" nameKey="role" textKey="content" />
```
This displays the entire conversation in one column under “Full Conversation” using a Paragraphs tag. It shows each message (with role and content) as a dialogue.

On the other column, it organizes annotation questions by turn. Each “Turn” is inside a collapsible `<Panel>` component and has its own `<Paragraphs>` tag. For example: 

```xml
<Paragraphs name="turn1_prg" value="$turn1_dialogue" layout="dialogue" … /> 
```
This lets you see only the subset of the conversation relevant to that turn.

#### Choices

For each turn, there are multiple <Choices> blocks, each focusing on different questions: 

1. User’s intent in this turn (multiple choice). 
2. Whether the assistant’s response addresses that intent (single choice). 
3. Whether the assistant’s response is accurate/helpful (single choice). 
4. The implied “action” of the assistant’s response (multiple choice).

The `toName` attributes (for instance, `toName="turn1_prg"`) tie each set of choices to that turn’s Paragraphs object, so each question is specifically linked to the text of that turn.

## Related tags

- [Paragraphs](/tags/paragraphs.html)
- [Choices](/tags/choices.html)