import { fetchTrig } from './src/io.js'
import { toGraph } from './src/model.js'
import { createGraph } from './src/view.js'

async function loadGraph (url) {
  console.log('Loading graph from:', url)
  const { dataset, prefixes } = await fetchTrig(url)
  const { nodes, edges } = toGraph({ dataset, prefixes })
  const graph = createGraph({ nodes, edges })
  document.getElementById('container').innerHTML = '' // Clear previous graph
  graph.render()
}

const urlInput = document.getElementById('urlInput')
const renderButton = document.getElementById('renderButton')

renderButton.addEventListener('click', () => {
  const url = urlInput.value.trim()
  loadGraph(url)
})
