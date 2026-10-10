// tokenService.ts
// Auth tokens now live in httpOnly cookies managed by the backend and are never
// exposed to JS. Only the non-secret designer_code is cached client-side.
export const tokenService = {
  getDesignerCode: () => localStorage.getItem("designerCode"),
  setDesignerCode: (code: string) => localStorage.setItem("designerCode", code),
  clearDesignerCode: () => localStorage.removeItem("designerCode"),
  setAccountSetup: (isAccountSetup: boolean) => localStorage.setItem("is_account_setup", isAccountSetup.toString()),
  getAccountSetup: () => localStorage.getItem("is_account_setup"),
  clearAccountSetup: () => localStorage.removeItem("is_account_setup"),
  setAccountSetupPromptDismissed: () => localStorage.setItem("account_setup_prompt_dismissed", "true"),
  getAccountSetupPromptDismissed: () => localStorage.getItem("account_setup_prompt_dismissed") === "true",
  clearAccountSetupPromptDismissed: () => localStorage.removeItem("account_setup_prompt_dismissed")
};
