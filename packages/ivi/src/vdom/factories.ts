// import { CSSStyleProps } from "../dom/style";
import { NodeFlags } from "./node_flags";
import { OpNode, Op, ElementData, createOpNode, createOpType } from "./operations";
import { OpState } from "./state";
import { checkElement } from "../debug/element";

export function elementFactory<T, U>(tag: string, flags: NodeFlags) {
  const type = createOpType(flags, tag);
  return DEBUG ?
    (n?: string, a?: {}, c: Op = null) => {
      checkElement(tag, a, (flags & NodeFlags.Svg) !== 0);
      return createOpNode<ElementData>(type, { n, a, c });
    } :
    /* istanbul ignore else */(n?: string, a?: {}, c: Op = null) => createOpNode<ElementData>(type, { n, a, c });
}

/**
 * htmlElementFactory creates a HTML element operation factories.
 *
 * @param tag HTML element tag name.
 * @returns HTML element operation factory.
 */
export const htmlElementFactory: <T, U>(tag: string) => (
  className?: string,
  attrs?: {},
  children?: Op,
) => OpNode<ElementData<T>> = (tag: string) => elementFactory(tag, NodeFlags.Element);

/**
 * svgElementFactory creates a SVG element operation factories.
 *
 * @param tag SVG element tag name.
 * @returns SVG element operation factory.
 */
export const svgElementFactory: <T, U>(tag: string) => (
  className?: string,
  attrs?: {},
  children?: Op,
) => OpNode<ElementData<T>> = (tag: string) => elementFactory(tag, NodeFlags.Element | NodeFlags.Svg);

/**
 * `elementProto()` creates a factory that produces elements with predefined attributes.
 *
 * @example
 *
 *     const DivWithIdAttribute = element(div(_, { id: "predefined-id" }));
 *
 *     render(
 *       DivWithIdAttribute("class-name", { title: "Title" }, "Hello World"),
 *       document.getElementById("app")!,
 *     );
 *
 * @param p Element prototype.
 * @returns Factory that produces elements with predefined attributes.
 */
export function elementProto<P>(p: OpNode<ElementData<P>>) {
  /* istanbul ignore else */
  if (DEBUG) {
    if (p.d.c !== null) {
      throw new Error(`Invalid OpNode, element prototypes can't have any children`);
    }
    checkElement(p.t.d as string, p.d.a, (p.t.f & NodeFlags.Svg) !== 0);
  }
  const type = createOpType(p.t.f | NodeFlags.ElementProto, { n: null, p });
  return (n?: string, a?: {}, c: Op = null) => createOpNode<ElementData>(type, { n, a, c });
}

/**
 * component creates an OpNode factory that produces nodes for components.
 *
 * @example
 *
 *     const A = component<string>(() => {
 *       let _text;
 *       const click = onClick(() => { console.log(_text); });
 *
 *       return (text) => (
 *         _text = text,
 *         Events(click,
 *           button(_, _, "Click Me"),
 *         )
 *       );
 *     });
 *
 * @param c Component function.
 * @param shouldUpdate `shouldUpdate` function.
 * @returns Factory that produces component nodes.
 */
export function component(
  c: (c: OpState) => () => Op,
): () => OpNode<undefined>;

/**
 * component creates an OpNode factory that produces nodes for components.
 *
 * @example
 *
 *     const A = component<string>(() => {
 *       let _text;
 *       const click = onClick(() => { console.log(_text); });
 *
 *       return (text) => (
 *         _text = text,
 *         Events(click,
 *           button(_, _, "Click Me"),
 *         )
 *       );
 *     });
 *
 * @param c Component function.
 * @param shouldUpdate `shouldUpdate` function.
 * @returns Factory that produces component nodes.
 */
export function component<P>(
  c: (c: OpState) => (props: P) => Op,
  shouldUpdate?: undefined extends P ? undefined : (prev: P, next: P) => boolean,
): undefined extends P ? (props?: P) => OpNode<P> : (props: P) => OpNode<P>;

/**
 * component creates an OpNode factory that produces nodes for components.
 *
 * @example
 *
 *     const A = component<string>(() => {
 *       let _text;
 *       const click = onClick(() => { console.log(_text); });
 *
 *       return (text) => (
 *         _text = text,
 *         Events(click,
 *           button(_, _, "Click Me"),
 *         )
 *       );
 *     });
 *
 * @param c Component function.
 * @param su `shouldUpdate` function.
 * @returns Factory that produces component nodes.
 */
export function component<P>(
  c: (c: OpState) => (props: P) => Op,
  su?: (prev: P, next: P) => boolean,
): (props: P) => OpNode<P> {
  const type = createOpType(NodeFlags.Component | NodeFlags.Stateful | NodeFlags.DirtyCheck, { c, su });
  return (props: P) => createOpNode(type, props);
}

/**
 * statelessComponent creates an OpNode factory that produces nodes for stateless components.
 *
 * @example
 *
 *     const A = statelessComponent<string>((text) => div(_, _, text));
 *
 * @param update Update function.
 * @param shouldUpdate `shouldUpdate` function.
 * @returns Factory that produces stateless component nodes.
 */
export function statelessComponent(
  update: () => Op,
): () => OpNode<undefined>;

/**
 * statelessComponent creates an OpNode factory that produces nodes for stateless components.
 *
 * @example
 *
 *     const A = statelessComponent<string>((text) => div(_, _, text));
 *
 * @param update Update function.
 * @param su `shouldUpdate` function.
 * @returns Factory that produces stateless component nodes.
 */
export function statelessComponent<P>(
  update: (props: P) => Op,
  su?: undefined extends P ? undefined : (prev: P, next: P) => boolean,
): undefined extends P ? (props?: P) => OpNode<P> : (props: P) => OpNode<P>;

/**
 * statelessComponent creates an OpNode factory that produces nodes for stateless components.
 *
 * @example
 *
 *     const A = statelessComponent<string>((text) => div(_, _, text));
 *
 * @param c Update function.
 * @param su `shouldUpdate` function.
 * @returns Factory that produces stateless component nodes.
 */
export function statelessComponent<P>(
  c: (props: P) => Op,
  su?: undefined extends P ? undefined : (prev: P, next: P) => boolean,
): (props: P) => OpNode<P> {
  const type = createOpType(NodeFlags.Component, { c, su });
  return (props: P) => createOpNode(type, props);
}
