---
title: Organization management
short: Overview
tier: enterprise
type: guide
order: 0
order_enterprise: 351
meta_title: Organization management
meta_description: Brief overview of organization structures in Label Studio Enterprise. 
section: "Manage Your Organization"
date: 2024-02-16 15:44:07
---


To manage organization membership, use the **Organization** page in Label Studio. Only users with the Owner or Administrator role can access this page:

<img style="max-width: 235px" src="/images/admin/org_page.png" alt="Screenshot of org link"/>

## Create the initial organization account

When creating a new organization, you must sign up directly without an invite link. 

For on-prem deployments, use `/user/signup`. 

For SaaS deployments, use [`app.humansignal.com/`](https://app.humansignal.com/).

When you sign up for Label Studio Enterprise or Starter Cloud for the first time, an organization associated with your account is automatically created. You become the owner of that organization. People who join Label Studio from an invitation link or with an LDAP or SSO role join an existing organization.

!!! note
    There can only be one Owner per organization. If the user in control of the Owner account leaves, you will need to [open a support ticket](https://support.humansignal.com/hc/en-us/requests/new) to request that this role be reassigned. 

## Single or multiple organizations

If permitted by your Label Studio plan, you can create organizations in Label Studio to further separate access to data and projects. For example, you could create separate organizations to separate work and access between completely unrelated departments. If some departments might collaborate with each other on a project, you can use one organization for both and instead use workspaces to organize the projects that they might or might not be collaborating on.

For example, you might set up one of the following possible configurations:

- One organization for your company, with one workspace for the support department and another for the development team, with specific projects in each workspace for different types of customer requests.

  <img style="width:70%" src="/images/LSE/LSE-one-org-many-workspaces.jpg" alt="Diagram showing Label Studio with one organization with multiple workspaces and projects within each workspace."/>

- Multiple organizations, such as one for the customer claims department and another for the customer support department, with specific workspaces in each organization for specific types of insurance, such as home insurance claims and auto insurance claims, and specific projects in each workspace for types of claims, such as Accident Claims, Injury Claims, Natural Disaster Claims. The Customer support organization might have workspaces specific to the types of support queues, with projects for specific types of calls received.

  <img style="width:70%" src="/images/LSE/LSE-multiple-orgs-workspaces.jpg" alt="Diagram showing Label Studio with three organizations, each one with multiple workspaces and projects within each workspace."/>

  When you assign a user role to an organization member, they hold that role for all workspaces and projects for that organization.

!!! note
    Having users in multiple organizations may prevent your access to the [Plugins feature](/plugins/). 

Managers within an organization can see all workspaces in that organization, even if they don't have access to perform actions in them. Annotators and reviewers can only see projects, not workspaces.

If you have access to multiple organizations, use the **Organizations** drop-down to switch between the organizations that you are a member of:

<img style="max-width: 242px" src="/images/admin/org-switch.png" alt="Screenshot of org switcher"/>


## Change organization name

Users in the Owner or Admin role can use the API to rename their organization:

```curl
LSE_URL=<Replace with your URL>
ORG_ID=<Replace with your org ID>
TOKEN=<Replace with your token>
  curl -X PATCH "$LSE_URL/api/organizations/$ORG_ID" \ 
    -H "Authorization: Token $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title": "New Org Name"}'
```

!!! note
    The example above uses the legacy token. To use your personal access token (JWT), use `-H "Authorization: Bearer $TOKEN"` instead.

