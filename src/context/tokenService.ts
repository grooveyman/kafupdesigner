// tokenService.ts
// Auth tokens now live in httpOnly cookies managed by the backend and are never
// exposed to JS. Only the non-secret designer_code is cached client-side.
export const tokenService = {
  getDesignerCode: () => localStorage.getItem("designerCode"),
  setDesignerCode: (code: string) => localStorage.setItem("designerCode", code),
  clearDesignerCode: () => localStorage.removeItem("designerCode"),
};
