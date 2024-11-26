import { Graph } from '@antv/g6'

function createGraph ({ nodes, edges }) {

  const groupedNodesByCluster = nodes.reduce((acc, node) => {
    for (const cluster of node.data.clusters) {
      acc[cluster] ||= []
      acc[cluster].push(node.id)
    }
    return acc
  }, {})

  const createStyle = (baseColor) => ({
    fill: baseColor,
    stroke: baseColor,
    labelFill: '#fff',
    labelPadding: 2,
    labelBackgroundFill: baseColor,
    labelBackgroundRadius: 5,
  })

// Color palette for clusters
  const clusterColors = [
    '#1783FF',   // blue
    '#00C9C9',   // cyan
    '#F08F56',   // orange
    '#D580FF',   // purple
    '#4CAF50',   // green
    '#FF5722',   // deep orange
    '#2196F3',   // light blue
    '#9C27B0',   // purple
    '#FF9800',   // amber
  ]

  const hullPlugins = Object.entries(groupedNodesByCluster).
    map(([cluster, members], index) => ({
      key: `hull-${cluster}`,
      type: 'hull',
      members,
      labelText: `${cluster}`,
      ...createStyle(clusterColors[index % clusterColors.length]),
    }))

  return new Graph({
    container: 'container',
    data: { nodes, edges },
    behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
    node: {
      palette: { field: 'cluster' },
    },
    layout: {
      type: 'force',
      preventOverlap: true,
      linkDistance: (d) => {
        const firstNode = nodes[0]?.id
        if (d.source === firstNode || d.target === firstNode) {
          return 200
        }
        return 80
      },
    },
    plugins: hullPlugins,
    autoFit: 'center',
    transforms: ['process-parallel-edges'],

  })
}

export { createGraph }
