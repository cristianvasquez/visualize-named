Displays a [TriG](https://en.wikipedia.org/wiki/TriG_(syntax)) file.

A TriG file is an extension of Turtle syntax in RDF (Resource Description Framework) that enables specifying named
graphs. Named graphs provide a way to group statements into sets, which can represent contextual or provenance
information in an RDF dataset.

Here’s an example of a TriG file:

```turtle
 @prefix ex:
<http://example.org/> .

ex:aliceGraph {
    ex:Alice ex:name "Alice" ;
    ex:knows ex:Bob .
}

ex:bobGraph {
    ex:Bob ex:name "Bob" .
}


```

Below is a diagram of the relationships in this TriG file:

![](./doc/graph.png)
