---
title: Add users to Label Studio Enterprise
short: Add users
tier: enterprise
type: guide
order: 0
order_enterprise: 369
meta_title: Add and invite users to Label Studio
meta_description: Overview of how you can add users to Label Studio Enterprise
section: "Manage Your Organization"
parent: "manage_users"
parent_enterprise: "manage_users"
date: 2024-02-05 17:15:19
---

## Invite users to Label Studio Enterprise

Once the initial organization account is created, you can begin inviting users:

1. Open Label Studio and click the menu in the upper left. 
2. Select **Organization**. 

    If you do not see the **Organization** option, you do not have access to the Organization page. Only users in the Owner or Administrator role can access this page. 
3. From the Organization page, click **Invite Members**. 

From here you have two options:

* **Invite link**  
You can share this link with users, who can then complete the registration process. However, they will be unable to access Label Studio until an Owner or Administrator manually assigns them a role. See [User roles and permissions](admin_roles). 

    Click **Reset Link** to reset the link. When reset, anyone who has the old link will be unable to register a new user account. 

* **Invite via email**  
Enter a list of email addresses separated by commas and then select a user role for the new accounts. Users will receive an email with a link to create their Label Studio account, and will be able to access Label Studio as soon as their registration is complete. 

### Require invites for new users

While you can invite users to join your organization with the invite link, this does not prevent users from registering new account through the signup page (for on-prem deployments).

You can remove the option to create accounts through the `/user/signup` page by setting the following environment variable:

```bash
LABEL_STUDIO_DISABLE_SIGNUP_WITHOUT_LINK=true
```

Users will only be able to sign up through an invitation link or email. 

## Activate new users

Users who sign up through the link will not be able to access Label Studio until they are assigned a user role. 

To filter for users who are pending, select **Not Activated** from the roles filter at the top of the **Organization > Members** page:

<img style="max-width: 193px" src="/images/admin/user-activate.png" alt="Screenshot"/>

!!! note
    `NOT_ACTIVATED` status is equal to `Pending` status.

Then use the drop-down menu to assign a role:

![Screenshot of the role drop-down menu](/images/admin/user-pending.png)

