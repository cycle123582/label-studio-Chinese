import { getJestProjects } from "@nx/jest";
import { pathsToModuleNameMapper } from "ts-jest";

export default {
  projects: getJestProjects(),
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@humansignal/core": ["libs/core/src/index.ts"],
      "@humansignal/datamanager": ["libs/datamanager/src/index.js"],
      "@humansignal/editor": ["libs/editor/src/index.js"],
      "@humansignal/frontend-test/*": ["libs/frontend-test/src/*"],
      "@humansignal/ui": ["libs/ui/src/index.ts"],
      "@humansignal/icons": ["libs/ui/src/assets/icons"],
      "@humansignal/shad/*": ["./libs/ui/src/shad/*"],
    },
    { prefix: "<rootDir>/../../" },
  ),
};
