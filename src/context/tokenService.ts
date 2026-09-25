// tokenService.ts
export const tokenService = {
  getDesignerCode: () => localStorage.getItem("designerCode"),
  setDesignerCode: (code: string) => localStorage.setItem("designerCode", code),
  clearDesignerCode: () => localStorage.removeItem("designerCode"),
  get: () => localStorage.getItem("token"),
  set: (token: string) => localStorage.setItem("token", token),
  clear: () => localStorage.removeItem("token"),
  setAccountSetup: (isAccountSetup: boolean) => localStorage.setItem("is_account_setup", isAccountSetup.toString()),
  getAccountSetup: () => localStorage.getItem("is_account_setup")
};