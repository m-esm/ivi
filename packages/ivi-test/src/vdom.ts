import { CSSStyleProps, shallowEqual, Predicate } from "ivi-core";
import { EventSource } from "ivi-events";
import { VNode, VNodeFlags, Component, StatefulComponent, StatelessComponent, ConnectDescriptor } from "ivi";
import { containsClassName, containsEventHandler, matchValues, matchKeys } from "./utils";
import { VNodeMatcher, query, queryAll, closest } from "./query";
import { SnapshotOptions, toSnapshot } from "./snapshot";

export function visitUnwrapped(
  vnode: VNode,
  parent: VNode | null,
  context: {},
  visitor: (vnode: VNode, parent: VNode | null, context: {}) => boolean,
): boolean {
  if (visitor(vnode, parent, context) === true) {
    return true;
  }

  const flags = vnode.flags;
  if ((flags & (
    VNodeFlags.ChildrenVNode |
    VNodeFlags.StatelessComponent |
    VNodeFlags.StatefulComponent |
    VNodeFlags.Connect |
    VNodeFlags.UpdateContext
  )) !== 0) {
    const children = vnode.children;
    if ((flags & VNodeFlags.ChildrenVNode) !== 0) {
      let child: VNode | null = children as VNode;
      do {
        if (visitUnwrapped(child, vnode, context, visitor) === true) {
          return true;
        }
        child = child.next;
      } while (child !== null);
    } else {
      if ((flags & VNodeFlags.UpdateContext) !== 0) {
        context = Object.assign({}, context, vnode.props);
      }
      if (children !== null) {
        return visitUnwrapped(children as VNode, vnode, context, visitor);
      }
    }
  }

  return false;
}

export function visitWrapped(
  wrapper: VNodeWrapper,
  visitor: (wrapper: VNodeWrapper) => boolean,
): boolean {
  if (visitor(wrapper) === true) {
    return true;
  }

  const vnode = wrapper.vnode;
  const flags = vnode.flags;
  if ((flags & (
    VNodeFlags.ChildrenVNode |
    VNodeFlags.StatelessComponent |
    VNodeFlags.StatefulComponent |
    VNodeFlags.Connect |
    VNodeFlags.UpdateContext
  )) !== 0) {
    let context = wrapper.context;
    const children = vnode.children;
    if ((flags & VNodeFlags.ChildrenVNode) !== 0) {
      let child: VNode | null = children as VNode;
      do {
        if (visitWrapped(new VNodeWrapper(child, wrapper, context), visitor) === true) {
          return true;
        }
        child = child.next;
      } while (child !== null);
    } else {
      if ((flags & VNodeFlags.UpdateContext) !== 0) {
        context = Object.assign({}, context, vnode.props);
      }
      if (children !== null) {
        return visitWrapped(new VNodeWrapper(children as VNode, wrapper, context), visitor);
      }
    }
  }

  return false;
}

function _virtualRender(depth: number, vnode: VNode, parent: VNode | null, context: {}): boolean {
  const flags = vnode.flags;
  if ((flags & (VNodeFlags.StatefulComponent | VNodeFlags.StatelessComponent | VNodeFlags.Connect)) !== 0) {
    if ((flags & (VNodeFlags.StatefulComponent | VNodeFlags.StatelessComponent)) !== 0) {
      if ((flags & VNodeFlags.StatefulComponent) !== 0) {
        const component = vnode.instance = new (vnode.tag as StatefulComponent<any>)(vnode.props);
        vnode.children = component.render();
      } else {
        const component = vnode.tag as StatelessComponent<any>;
        vnode.children = component.render(vnode.props);
      }
    } else {
      const connect = vnode.tag as ConnectDescriptor<any, any, any>;
      const next = vnode.instance = connect.select(null, vnode.props, context);
      vnode.children = connect.render(next);
    }
    if (depth === -1 || depth > 1) {
      return _virtualRender(depth - 1, vnode.children, vnode, context);
    }
  }
  return false;
}

export function virtualRender(
  root: VNode,
  rootContext: {} = {},
  depth = 1,
): VNodeWrapper {
  visitUnwrapped(root, null, rootContext,
    function (vnode: VNode, parent: VNode | null, context: {}) {
      return _virtualRender(depth, vnode, parent, context);
    },
  );
  return new VNodeWrapper(root, null, rootContext);
}

export class VNodeListWrapper {
  readonly items: VNodeWrapper[];

  constructor(items: VNodeWrapper[]) {
    this.items = items;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  filter(matcher: VNodeMatcher): VNodeListWrapper {
    return new VNodeListWrapper(this.items.filter(function (i) {
      return matcher.match(i);
    }));
  }

  forEach(fn: (n: VNodeWrapper, i: number) => void): void {
    this.items.forEach(fn);
  }

  map<P>(fn: (n: VNodeWrapper, i: number) => P): P[] {
    return this.items.map((n, i) => fn(n, i));
  }

  slice(begin?: number, end?: number): VNodeListWrapper {
    return new VNodeListWrapper(this.items.slice(begin, end));
  }

  at(index: number): VNodeWrapper {
    return this.items[index];
  }

  first(): VNodeWrapper {
    return this.items[0];
  }

  last(): VNodeWrapper {
    return this.items[this.items.length - 1];
  }

  some(matcher: VNodeMatcher): boolean {
    return this.items.some(matcher.match);
  }

  every(matcher: VNodeMatcher): boolean {
    return this.items.every(matcher.match);
  }
}

export class VNodeWrapper {
  readonly vnode: VNode;
  readonly parent: VNodeWrapper | null;
  readonly context: {};

  constructor(vnode: VNode, parent: VNodeWrapper | null, context: {}) {
    this.vnode = vnode;
    this.parent = parent;
    this.context = context;
  }

  is(matcher: VNodeMatcher): boolean {
    return matcher.match(this);
  }

  isText(): boolean {
    return (this.vnode.flags & VNodeFlags.Text) !== 0;
  }

  isElement(): boolean {
    return (this.vnode.flags & VNodeFlags.Element) !== 0;
  }

  isComponent(): boolean {
    return (this.vnode.flags & (VNodeFlags.StatefulComponent | VNodeFlags.StatelessComponent)) !== 0;
  }

  isStatefulComponent(): boolean {
    return (this.vnode.flags & VNodeFlags.StatefulComponent) !== 0;
  }

  isStatelessComponent(): boolean {
    return (this.vnode.flags & VNodeFlags.StatelessComponent) !== 0;
  }

  isContextComponent(): boolean {
    return (this.vnode.flags & VNodeFlags.UpdateContext) !== 0;
  }

  isConnectComponent(): boolean {
    return (this.vnode.flags & VNodeFlags.Connect) !== 0;
  }

  isInputElement(): boolean {
    return (this.vnode.flags & VNodeFlags.InputElement) !== 0;
  }

  getTagName(): string {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::getTagName() can only be called on element nodes");
    }
    if (this.isInputElement()) {
      return "input";
    }
    return this.vnode.tag as string;
  }

  getDOMInstance<P extends Node>(): P {
    if (!this.isText() && !this.isElement()) {
      throw new Error("VNodeWrapper::getDOMInstance() can only be called on DOM nodes");
    }
    if (this.vnode.instance === null) {
      throw new Error("Virtual DOM node is not instantiated");
    }
    return this.vnode.instance as P;
  }

  getComponentInstance<P extends Component<any>>(): P {
    if (!this.isStatefulComponent()) {
      throw new Error("VNodeWrapper::getComponentInstance() can only be called on stateful components");
    }
    if (this.vnode.instance === null) {
      throw new Error("Virtual DOM node is not instantiated");
    }
    return this.vnode.instance as P;
  }

  getCurrentContext<P = {}>(): P {
    return this.context as P;
  }

  getKey(): any {
    if ((this.vnode.flags & VNodeFlags.Key) === 0) {
      return null;
    }
    return this.vnode.key;
  }

  getChildren(): VNodeListWrapper {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::getChildren() can only be called on element nodes");
    }
    const flags = this.vnode.flags;
    let children: VNodeWrapper[];
    if ((flags & VNodeFlags.ChildrenVNode) !== 0) {
      children = [];
      let child: VNode | null = this.vnode.children as VNode;
      do {
        children.push(new VNodeWrapper(child, this, this.context));
        child = child.next;
      } while (child !== null);
    } else {
      children = [];
    }
    return new VNodeListWrapper(children);
  }

  getClassName(): string | undefined {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::getClassName() can only be called on element nodes");
    }
    return this.vnode.className;
  }

  getElementProps(): any {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::getElementProps() can only be called on element nodes");
    }
    return this.vnode.props.attrs;
  }

  getElementStyle(): any {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::getElementProps() can only be called on element nodes");
    }
    return this.vnode.props.style;
  }

  getInnerText(): string {
    return innerText(this);
  }

  getInputValue(): string | null {
    if (!this.isInputElement()) {
      throw new Error("VNodeWrapper::getInputValue() can only be called on input element nodes");
    }
    return this.vnode.children as string | null;
  }

  getInputChecked(): boolean | null {
    if (!this.isInputElement()) {
      throw new Error("VNodeWrapper::getInputChecked() can only be called on input element nodes");
    }
    return this.vnode.children as boolean | null;
  }

  hasFactory(factory: Function): boolean {
    return hasFactory(this, factory);
  }

  hasParent(matcher: VNodeMatcher): boolean {
    return hasParent(this, matcher.match);
  }

  hasChild(matcher: VNodeMatcher): boolean {
    return hasChild(this, matcher.match);
  }

  hasSibling(matcher: VNodeMatcher): boolean {
    return hasSibling(this, matcher.match);
  }

  hasPrevSibling(matcher: VNodeMatcher): boolean {
    return hasPrevSibling(this, matcher.match);
  }

  hasClassName(className: string): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasClassName() can only be called on element nodes");
    }
    return hasClassName(this, className);
  }

  hasExplicitKey(): boolean {
    return (this.vnode.flags & VNodeFlags.Key) !== 0;
  }

  hasProps(props: { [key: string]: any }): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasProps() can only be called on element nodes");
    }
    return hasProps(this, props);
  }

  hasExactProps(props: { [key: string]: any }): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasExactProps() can only be called on element nodes");
    }
    return hasExactProps(this, props);
  }

  hasAssignedProps(props: { [key: string]: boolean }): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasAssignedProps() can only be called on element nodes");
    }
    return hasAssignedProps(this, props);
  }

  hasStyle(style: CSSStyleProps): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasStyle() can only be called on element nodes");
    }
    return hasStyle(this, style);
  }

  hasExactStyle(style: CSSStyleProps): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasExactStyle() can only be called on element nodes");
    }
    return hasExactStyle(this, style);
  }

  hasAssignedStyle(style: { [key: string]: boolean }): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasAssignedStyle() can only be called on element nodes");
    }
    return hasAssignedStyle(this, style);
  }

  hasEventHandler(eventSource: EventSource): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasEventHandler() can only be called on element nodes");
    }
    return hasEventHandler(this, eventSource);
  }

  hasUnsafeHTML(html?: string): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::hasUnsafeHTML() can only be called on element nodes");
    }
    return hasUnsafeHTML(this, html);
  }

  isAutofocused(): boolean {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::isAutofocused() can only be called on element nodes");
    }
    return isAutofocused(this);
  }

  hasInputValue(value?: string): boolean {
    if (!this.isInputElement()) {
      throw new Error("VNodeWrapper::hasInputValue() can only be called on input element nodes");
    }
    return hasInputValue(this, value);
  }

  isInputChecked(value?: boolean): boolean {
    if (!this.isInputElement()) {
      throw new Error("VNodeWrapper::hasInputChecked() can only be called on input element nodes");
    }
    return hasInputChecked(this, value);
  }

  query(matcher: VNodeMatcher): VNodeWrapper | null {
    return query(this, matcher.match);
  }

  queryAll(matcher: VNodeMatcher): VNodeListWrapper {
    return new VNodeListWrapper(queryAll(this, matcher.match));
  }

  closest(matcher: VNodeMatcher): VNodeWrapper | null {
    return closest(this, matcher.match);
  }

  toSnapshot(options?: SnapshotOptions): string {
    return toSnapshot(this.vnode, options);
  }

  emit(ev: Event): void {
    if (!this.isElement()) {
      throw new Error("VNodeWrapper::emit() can only be called on element nodes");
    }
    this.getDOMInstance().dispatchEvent(ev);
  }
}

export function isElement(wrapper: VNodeWrapper, tagName: string): boolean {
  const vnode = wrapper.vnode;
  return ((vnode.flags & VNodeFlags.Element) !== 0 && vnode.tag === tagName);
}

export function isElementWithClassName(wrapper: VNodeWrapper, tagName: string, className: string): boolean {
  const vnode = wrapper.vnode;
  return (
    isElement(wrapper, tagName) === true &&
    vnode.className !== void 0 &&
    containsClassName(vnode.className, className) === true
  );
}

export function isInputElement(wrapper: VNodeWrapper, type: string): boolean {
  const vnode = wrapper.vnode;
  return ((vnode.flags & VNodeFlags.InputElement) !== 0 && vnode.tag === type);
}

export function isInputElementWithClassName(wrapper: VNodeWrapper, type: string, className: string): boolean {
  const vnode = wrapper.vnode;
  return (
    isInputElement(wrapper, type) === true &&
    vnode.className !== void 0 &&
    containsClassName(vnode.className, className) === true
  );
}

export function hasFactory(wrapper: VNodeWrapper, factory: Function): boolean {
  const vnode = wrapper.vnode;
  return (vnode.factory === factory);
}

export function hasKey(wrapper: VNodeWrapper, key: any): boolean {
  const vnode = wrapper.vnode;
  return ((vnode.flags & VNodeFlags.Key) !== 0 && vnode.key === key);
}

export function hasClassName(wrapper: VNodeWrapper, className: string): boolean {
  const vnode = wrapper.vnode;
  return (vnode.className !== void 0 && containsClassName(vnode.className, className) === true);
}

export function hasProps(wrapper: VNodeWrapper, props: { [key: string]: any }): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== void 0 && matchValues(vnode.props.props, props) === true);
}

export function hasExactProps(wrapper: VNodeWrapper, props: { [key: string]: any }): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && shallowEqual(vnode.props.props, props) === true);
}

export function hasAssignedProps(wrapper: VNodeWrapper, props: { [key: string]: boolean }): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && matchKeys(vnode.props.props, props));
}

export function hasStyle(wrapper: VNodeWrapper, style: CSSStyleProps): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && matchValues(vnode.props.style, style) === true);
}

export function hasExactStyle(wrapper: VNodeWrapper, style: CSSStyleProps): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && shallowEqual(vnode.props.style, style) === true);
}

export function hasAssignedStyle(wrapper: VNodeWrapper, style: { [key: string]: boolean }): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && matchKeys(vnode.props.style, style));
}

export function hasEventHandler(wrapper: VNodeWrapper, eventSource: EventSource): boolean {
  const vnode = wrapper.vnode;
  return (vnode.props !== null && containsEventHandler(vnode.props.events, eventSource) === true);
}

export function hasUnsafeHTML(wrapper: VNodeWrapper, html?: string): boolean {
  const vnode = wrapper.vnode;
  return ((vnode.flags & VNodeFlags.UnsafeHTML) !== 0 && (html === undefined || vnode.children === html));
}

export function isAutofocused(wrapper: VNodeWrapper): boolean {
  return ((wrapper.vnode.flags & VNodeFlags.Autofocus) !== 0);
}

export function hasInputValue(wrapper: VNodeWrapper, value?: string): boolean {
  const vnode = wrapper.vnode;
  return (vnode.children !== null && (value === undefined || vnode.children === value));
}

export function hasInputChecked(wrapper: VNodeWrapper, checked?: boolean): boolean {
  const vnode = wrapper.vnode;
  return (vnode.children !== null && (checked === undefined || vnode.children === checked));
}

export function hasParent(wrapper: VNodeWrapper, predicate: Predicate<VNodeWrapper>): boolean {
  let parent = wrapper.parent;
  while (parent !== null) {
    if (predicate(parent) === true) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

export function hasDirectParent(wrapper: VNodeWrapper, predicate: Predicate<VNodeWrapper>): boolean {
  const parent = wrapper.parent;
  return (parent !== null && predicate(parent) === true);
}

export function hasChild(wrapper: VNodeWrapper, predicate: Predicate<VNodeWrapper>): boolean {
  return visitWrapped(wrapper, function (n) {
    return (wrapper !== n && predicate(n) === true);
  });
}

export function hasSibling(wrapper: VNodeWrapper, predicate: Predicate<VNodeWrapper>): boolean {
  const parent = wrapper.parent;
  const next = wrapper.vnode.next;
  return (next !== null && predicate(new VNodeWrapper(next, parent, wrapper.context)) === true);
}

export function hasPrevSibling(wrapper: VNodeWrapper, predicate: Predicate<VNodeWrapper>): boolean {
  const parent = wrapper.parent;
  const prev = wrapper.vnode.prev;
  if (parent !== null) {
    if (parent.vnode.children === wrapper.vnode) {
      return false;
    }
    return predicate(new VNodeWrapper(prev, parent, wrapper.context)) === true;
  }
  return false;
}

export function innerText(wrapper: VNodeWrapper): string {
  let result = "";
  visitUnwrapped(
    wrapper.vnode,
    wrapper.parent === null ? null : wrapper.parent.vnode,
    wrapper.context,
    (vnode) => {
      if ((vnode.flags & VNodeFlags.Text) !== 0) {
        result += vnode.children;
      }
      return false;
    },
  );
  return result;
}
