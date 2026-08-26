export function addUndirectedEdge(adjacency, from, to, relation, detail = '', support = null) {
  if (!from || !to || from === to) return
  const forward = adjacency.get(from) || []
  const backward = adjacency.get(to) || []
  forward.push({ from, to, relation, detail, support })
  backward.push({ from: to, to: from, relation, detail, support })
  adjacency.set(from, forward)
  adjacency.set(to, backward)
}

export function shortestGraphPath(adjacency, startId, targetId, maxDepth = 6) {
  if (!startId || !targetId) return null
  if (startId === targetId) return { nodes: [startId], edges: [] }

  const queue = [{ node: startId, nodes: [startId], edges: [] }]
  const bestDepth = new Map([[startId, 0]])

  while (queue.length) {
    const current = queue.shift()
    if (current.edges.length >= maxDepth) continue

    const neighbors = adjacency.get(current.node) || []
    for (const edge of neighbors) {
      const nextDepth = current.edges.length + 1
      const previousDepth = bestDepth.get(edge.to)
      if (previousDepth !== undefined && previousDepth <= nextDepth) continue

      const next = {
        node: edge.to,
        nodes: [...current.nodes, edge.to],
        edges: [...current.edges, edge],
      }
      if (edge.to === targetId) return { nodes: next.nodes, edges: next.edges }
      bestDepth.set(edge.to, nextDepth)
      queue.push(next)
    }
  }

  return null
}
