// D:\label-studio\web\apps\labelstudio\src\locales\en-US.js

// 1. 定义翻译对象
export const TRANSLATIONS_EN = {
  // Common terms
  cancel: "Cancel",
  save: "Save",
  common: {
    workspace: "Workspace",
    select_option: "Select an option",
    workspace_description: "Simplify project management by organizing projects into workspaces.",
    learn_more: "Learn more",
  },

  // Page translations
  pages: {
    create_project: {
      title: "Create Project",
      steps: {
        name: "Project Name",
        import: "Data Import",
        config: "Labeling Setup",
      },
      project_name: {
        name_title: "Project Name",
        description_title: "Description",
        description_placeholder: "Optional description of your project",
      }
    }
  }
};

// 2. Export in i18next format
export const en_US = {
  translation: TRANSLATIONS_EN,
};
