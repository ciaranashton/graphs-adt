# Graphs - Abstract Data Type

This library contains a collection of Graph abstract data types, each with a set of algorithms. 

## Graphs
A graph is a structure amounting to a set of objects in which some pairs of the objects are in some sense "related" ([Wikipedia](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)), 2019).

### Options
Options when creating a graph

 - directed - _default: false_

```js
const g = new Graph({
	directed: true
})
```


### Underdevelopment:

 - Graph
	 - A*
 - Tree
	 - Binary
	 - Red-black

## Implementing a Graph

Install the package

```
$ npm install -S graphs-adt
```

Create a graph and add some nodes and edges. In this example we will add locations in England and the distance between them to represent the weight.

```js
import { Graph } from 'graphs-adt';

// create a new instance of an undirected graph
const g = new Graph();

// adding nodes (vertices)
g.addNode('London');
g.addNode('Bristol');
g.addNode('Bath');
g.addNode('Bournemouth');

// adding edges (links)
g.addEdge('London', 'Bath', 114);
g.addEdge('Bath', 'Bristol', 23);
g.addEdge('Bristol', 'Bournemouth', 73);
g.addEdge('Bournemouth', 'London', 101);
g.addEdge('Bournemouth', 'Bath', 62);
```

Now we have a simple graph that represents the distance between each City. A visualisation of this graph may look like the following.

<img src="https://s3.eu-west-2.amazonaws.com/ciaranashton/graph-example01.png" width="500">

_Note the length of the edges do NOT represent the weighting, but the numbers do. Further, there are no arrow heads on the diagram as the graph is undirected so the edges are bidirectional._

### Shortest Path
If we now want to shortest distance from London to Bristol we can use the `getPath` method. Currently, by default this uses Dijkstra's algorithm.

```js
g.getPath('London', 'Bristol'); 

// [ 'London', 'Bath', 'Bristol' ]
```

It is also possible just to run the **Dijkstra** algorithm on a node and get the distances to each node it can reach.

```js
g.dijkstra('London')

// { London: { distance: 0, previous: null },
//   Bristol: { distance: 137, previous: 'Bath' },
//   Bath: { distance: 114, previous: 'London' },
//   Bournemouth: { distance: 101, previous: 'London' } }
```

### Traversing / Searching
All graphs support breadth first and depth first searching methods. Just call the method with a key of the node you wish to start at and a callback function.

The following will log out each node to the console starting from the London Node.

```js
// depth first search
g.dfs('London', node => {
  console.log('Node:', node)
});

// breadth first search
g.bfs('London', node => {
  console.log('Node:', node)
});
```