interface Result {
  distance: number;
  previous: string | null;
}

class Node {
  public key: string;
  public neighbours: Node[];

  constructor(key: string) {
    this.key = key;
    this.neighbours = [];
  }

  public addNeighbour(node: Node) {
    this.neighbours.push(node);
  }
}

export class Graph {
  private nodes: Node[];
  private edges: Map<string, number>;
  private directed: boolean;

  constructor({ directed = false }: { directed?: boolean } = {}) {
    this.nodes = [];
    this.edges = new Map();
    this.directed = directed;
  }

  public addNode(key: string): void {
    this.nodes.push(new Node(key));
  }

  public getNode(key: string): Node {
    const node = this.nodes.find(node => node.key === key);
    if (!node) {
      throw new Error(`Could not find node ${key}`);
    }
    return node;
  }

  public addEdge(key1: string, key2: string, weight: number): void {
    const startNode = this.getNode(key1);
    const endNode = this.getNode(key2);

    if (this.directed) {
      this.edges.set(`${key1}-${key2}`, weight);

      startNode.addNeighbour(endNode);
    } else {
      const [sort1, sort2] = [key1, key2].sort((a, b) => a.localeCompare(b));
      this.edges.set(`${sort1}-${sort2}`, weight);

      startNode.addNeighbour(endNode);
      endNode.addNeighbour(startNode);
    }
  }

  public getEdge(key1: string, key2: string): number | undefined {
    if (this.directed) return this.edges.get(`${key1}-${key2}`);

    const [sort1, sort2] = [key1, key2].sort((a, b) => a.localeCompare(b));
    return this.edges.get(`${sort1}-${sort2}`);
  }

  private findLowest(
    dist: { [key: string]: Result },
    visited: Set<string>,
  ): [string, Result] {
    return Object.entries(dist).reduce(
      (acc: [string, Result], val: [string, Result]): [string, Result] =>
        val[1].distance < acc[1].distance && !visited.has(val[0]) ? val : acc,
      ['', { distance: Infinity, previous: null }],
    );
  }

  public dijkstra(source: string) {
    const visited: Set<string> = new Set();

    const results: { [key: string]: Result } = this.nodes.reduce(
      (acc, { key }): { [key: string]: Result } => ({
        ...acc,
        [key]: {
          distance: key === source ? 0 : Infinity,
          previous: null,
        },
      }),
      {},
    );

    while (visited.size < this.nodes.length) {
      const [lowestKey, { distance }] = this.findLowest(results, visited);
      if (distance === Infinity) return results;
      visited.add(lowestKey);

      const node = this.getNode(lowestKey);
      node.neighbours.forEach(neighbour => {
        if (visited.has(neighbour.key)) return;

        const edgeWeight = this.getEdge(node.key, neighbour.key);
        const alt = results[node.key].distance + (edgeWeight || Infinity);

        if (alt < results[neighbour.key].distance) {
          results[neighbour.key] = {
            distance: alt,
            previous: node.key,
          };
        }
      });
    }

    return results;
  }

  public getPath(source: string, destination: string): string[] {
    this.getNode(source)
    this.getNode(destination)
    const results = this.dijkstra(source);
    if (results[destination].distance === Infinity) return [];

    function buildRoute(key: string, route: string[] = []): string[] {
      const { previous } = results[key];
      return previous === null
        ? [key, ...route]
        : buildRoute(previous, [key, ...route]);
    }

    return buildRoute(destination);
  }

  public bfs(startKey: string, fn: Function) {
    const visited: Set<string> = new Set();
    const q: Node[] = [];
    q.unshift(this.getNode(startKey));

    while (q.length > 0) {
      const currentNode = q.pop();

      if (!visited.has(currentNode!.key)) {
        fn(currentNode);
        visited.add(currentNode!.key);
      }

      currentNode!.neighbours.forEach(node => {
        if (!visited.has(node.key)) {
          q.unshift(node);
        }
      });
    }
  }

  public dfs(startKey: string, fn: Function) {
    const visited: Set<string> = new Set();

    function explore(node: Node) {
      if (visited.has(node.key)) return;

      fn(node);
      visited.add(node.key);

      node.neighbours.forEach(node => {
        explore(node);
      });
    }

    explore(this.getNode(startKey));
  }
}
