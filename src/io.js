import { Parser } from 'n3'
import rdf from 'rdf-ext'

async function fetchTrig (url) {

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.text()

  return await new Promise((resolve, reject) => {
    const parser = new Parser({ format: 'application/trig' })
    const dataset = rdf.dataset()

    parser.parse(data, (error, quad, prefixes) => {
      if (error) {
        reject(error)
        return
      }

      if (!quad) {
        resolve({ dataset, prefixes })
        return
      }

      dataset.add(quad)
    })
  })

}

export { fetchTrig }
