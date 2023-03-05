import {ComponentField, InferComponentDefinition, Component} from "./component";
import {World} from "./world";
import {$buildArchetype, buildArchetype} from "./archetype";
import {createEntity} from "./entity";
import {NestedTypedArray, TypedArray} from "./types";

// @todo: This produces a nested array but we're only interested in the second level. Get rid of this level
export type PrefabOptions<Components extends Readonly<Component<any>[]>> = Map<
  Components,
  ComponentsPrefabFields<Components>
>[0];

export type PrefabField<C extends Component<any>> = Omit<
  {
    [key in keyof C]: InferComponentDefinition<C>[key] extends infer Field
      ? Field extends TypedArray
        ? ComponentField<Field>[0]
        : Field extends NestedTypedArray
        ? ComponentField<Field>[0]
        : never
      : never;
  },
  "id" | "data"
>;

export type ComponentsPrefabFields<T extends Readonly<Component<any>[]>> = {
  [K in keyof T]: PrefabField<T[K]>;
};

// Map function utility
type Map<T, U> = {[K in keyof T]: U};

/**
 * The prefab definition is an object grouping the prefab's specific set of components.
 * @example const definition: PrefabDefinition = { sprite, velocity, health }
 */
export type PrefabDefinition = Readonly<{
  [key: string]: Component<any>;
}>;
/**
 * The prefab instance options is describing the possible parameters for the given prefab definition.
 */
export type PrefabInstanceOptions<Options extends PrefabDefinition> = {
  [ComponentName in keyof Options]?: Partial<
    PrefabField<Options[ComponentName]>
  >;
};

/**
 * Creates a factory function to generate entities of a certain type by using
 * objects to initialize its components values.
 * @param world
 * @param components
 * @returns entity factory function
 */
export const prefab = <Definition extends PrefabDefinition>(
  world: World,
  definition: Definition,
  defaultProps?: PrefabInstanceOptions<Definition>
) => {
  const components = Object.values(definition);
  const archetype = buildArchetype(components, world);

  if (defaultProps) {
    return (options?: PrefabInstanceOptions<Definition>) => {
      const eid = createEntity(world, archetype);

      for (const componentName in defaultProps) {
        const component = definition[componentName];
        const props = defaultProps[componentName];

        for (const prop in props) {
          component[prop][eid] = props![prop];
        }
      }

      for (const componentName in options) {
        const component = definition[componentName];
        const props = options[componentName];

        for (const prop in props) {
          component[prop][eid] = props![prop];
        }
      }

      return eid;
    };
  }

  return (options?: PrefabInstanceOptions<Definition>) => {
    const eid = createEntity(world, archetype);

    for (const componentName in options) {
      const component = definition[componentName];
      const props = options[componentName];

      for (const prop in props) {
        component[prop][eid] = props![prop];
      }
    }

    return eid;
  };
};

/**
 * Creates a factory function to generate entities of a certain type by using
 * objects to initialize its components values.
 * This prefab function version unrolls the assignation loop during runtime to gain some performance.
 * @param world
 * @param components
 * @returns entity factory function
 */
export const $prefab = <Definition extends PrefabDefinition>(
  world: World,
  definition: Definition,
  defaultProps?: PrefabInstanceOptions<Definition>
) => {
  const components = Object.values(definition);
  const archetype = $buildArchetype(components, world);

  const inlineAssignInstanceValues =
    makeInlinePrefabInstanceAssignationFunction(definition);

  if (defaultProps) {
    const inlineAssignDefaultValues =
      makeInlinePrefabDefaultAssignationFunction(definition, defaultProps);

    return (options?: PrefabInstanceOptions<Definition>) => {
      const eid = createEntity(world, archetype);

      inlineAssignDefaultValues(eid, definition);

      if (!options) return eid;

      inlineAssignInstanceValues(eid, definition, options);

      return eid;
    };
  }

  return (options?: PrefabInstanceOptions<Definition>) => {
    const eid = createEntity(world, archetype);

    if (!options) return eid;

    inlineAssignInstanceValues(eid, definition, options);

    return eid;
  };
};

export const makeInlinePrefabDefaultAssignationFunction = <
  Definition extends PrefabDefinition
>(
  definition: Definition,
  defaultProps: PrefabInstanceOptions<Definition>
) => {
  const defaultComponentIdentifiers = Object.keys(defaultProps)
    .map((componentName) => {
      return `
      const ${componentName} = definition.${componentName};
      `;
    })
    .join("");

  const unrolledDefaultComponentAssignations = Object.keys(defaultProps)
    .map((componentName) => {
      const componentAssignations = Object.entries(defaultProps[componentName]!)
        .map(([prop, val]) => {
          // if val is a string then its quotes will be removed. So we need to add them back.
          if (typeof val === "string") {
            return `
            ${componentName}.${prop}[eid] = '${val}';
          `;
          }

          return `
            ${componentName}.${prop}[eid] = ${val};
          `;
        })
        .join("");

      return componentAssignations;
    })
    .join("");

  const unrolledDefaultLoop = `
    ${defaultComponentIdentifiers}
    ${unrolledDefaultComponentAssignations}
  `;

  return new Function(
    "eid",
    "definition",
    `
      ${unrolledDefaultLoop}
  `
  );
};

const makeInlinePrefabInstanceAssignationFunction = <
  Definition extends PrefabDefinition
>(
  definition: Definition
) => {
  const allComponentIdentifiers = Object.keys(definition)
    .map((componentName) => {
      return `
      const ${componentName} = definition.${componentName};
      `;
    })
    .join("");
  // console.log(`${allComponentIdentifiers}`);

  const unrolledInstanceComponentAssignations = Object.keys(definition)
    .map((componentName) => {
      const componentAssignations = Object.entries(definition[componentName]!)
        .map(([prop, val]) => {
          if (prop === "data" || prop === "id") return "";
          return `
            options_${componentName}.${prop} && (${componentName}.${prop}[eid] = options_${componentName}.${prop});
          `;
          return `
            options.${componentName}.${prop} && (${componentName}.${prop}[eid] = options.${componentName}.${prop});
          `;
        })
        .join("");

      return `
        if(options.${componentName}){
          const options_${componentName} = options.${componentName}
          ${componentAssignations}
        }
      `;
    })
    .join("");
  // console.log(`${unrolledInstanceComponentAssignations}`);

  const unrolledInstanceLoop = `
    ${allComponentIdentifiers}
    ${unrolledInstanceComponentAssignations}
  `;
  // console.log(`${unrolledInstanceLoop}`);
  return new Function(
    "eid",
    "definition",
    "options",
    `
      ${unrolledInstanceLoop}
  `
  );
};
