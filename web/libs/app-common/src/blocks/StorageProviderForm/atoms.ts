import { atom } from "jotai";

export interface FormState {
  currentStep: number;
  formData: {
    project: number;
    provider: string;
    title: string;
    use_blob_urls: boolean;
    recursive_scan: boolean;
    regex_filter: string;
    [key: string]: any;
  };
  isComplete: boolean;
}

export const formStateAtom = atom<FormState>({
  currentStep: 0,
  formData: {
    project: 0,
    provider: "s3",
    title: "",
    use_blob_urls: false,
    recursive_scan: false,
    regex_filter: "",
  },
  isComplete: false,
});
