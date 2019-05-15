import { Graph } from './graph';

describe('Graph - datastructure', () => {
  test('Add graph nodes and edge', () => {
    const g = new Graph();
    g.addNode('a');

    expect(g.getNode('a').key).toEqual('a');
    expect(g.getNode('a').neighbours).toEqual([]);

    g.addNode('b');
    g.addEdge('a', 'b', 5);

    expect(g.getEdge('a', 'b')).toEqual(5);
    expect(g.getNode('a').neighbours[0].key).toEqual('b');
  });
});

describe('Graph - path finding', () => {
  const g = new Graph();

  const nodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const routes = [
    [['a', 'c'], 2],
    [['c', 'd'], 1],
    [['c', 'f'], 4],
    [['b', 'd'], 4],
    [['b', 'e'], 7],
    [['d', 'f'], 1],
    [['d', 'g'], 1],
    [['f', 'g'], 3],
    [['g', 'h'], 4],
    [['e', 'h'], 10],
  ];

  nodes.forEach(node => g.addNode(node));
  routes.forEach(([routes, distance]: any[]) => {
    const [start, destination] = routes;
    g.addEdge(start, destination, distance);
  });

  test('dijkstra - a', () => {
    const expectedResults = {
      a: { distance: 0, previous: null },
      b: { distance: 7, previous: 'd' },
      c: { distance: 2, previous: 'a' },
      d: { distance: 3, previous: 'c' },
      e: { distance: 14, previous: 'b' },
      f: { distance: 4, previous: 'd' },
      g: { distance: 4, previous: 'd' },
      h: { distance: 8, previous: 'g' },
    };

    expect(g.dijkstra('a')).toEqual(expectedResults);
  });

  test('dijkstra - e', () => {
    const expectedResults = {
      a: { distance: 14, previous: 'c' },
      b: { distance: 7, previous: 'e' },
      c: { distance: 12, previous: 'd' },
      d: { distance: 11, previous: 'b' },
      e: { distance: 0, previous: null },
      f: { distance: 12, previous: 'd' },
      g: { distance: 12, previous: 'd' },
      h: { distance: 10, previous: 'e' },
    };

    expect(g.dijkstra('e')).toEqual(expectedResults);
  });

  test('A -> F', () => {
    const expected = ['a', 'c', 'd', 'f'];
    const result = g.findPath('a', 'f');

    expect(result).toEqual(expected);
  });

  test('A -> H', () => {
    const expected = ['a', 'c', 'd', 'g', 'h'];
    const result = g.findPath('a', 'h');

    expect(result).toEqual(expected);
  });

  test('B -> H', () => {
    const expected = ['b', 'd', 'g', 'h'];
    const result = g.findPath('b', 'h');

    expect(result).toEqual(expected);
  });

  test('H -> D', () => {
    const expected = ['h', 'g', 'd'];
    const result = g.findPath('h', 'd');

    expect(result).toEqual(expected);
  });

  test('unknown source error', () => {
    expect(() => g.findPath('z', 'd')).toThrowError(
      'Could not find node z',
    );
  });

  test('unknown destination error', () => {
    expect(() => g.findPath('a', 'z')).toThrowError(
      'Could not find node z',
    );
  });
});

describe('Graph - traversing and searching', () => {
  const graph = new Graph();
  const nodes = ['a', 'b', 'c', 'd', 'e', 'f'];
  const edges = [
    ['a', 'b'],
    ['a', 'e'],
    ['a', 'f'],
    ['b', 'd'],
    ['b', 'e'],
    ['c', 'b'],
    ['d', 'c'],
    ['d', 'e'],
  ];

  nodes.map(node => graph.addNode(node));
  edges.map(nodes => graph.addEdge(nodes[0], nodes[1], 0));

  test('bredth first search', () => {
    const order = ['a', 'b', 'e', 'f', 'd', 'c'];
    let i = 0;

    graph.bfs('a', (node: any) => {
      expect(node.key).toEqual(order[i]);
      i++;
    });
  });

  test('depth first search', () => {
    const order = ['a', 'b', 'd', 'c', 'e', 'f'];
    let i = 0;

    graph.dfs('a', (node: any) => {
      expect(node.key).toEqual(order[i]);
      i++;
    });
  });
});
