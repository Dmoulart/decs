import {createWorld, World} from "./world";
import {Types} from "./types";

// The string values of the possible components data types
export type ComponentDataType = keyof typeof Types

export type ComponentDefinition =  {[data :string]: typeof Types[ComponentDataType]}

const components: Array<ComponentDefinition> = []

export const defineComponent = (def: ComponentDefinition) => {
    
}
