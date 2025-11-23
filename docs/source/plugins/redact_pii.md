---
title: Redact Annotator PII
type: plugins
category: Visualization
cat: visualization
order: 230
meta_title: Redact Annotator PII
meta_description: Anonymize the annotator to reduce bias
tier: enterprise
---

<img src="/images/plugins/redact-thumb.png" alt="" class="gif-border" style="max-width: 552px !important;" />

!!! note
     For information about modifying this plugin or creating your own custom plugins, see [Customize and Build Your Own Plugins](custom).

     For general plugin information, see [Plugins for projects](/guide/plugins) and [Plugin FAQ](faq).

## About

Hiding annotator information can help reduce bias. The sample labeling config provided below includes CSS that will hide annotator information in the labeling and review streams, for example:

![Screenshot of warning](/images/plugins/redact.png)

This script will then unhide annotator information, but only if the user is in an Administrator role:

![Screenshot of warning](/images/plugins/redact-show.png)

!!! note
    The labeling config CSS only hides information from the labeling and review streams. It does not hide information from the Data Manager. However, you can use the [project settings](/guide/project_settings_lse#Review) to disallow Annotators and Reviewers from accessing the Data Manager. 

## Plugin

```javascript
/*
  Hide annotator personal information (PII) if the logged user is not an Admin
*/

/**
 * Fetch currently logged user via the HumanSignal API
 */
async function fetchUserInfo() {
  const whoamiUrl = "https://app.humansignal.com/api/current-user/whoami";

  const response = await fetch(whoamiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // No Auth `credentials` needed for `same-origin` given Session-Based Authentication is used in the API
    }
  });

  if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Give visibility to the given selector
 */
function displayEl(sel) {
  const els = document.querySelectorAll(sel);
  if (els) {
    els.forEach(function (el, idx) {
      el.style.display = "block";
    });
  }
}

/**
 * If the logged in user is an Admin, remove the styling added to the view that hides
 * the annotator identity
 */
async function hidePII() {
  let user, role
  try {
    const userInfo = await fetchUserInfo();
    user = userInfo.username || 'Unknown';
    role = userInfo.organization_membership.role || 'Unknown';
  } catch (error) {
    Htx.showModal(`Error fetching user information: ${error.message}`);
  }

  if (!user) {
      console.warn("Did not find a username and it was not 'Unknown'");
      return;
  }

  if (role === 'AD') {
    // console.log("Role is admin; displaying PII");

    // If admin, remove the nulled Style tag
    const firstChild = document.getElementById('noPII').firstChild;
    if (firstChild.tagName === 'STYLE') {
        firstChild.remove();
    }
  }
}

(async () => {
  await hidePII();
})();
```

## Labeling config

```xml
<View idAttr="noPII">
  <Style>
    .lsf-annotation-button__user { display: none; }
    .lsf-userpic { display: none; }
    .lsf-annotation-button__userpic { display: none }
    .lsf-annotation-button__date { display: none; }
    .lsf-comment-item__name { display: none; }
    .lsf-comment-item__date { display: none; }
    .lsf-comment-item__userpic { display: none; }
    .lsf-history-item__name { display: none; }
    .lsf-history-item__date { display: none; }
  </Style>
  <Text name="text" value="$text" />
  <View style="box-shadow: 2px 2px 5px #999; padding: 20px; margin-top: 2em; border-radius: 5px;">
    <Header value="Choose text sentiment" />
    <Choices name="sentiment" toName="text" choice="single" showInLine="true">
      <Choice value="Positive" />
      <Choice value="Negative" />
      <Choice value="Neutral" />
    </Choices>
  </View>
</View>

```

**Related tags:**

* [View](/tags/view.html)
* [Style](/tags/style.html)
* [Text](/tags/text.html)
* [Header](/tags/header.html)
* [Choices](/tags/choices.html)


## Sample data

```json
[
  {
    "data": {
      "text": "I recently purchased a portable Bluetooth speaker and have been impressed with its clear sound and long battery life. The speaker is compact and easy to use, making it perfect for outdoor adventures."
    }
  },
  {
    "data": {
      "text": "I bought a smartwatch from this vendor and it has exceeded my expectations. The device offers an intuitive user interface and tracks my daily activities accurately while looking very stylish on my wrist."
    }
  },
  {
    "data": {
      "text": "I ordered a pair of noise-cancelling headphones and they don't do anything to cancel out noise. Waste of money."
    }
  }
]
```
