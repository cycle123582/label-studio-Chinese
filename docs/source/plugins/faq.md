---
title: Plugins Frequently Asked Questions
short: Plugins FAQ
type: plugins
category: Overview
cat: overview
order: 5
meta_title: Plugins Frequently Asked Questions
tier: enterprise
---

### What are plugins?

Plugins allow you to run custom JavaScript code directly within the labeling interface. 

This feature empowers you to extend and customize Label Studio’s behavior. For example, you can add data validations, dynamic UI enhancements, or integrating external libraries, thereby tailoring the labeling workflow to your specific requirements. By leveraging the [LSI (Label Studio Interface) object](custom#Label-Studio-Interface-LSI), you can manage events, import additional scripts, and access task and annotation data on the fly, ensuring that your custom logic executes each time an annotation is rendered.

Plugins are configured on a per-project basis from **Project > Settings > Labeling Interface**. 

![Screenshot of plugin panel](/images/plugins/plugin-panel.png)


### How can I get plugins?

Plugins are only available for Label Studio Enterprise users, and they must be enabled upon request. 

You can contact your account manager, open a [support ticket](mailto:support@humansignal.com), or click **Request Access** from the plugins panel under **Project > Settings > Labeling Interface**.  

### Why do you need to enable plugins before I can use them?

Because plugins operate in real-time on the annotator's browser, they come with [important security considerations](/guide/plugins#Security-notes-constraints-and-limitations) and are therefore only enabled upon request. 


### Are plugins available for Starter Cloud users?

No, they are only available in Label Studio Enterprise. 

### Who can access plugins?

By default, only users who are in the Admin, Owner, or Manager role can access the project settings to view, add, and edit plugins. 
    
You can optionally add a restriction so that only users in the Admin or Owner role can add or edit plugins. To request this, contact your account manager or [open a support ticket](mailto:support@humansignal.com). 


### Can I customize plugins? 

Yes! The plugins available out-of-the-box are intended as starting points that can be modified to suit your needs. 

Changes you make to the provided plugins stay within the context of the project. To update the plugin source, you would need to make a pull request to the [Plugins repo](https://github.com/HumanSignal/label-studio-plugins). 


### Can I write my own?

Yes! Instead of choosing an out-of-the box plugin to modify, you can write your own from scratch. See [Build Your Own Custom Plugins](custom).

!!! note
    If you build a plugin that you'd be willing to share with other Label Studio Enterprise users, we invite you to submit it to the [Plugins repo](https://github.com/HumanSignal/label-studio-plugins). 

### Can I insert multiple plugins?

Yes, they stack. 


### Where can I learn more?

* [Label Studio Interface reference](custom#Label-Studio-Interface-LSI)
* [Plugins for projects](/guide/plugins)
* [Plugins repo](https://github.com/HumanSignal/label-studio-plugins)
* [Label Studio Frontend reference](/guide/frontend_reference.html#Available-events)




