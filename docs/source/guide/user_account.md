---
title: Manage your user account settings
short: Account and settings
tier: all
type: guide
order: 378
order_enterprise: 378
meta_title: User Account and Settings
meta_description: Update your user account and settings in Label Studio
section: "Manage Your Organization"
parent_enterprise: "manage_users"
date: 2024-01-03 12:03:59
---

To access your user account and settings, click your user icon in the upper right and select **Account & Settings**. 

<div class="opensource-only">

![Screenshot of the account and settings option](/images/admin/account_settings.png)

</div>

<div class="enterprise-only">

![Screenshot of the account and settings option](/images/admin/account_settings_lse.png)

</div>


## Personal info

After you create an account in Label Studio, you can update the following:

* First name
* Last name
* Phone number
* Profile image (use an image no larger than 1200 x 1200 pixels or 1024 KB)

Because your email address is your username, you cannot update it. If you need to change your email address, you will need to create a different user with the new email address. 

## Hotkeys

Use this page to configure custom hotkeys for your user account. 

### Actions

| Action                  | Description                                                                      |
| ----------------------- | -------------------------------------------------------------------------------- |
| **Export Hotkeys**      | Generate a JSON file that you can share with other Label Studio users.           |
| **Import Hotkeys**      | Copy and paste JSON-formatted custom hotkey mapping.                             |
| **Reset to Defaults**   | Reset all hotkeys to their default values.                                       |

### Set custom hotkeys

For each hotkey, click the default hotkeys listed next each action. Then, when prompted, press the keys that you would like to use instead.

!!! note
    Each hotkey can be a single character key (a number, letter, symbol) or it can be a combination of a character key and multiple control keys (for example, `Shift`, `Control` `Option`, etc). 


<div style="width: 80%; margin-left: auto; margin-right: auto">

![Screenshot of customized key](/images/admin/global-hotkeys.png)

</div>

## Email preferences 

Use this page to select what kind of email notifications you want to receive.  

## Membership info

On this page, you can find information about your organization, such as when the organization was created and the email address of the Owner (the user who initially created the Label Studio organization).

<div class="enterprise-only">

You can also see your [user role](admin_roles) and a high-level summary of your contributions. 

</div>

<div class="opensource-only">

You can also see a high-level summary of your contributions. 

</div>

## Personal access token

!!! note
    Whether this option appears depends on [settings at your organization level](access_tokens#Enable-API-keys-for-an-organization). 

Click **Create** to generate an access token. When creating a token, ensure you save it somewhere secure, as it will only be visible one time. 

While personal access tokens work seamlessly with the Label Studio SDK, if you are using HTTP API requests, you will need to take extra steps. See [Personal access tokens and the API](access_tokens#Personal-access-tokens-and-the-API). 

<div class="enterprise-only">

You organization administrators may optionally set an expiration date for all personal access tokens. 

</div>

## Legacy token

!!! note
    Whether this option appears depends on [settings at your organization level](access_tokens#Enable-API-keys-for-an-organization). 

This token is pre-generated for you to use. Legacy tokens are easier to use for some API tasks, but are generally less secure. For more information, see [Access tokens](access_tokens).  

Click **Renew** to generate a new token. Any existing scripts using your old token will lose their authorization and will need to be updated to include your new token. 








