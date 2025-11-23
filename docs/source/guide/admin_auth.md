---
title: SSO, LDAP & SCIM
short: SSO, LDAP & SCIM
tier: enterprise
type: guide
order: 0
order_enterprise: 383
meta_title: Identity and access options for Label Studio Enterprise
meta_description: Overview of identity and access options available in Label Studio Enterprise
section: "Manage Your Organization"
date: 2025-09-21 09:08:58
---

Label Studio Enterprise provides enterprise-grade identity and access management to centralize authentication, automate user lifecycle, and control access across organizations, workspaces, and projects.



!!! info Tip
    SSO handles authentication; SCIM handles automated user and group provisioning. 
    
    Most enterprises enable SSO first, then SCIM for ongoing user/group sync. LDAP is typically used for on‑prem deployments.

## LDAP

On-prem only.

Authenticate against your directory (e.g., AD/LDAP) in self-hosted environments while keeping roles managed in Label Studio.

- Login with enterprise directory credentials
- Keep RBAC and project/workspace permissions in Label Studio

See [Set up LDAP authentication for Label Studio](auth_ldap).

## SSO (SAML 2.0)

Authenticate users via your IdP (Okta, Google SAML, Azure AD/Microsoft Entra, Ping Identity, OneLogin, etc.) for seamless, secure login flows.

- Centralized login with your IdP
- Single sign-on across your tools
- Enterprise security policies enforced at IdP

See [Set up SSO authentication for Label Studio](auth_setup) and our [SAML API docs](https://api.labelstud.io/api-reference/api-reference/sso/saml/get).

## SCIM 2.0

Automate provisioning/deprovisioning and group-to-role mappings. Supports Create/Update/Deactivate Users and Push Groups, including workspace/project membership management.

- Provision/deprovision users automatically
- Sync user profile changes
- Push Groups for workspace and project membership
- Map groups to organization roles and project-level roles 

See and [Set up SCIM2 for Label Studio](scim_setup) our [SCIM API docs](https://api.labelstud.io/api-reference/api-reference/sso/scim/get).