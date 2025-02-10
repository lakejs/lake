/*
BSD 2-Clause License

Copyright (c) 2022, Big Sky Software
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Repository: https://github.com/bigskysoftware/idiomorph
*/

/* eslint-disable no-throw-literal */
/* eslint-disable antfu/if-newline */

import type { Nodes } from '../models/nodes';

declare global {
  interface Node {
    generatedByIdiomorph: boolean;
  }
}

declare interface configType {
  morphStyle?: 'innerHTML' | 'outerHTML';
  ignoreActive?: boolean;
  ignoreActiveValue?: boolean;
  head?: {
    style?: 'merge' | 'append' | 'morph' | 'none';
  };
  callbacks?: {
    beforeNodeAdded?: (node: Node) => void | boolean;
    afterNodeAdded?: (node: Node) => void;
    beforeNodeMorphed?: (oldNode: Node, newNode: Node) => void | boolean;
    afterNodeMorphed?: (oldNode: Node, newNode: Node) => void;
    beforeNodeRemoved?: (node: Node) => void | boolean;
    afterNodeRemoved?: (node: Node) => void;
    beforeAttributeUpdated?: (attributeName: string, node: Node, mutationType: string) => void | boolean;
    afterAttributeUpdated?: (attributeName: string, node: Node, mutationType: string) => void;
    beforeChildrenUpdated?: (oldNode: Node, newNode: Node) => void | boolean;
  };
}

type KeyValue = Record<string, any>;

const EMPTY_SET = new Set();

function noOp() {}

// default configuration values, updatable by users now
const defaults = {
  morphStyle: 'outerHTML',
  callbacks: {
    beforeNodeAdded: noOp,
    afterNodeAdded: noOp,
    beforeNodeMorphed: noOp,
    afterNodeMorphed: noOp,
    beforeNodeRemoved: noOp,
    afterNodeRemoved: noOp,
    beforeAttributeUpdated: noOp,
    afterAttributeUpdated: noOp,
    beforeChildrenUpdated: noOp,

  },
  head: {
    style: 'merge',
    shouldPreserve: (elt: Element) => elt.getAttribute('im-preserve') === 'true',
    shouldReAppend: (elt: Element) => elt.getAttribute('im-re-append') === 'true',
    shouldRemove: noOp,
    afterHeadMorphed: noOp,
  },
};

/*
  Deep merges the config object and the Idiomoroph.defaults object to
  produce a final configuration object
 */
function mergeDefaults(config: KeyValue): KeyValue {
  const finalConfig: KeyValue = {};
  // copy top level stuff into final config
  Object.assign(finalConfig, defaults);
  Object.assign(finalConfig, config);

  // copy callbacks into final config (do this to deep merge the callbacks)
  finalConfig.callbacks = {};
  Object.assign(finalConfig.callbacks, defaults.callbacks);
  Object.assign(finalConfig.callbacks, config.callbacks);

  // copy head config into final config  (do this to deep merge the head)
  finalConfig.head = {};
  Object.assign(finalConfig.head, defaults.head);
  Object.assign(finalConfig.head, config.head);
  return finalConfig;
}

// =============================================================================
// ID Set Functions
// =============================================================================

function isIdInConsideration(ctx: KeyValue, id: string): any {
  return !ctx.deadIds.has(id);
}

function idIsWithinNode(ctx: KeyValue, id: string, targetNode: Node): any {
  const idSet = ctx.idMap.get(targetNode) || EMPTY_SET;
  return idSet.has(id);
}

function removeIdsFromConsideration(ctx: KeyValue, node: Node): void {
  const idSet = ctx.idMap.get(node) || EMPTY_SET;
  for (const id of idSet) {
    ctx.deadIds.add(id);
  }
}

function getIdIntersectionCount(ctx: KeyValue, node1: Node, node2: Node): number {
  const sourceSet = ctx.idMap.get(node1) || EMPTY_SET;
  let matchCount = 0;
  for (const id of sourceSet) {
    // a potential match is an id in the source and potentialIdsSet, but
    // that has not already been merged into the DOM
    if (isIdInConsideration(ctx, id) && idIsWithinNode(ctx, id, node2)) {
      ++matchCount;
    }
  }
  return matchCount;
}

/*
 * A bottom up algorithm that finds all elements with ids inside of the node
 * argument and populates id sets for those nodes and all their parents, generating
 * a set of ids contained within all nodes for the entire hierarchy in the DOM
 *
 * @param node {Element}
 * @param {Map<Node, Set<String>>} idMap
 */
function populateIdMapForNode(node: Element, idMap: Map<Node, Set<string>>) {
  const nodeParent = node.parentElement;
  // find all elements with an id property
  const idElements = node.querySelectorAll('[id]');
  for (const elt of idElements) {
    let current: Element | null = elt;
    // walk up the parent hierarchy of that element, adding the id
    // of element to the parent's id set
    while (current !== nodeParent && current != null) {
      let idSet = idMap.get(current);
      // if the id set does not exist, create it and insert it in the  map
      if (idSet == null) {
        idSet = new Set();
        idMap.set(current, idSet);
      }
      idSet.add(elt.id);
      current = current.parentElement;
    }
  }
}

/*
 * This function computes a map of nodes to all ids contained within that node (inclusive of the
 * node).  This map can be used to ask if two nodes have intersecting sets of ids, which allows
 * for a looser definition of "matching" than tradition id matching, and allows child nodes
 * to contribute to a parent nodes matching.
 *
 * @param {Element} oldContent  the old content that will be morphed
 * @param {Element} newContent  the new content to morph to
 * @returns {Map<Node, Set<String>>} a map of nodes to id sets for the
 */
function createIdMap(oldContent: Element, newContent: Element): Map<any, any> {
  const idMap = new Map();
  populateIdMapForNode(oldContent, idMap);
  populateIdMapForNode(newContent, idMap);
  return idMap;
}

function createMorphContext(oldNode: Element, newContent: Element, config: KeyValue) {
  config = mergeDefaults(config);
  return {
    target: oldNode,
    newContent,
    config,
    morphStyle: config.morphStyle,
    ignoreActive: config.ignoreActive,
    ignoreActiveValue: config.ignoreActiveValue,
    idMap: createIdMap(oldNode, newContent),
    deadIds: new Set(),
    callbacks: config.callbacks,
    head: config.head,
  };
}

function isIdSetMatch(node1: Element, node2: Element, ctx: KeyValue) {
  if (node1 == null || node2 == null) {
    return false;
  }
  if (node1.nodeType === node2.nodeType && node1.tagName === node2.tagName) {
    if (node1.id !== '' && node1.id === node2.id) {
      return true;
    }
    return getIdIntersectionCount(ctx, node1, node2) > 0;
  }
  return false;
}

function isSoftMatch(node1: Element, node2: Element) {
  if (node1 == null || node2 == null) {
    return false;
  }
  return node1.nodeType === node2.nodeType && node1.tagName === node2.tagName;
}

function removeNode(tempNode: Node, ctx: KeyValue) {
  removeIdsFromConsideration(ctx, tempNode);
  if (ctx.callbacks.beforeNodeRemoved(tempNode) === false) return;

  (tempNode as Element).remove();
  ctx.callbacks.afterNodeRemoved(tempNode);
}

function removeNodesBetween(startInclusive: Node, endExclusive: Node, ctx: KeyValue) {
  let start: Node | null = startInclusive;
  while (start && start !== endExclusive) {
    const tempNode = start;
    start = start.nextSibling;
    removeNode(tempNode, ctx);
  }
  removeIdsFromConsideration(ctx, endExclusive);
  return endExclusive.nextSibling;
}

// =============================================================================
// Scans forward from the insertionPoint in the old parent looking for a potential id match
// for the newChild.  We stop if we find a potential id match for the new child OR
// if the number of potential id matches we are discarding is greater than the
// potential id matches for the new child
// =============================================================================
function findIdSetMatch(newContent: Element, oldParent: Element, newChild: Element, insertionPoint: Node, ctx: KeyValue) {

  // max id matches we are willing to discard in our search
  const newChildPotentialIdCount = getIdIntersectionCount(ctx, newChild, oldParent);

  let potentialMatch = null;

  // only search forward if there is a possibility of an id match
  if (newChildPotentialIdCount > 0) {
    potentialMatch = insertionPoint;
    // if there is a possibility of an id match, scan forward
    // keep track of the potential id match count we are discarding (the
    // newChildPotentialIdCount must be greater than this to make it likely
    // worth it)
    let otherMatchCount = 0;
    while (potentialMatch != null) {

      // If we have an id match, return the current potential match
      if (isIdSetMatch(newChild, potentialMatch as Element, ctx)) {
        return potentialMatch;
      }

      // computer the other potential matches of this new content
      otherMatchCount += getIdIntersectionCount(ctx, potentialMatch, newContent);
      if (otherMatchCount > newChildPotentialIdCount) {
        // if we have more potential id matches in _other_ content, we
        // do not have a good candidate for an id match, so return null
        return null;
      }

      // advanced to the next old content child
      potentialMatch = potentialMatch.nextSibling;
    }
  }
  return potentialMatch;
}

// =============================================================================
// Scans forward from the insertionPoint in the old parent looking for a potential soft match
// for the newChild.  We stop if we find a potential soft match for the new child OR
// if we find a potential id match in the old parents children OR if we find two
// potential soft matches for the next two pieces of new content
// =============================================================================
function findSoftMatch(newContent: Element, oldParent: Element, newChild: Node, insertionPoint: Node, ctx: KeyValue) {

  let potentialSoftMatch: Node | null = insertionPoint;
  let nextSibling = newChild.nextSibling;
  let siblingSoftMatchCount = 0;

  while (potentialSoftMatch != null) {

    if (getIdIntersectionCount(ctx, potentialSoftMatch, newContent) > 0) {
      // the current potential soft match has a potential id set match with the remaining new
      // content so bail out of looking
      return null;
    }

    // if we have a soft match with the current node, return it
    if (isSoftMatch(newChild as Element, potentialSoftMatch as Element)) {
      return potentialSoftMatch;
    }

    if (isSoftMatch(nextSibling as Element, potentialSoftMatch as Element)) {
      // the next new node has a soft match with this node, so
      // increment the count of future soft matches
      siblingSoftMatchCount++;
      nextSibling = nextSibling ? nextSibling.nextSibling : null;

      // If there are two future soft matches, bail to allow the siblings to soft match
      // so that we don't consume future soft matches for the sake of the current node
      if (siblingSoftMatchCount >= 2) {
        return null;
      }
    }

    // advanced to the next old content child
    potentialSoftMatch = potentialSoftMatch ? potentialSoftMatch.nextSibling : null;
  }

  return potentialSoftMatch;
}

function normalizeContent(newContent: Node[] | Node | null) {
  if (newContent == null) {
    // noinspection UnnecessaryLocalVariableJS
    const dummyParent = document.createElement('div');
    return dummyParent;
  }
  if (newContent instanceof Node) {
    if (newContent.generatedByIdiomorph) {
      // the template tag created by idiomorph parsing can serve as a dummy parent
      return newContent;
    }
    // a single node is added as a child to a dummy parent
    const dummyParent = document.createElement('div');
    dummyParent.append(newContent);
    return dummyParent;
  }
  // all nodes in the array or HTMLElement collection are consolidated under
  // a single dummy parent element
  const dummyParent = document.createElement('div');
  for (const elt of [...newContent]) {
    dummyParent.append(elt);
  }
  return dummyParent;
}

function insertSiblings(previousSibling: Node, morphedNode: Node, nextSibling: Node) {
  const stack = [];
  const added = [];
  let prev: Node | null = previousSibling;
  while (prev != null) {
    stack.push(prev);
    prev = prev.previousSibling;
  }
  while (stack.length > 0) {
    const node = stack.pop();
    added.push(node); // push added preceding siblings on in order and insert
    if (node) {
      morphedNode.parentElement?.insertBefore(node, morphedNode);
    }
  }
  added.push(morphedNode);
  let next: Node | null = nextSibling;
  while (next != null) {
    stack.push(next);
    added.push(next); // here we are going in order, so push on as we scan, rather than add
    next = next.nextSibling;
  }
  while (stack.length > 0) {
    const node = stack.pop();
    if (node) {
      morphedNode.parentElement?.insertBefore(node, morphedNode.nextSibling);
    }
  }
  return added;
}

function scoreElement(node1: Node, node2: Node, ctx: KeyValue) {
  if (isSoftMatch(node1 as Element, node2 as Element)) {
    return 0.5 + getIdIntersectionCount(ctx, node1, node2);
  }
  return 0;
}

function findBestNodeMatch(newContent: Node, oldNode: Node, ctx: KeyValue) {
  let currentElement;
  currentElement = newContent.firstChild;
  let bestElement = currentElement;
  let score = 0;
  while (currentElement) {
    const newScore = scoreElement(currentElement, oldNode, ctx);
    if (newScore > score) {
      bestElement = currentElement;
      score = newScore;
    }
    currentElement = currentElement.nextSibling;
  }
  return bestElement;
}

// =============================================================================
// Attribute Syncing Code
// =============================================================================

/*
 * @param attr {String} the attribute to be mutated
 * @param to {Element} the element that is going to be updated
 * @param updateType {("update"|"remove")}
 * @param ctx the merge context
 * @returns {boolean} true if the attribute should be ignored, false otherwise
 */
function ignoreAttribute(attr: string, to: Element, updateType: string, ctx: KeyValue) {
  if (attr === 'value' && ctx.ignoreActiveValue && to === document.activeElement) {
    return true;
  }
  return ctx.callbacks.beforeAttributeUpdated(attr, to, updateType) === false;
}

/*
 * @param possibleActiveElement
 * @param ctx
 * @returns {boolean}
 */
function ignoreValueOfActiveElement(possibleActiveElement: Node, ctx: KeyValue) {
  return ctx.ignoreActiveValue && possibleActiveElement === document.activeElement;
}

/*
 * syncs a given node with another node, copying over all attributes and
 * inner element state from the 'from' node to the 'to' node
 *
 * @param {Element} from the element to copy attributes & state from
 * @param {Element} to the element to copy attributes & state to
 * @param ctx the merge context
 */
function syncNodeFrom(from: Element, to: Element, ctx: KeyValue) {
  const type = from.nodeType;

  // if is an element type, sync the attributes from the
  // new node into the new node
  if (type === 1 /* element type */) {
    const fromAttributes = from.attributes;
    const toAttributes = to.attributes;
    for (const fromAttribute of fromAttributes) {
      if (ignoreAttribute(fromAttribute.name, to, 'update', ctx)) {
        continue;
      }
      if (to.getAttribute(fromAttribute.name) !== fromAttribute.value) {
        to.setAttribute(fromAttribute.name, fromAttribute.value);
        ctx.callbacks.afterAttributeUpdated(fromAttribute.name, to, 'update');
      }
    }
    // iterate backwards to avoid skipping over items when a delete occurs
    for (let i = toAttributes.length - 1; i >= 0; i--) {
      const toAttribute = toAttributes[i];
      if (ignoreAttribute(toAttribute.name, to, 'remove', ctx)) {
        continue;
      }
      if (!from.hasAttribute(toAttribute.name)) {
        to.removeAttribute(toAttribute.name);
        ctx.callbacks.afterAttributeUpdated(toAttribute.name, to, 'remove');
      }
    }
  }
  // sync text nodes
  if (type === 8 /* comment */ || type === 3 /* text */) {
    if (to.nodeValue !== from.nodeValue) {
      to.nodeValue = from.nodeValue;
    }
  }
}

/*
 * @param oldNode root node to merge content into
 * @param newContent new content to merge
 * @param ctx the merge context
 * @returns {Element} the element that ended up in the DOM
 */
function morphOldNodeTo(oldNode: Node, newContent: Node, ctx: KeyValue) {
  if (ctx.ignoreActive && oldNode === document.activeElement) {
    // don't morph focused element
  } else if (newContent == null) {
    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;

    (oldNode as Element).remove();
    ctx.callbacks.afterNodeRemoved(oldNode);
    return null;
  } else if (!isSoftMatch(oldNode as Element, newContent as Element)) {
    if (ctx.callbacks.beforeNodeRemoved(oldNode) === false) return oldNode;
    if (ctx.callbacks.beforeNodeAdded(newContent) === false) return oldNode;

    oldNode.parentElement?.replaceChild(newContent, oldNode);
    ctx.callbacks.afterNodeAdded(newContent);
    ctx.callbacks.afterNodeRemoved(oldNode);
    return newContent;
  } else {
    if (ctx.callbacks.beforeNodeMorphed(oldNode, newContent) === false) return oldNode;
    syncNodeFrom(newContent as Element, oldNode as Element, ctx);
    if (ctx.callbacks.beforeChildrenUpdated(oldNode, newContent) !== false && !ignoreValueOfActiveElement(oldNode, ctx)) {
      morphChildren(newContent, oldNode, ctx);
    }
    ctx.callbacks.afterNodeMorphed(oldNode, newContent);
    return oldNode;
  }
}

/*
 * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
 * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
 * by using id sets, we are able to better match up with content deeper in the DOM.
 *
 * Basic algorithm is, for each node in the new content:
 *
 * - if we have reached the end of the old parent, append the new content
 * - if the new content has an id set match with the current insertion point, morph
 * - search for an id set match
 * - if id set match found, morph
 * - otherwise search for a "soft" match
 * - if a soft match is found, morph
 * - otherwise, prepend the new node before the current insertion point
 *
 * The two search algorithms terminate if competing node matches appear to outweigh what can be achieved
 * with the current node.  See findIdSetMatch() and findSoftMatch() for details.
 *
 * @param {Element} newParent the parent element of the new content
 * @param {Element } oldParent the old content that we are merging the new content into
 * @param ctx the merge context
 */
function morphChildren(newParent: Node, oldParent: Node, ctx: KeyValue) {

  let nextNewChild = newParent.firstChild;
  let insertionPoint = oldParent.firstChild;
  let newChild;

  // run through all the new content
  while (nextNewChild) {

    newChild = nextNewChild;
    nextNewChild = newChild.nextSibling;

    // if we are at the end of the exiting parent's children, just append
    if (insertionPoint == null) {
      if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;

      oldParent.appendChild(newChild);
      ctx.callbacks.afterNodeAdded(newChild);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }

    // if the current node has an id set match then morph
    if (isIdSetMatch(newChild as Element, insertionPoint as Element, ctx)) {
      morphOldNodeTo(insertionPoint, newChild, ctx);
      insertionPoint = insertionPoint.nextSibling;
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }

    // otherwise search forward in the existing old children for an id set match
    const idSetMatch = findIdSetMatch(newParent as Element, oldParent as Element, newChild as Element, insertionPoint, ctx);

    // if we found a potential match, remove the nodes until that point and morph
    if (idSetMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, idSetMatch, ctx);
      morphOldNodeTo(idSetMatch, newChild, ctx);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }

    // no id set match found, so scan forward for a soft match for the current node
    const softMatch = findSoftMatch(newParent as Element, oldParent as Element, newChild, insertionPoint, ctx);

    // if we found a soft match for the current node, morph
    if (softMatch) {
      insertionPoint = removeNodesBetween(insertionPoint, softMatch, ctx);
      morphOldNodeTo(softMatch, newChild, ctx);
      removeIdsFromConsideration(ctx, newChild);
      continue;
    }

    // abandon all hope of morphing, just insert the new child before the insertion point
    // and move on
    if (ctx.callbacks.beforeNodeAdded(newChild) === false) return;

    oldParent.insertBefore(newChild, insertionPoint);
    ctx.callbacks.afterNodeAdded(newChild);
    removeIdsFromConsideration(ctx, newChild);
  }

  // remove any remaining old nodes that didn't match up with new content
  while (insertionPoint !== null) {

    const tempNode = insertionPoint;
    insertionPoint = insertionPoint.nextSibling;
    removeNode(tempNode, ctx);
  }
}

function morphNormalizedContent(oldNode: Element, normalizedNewContent: Element, ctx: KeyValue) {
  if (ctx.morphStyle === 'innerHTML') {

    // innerHTML, so we are only updating the children
    morphChildren(normalizedNewContent, oldNode, ctx);
    return oldNode.children;

  }
  if (ctx.morphStyle === 'outerHTML' || ctx.morphStyle == null) {
    // otherwise find the best element match in the new content, morph that, and merge its siblings
    // into either side of the best match
    const bestMatch = findBestNodeMatch(normalizedNewContent, oldNode, ctx);

    // stash the siblings that will need to be inserted on either side of the best match
    const previousSibling = bestMatch?.previousSibling;
    const nextSibling = bestMatch?.nextSibling;

    // morph it
    const morphedNode = morphOldNodeTo(oldNode, bestMatch as Node, ctx);

    if (bestMatch) {
      // if there was a best match, merge the siblings in too and return the
      // whole bunch
      return insertSiblings(previousSibling as Node, morphedNode as Node, nextSibling as Node);
    }
    // otherwise nothing was added to the DOM
    return [];
  }
  throw `Do not understand how to morph style ${ctx.morphStyle}`;
}

// =============================================================================
// Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
// =============================================================================
export function morph(node: Nodes, otherNode: Nodes, config: configType = {}): void {
  const normalizedContent = normalizeContent(otherNode.get(0)) as Element;
  const ctx = createMorphContext(node.get(0) as Element, normalizedContent, config);
  morphNormalizedContent(node.get(0) as Element, normalizedContent, ctx);
}
