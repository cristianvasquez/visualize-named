function shrink (iri, prefixes) {

  if (iri === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
    return 'type'
  }

  for (const [prefix, namespace] of Object.entries(prefixes)) {
    if (iri.startsWith(namespace)) {
      return `${prefix}:${iri.slice(namespace.length)}`
    }
  }
  return iri
}

function createModel ({ dataset, prefixes }) {
  const nodeMap = new Map()
  const nodes = []
  const edges = []
  const edgeSet = new Set() // Set to track unique edges

  function getOrCreateNode (id, graphId, nodeOpts) {
    if (!nodeMap.has(id)) {
      const node = {
        id,
        data: {
          clusters: [graphId],
        },
        style: {
          size: 30,
          labelText: id,
        },
        ...nodeOpts,
      }
      nodeMap.set(id, node)
      nodes.push(node)
    } else {
      const existingNode = nodeMap.get(id)
      if (!existingNode.data.clusters.includes(graphId)) {
        existingNode.data.clusters.push(graphId)
      }
    }
    return nodeMap.get(id)
  }

  for (const quad of dataset) {
    const subjectId = shrink(quad.subject.value, prefixes)
    const predicateId = shrink(quad.predicate.value, prefixes)
    const objectId = shrink(quad.object.value, prefixes)
    const graphId = shrink(quad.graph.value, prefixes) || 'default'

    const subjectNode = getOrCreateNode(subjectId, graphId, {})
    const objectNode = getOrCreateNode(objectId, graphId,
      quad.object.termType === 'Literal'
        ? { type: 'rect' }
        : {})

    if (subjectNode.id !== objectNode.id) {
      const edgeKey = `${subjectNode.id}-${predicateId}-${objectNode.id}`
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey)
        edges.push({
          id: edgeKey,
          source: subjectNode.id,
          predicate: predicateId,
          target: objectNode.id,
          style: {
            labelText: predicateId,
            labelBackground: true,
            endArrow: true,
          },

        })
      }
    }
  }

  return {
    nodes,
    edges,
  }
}

export { createModel }
