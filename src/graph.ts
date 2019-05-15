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

  constructor() {
    this.nodes = [];
    this.edges = new Map();
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

    const [sort1, sort2] = [key1, key2].sort((a, b) => a.localeCompare(b));
    this.edges.set(`${sort1}-${sort2}`, weight);

    startNode.addNeighbour(endNode);
    endNode.addNeighbour(startNode);
  }

  public getEdge(key1: string, key2: string): number | undefined {
    const [sort1, sort2] = [key1, key2].sort((a, b) => a.localeCompare(b));
    return this.edges.get(`${sort1}-${sort2}`);
  }

  private findLowest(
    dist: { [key: string]: Result },
    visited: Set<string>,
  ): [string, Result] {
    return Object.entries(dist).reduce(
      (acc: [string, Result], val: [string, Result]): [string, Result] =>
        val[1].distance < acc[1].distance && !visited.has(val[0])
          ? val
          : acc,
      ['', { distance: Infinity, previous: null }],
    );
  }

  public dijkstra(source: string) {
    const results: { [key: string]: Result } = {};
    const visited: Set<string> = new Set();

    this.nodes.forEach(({ key }) => {
      results[key] = {
        distance: Infinity,
        previous: null,
      };
    });
    results[source] = {
      distance: 0,
      previous: null,
    };

    while (visited.size < this.nodes.length) {
      const [lowestKey] = this.findLowest(results, visited);
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

  public findPath(source: string, destination: string): string[] {
    if (!this.nodes.find(({ key }) => key === destination)) {
      throw new Error(`Could not find node ${destination}`);
    }
    const results = this.dijkstra(source);

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
