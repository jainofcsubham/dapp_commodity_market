export interface BarContextType {
    showBar : (note:string,type : "error" | "info" | "success" | "warning") => void,
}