d3.sankey = function () {
    var sankey = {***REMOVED***,
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

    sankey.nodeWidth = function (_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
***REMOVED***;

    sankey.nodePadding = function (_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
***REMOVED***;

    sankey.nodes = function (_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
***REMOVED***;

    sankey.links = function (_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
***REMOVED***;

    sankey.size = function (_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
***REMOVED***;

    sankey.layout = function (iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
***REMOVED***;

    sankey.relayout = function () {
        computeLinkDepths();
        return sankey;
***REMOVED***;

    sankey.link = function () {
        var curvature = .5;

        function link(d) {
            var x0 = d.source.x + d.source.dx,
                x1 = d.target.x,
                xi = d3.interpolateNumber(x0, x1),
                x2 = xi(curvature),
                x3 = xi(1 - curvature),
                y0 = d.source.y + d.sy + d.dy / 2,
                y1 = d.target.y + d.ty + d.dy / 2;
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;
    ***REMOVED***

        link.curvature = function (_) {
            if (!arguments.length) return curvature;
            curvature = +_;
            return link;
    ***REMOVED***;

        return link;
***REMOVED***;

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
        nodes.forEach(function (node) {
            node.sourceLinks = [];
            node.targetLinks = [];
    ***REMOVED***);
        links.forEach(function (link) {
            var source = link.source,
                target = link.target;
            if (typeof source === "number") source = link.source = nodes[link.source];
            if (typeof target === "number") target = link.target = nodes[link.target];
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
    ***REMOVED***);
***REMOVED***

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
        nodes.forEach(function (node) {
            node.value = Math.max(
                d3.sum(node.sourceLinks, value),
                d3.sum(node.targetLinks, value)
            );
    ***REMOVED***);
***REMOVED***

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
        var remainingNodes = nodes,
            nextNodes,
            x = 0;

        while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
                node.x = x;
                node.dx = nodeWidth;
                node.sourceLinks.forEach(function (link) {
                    nextNodes.push(link.target);
            ***REMOVED***);
        ***REMOVED***);
            remainingNodes = nextNodes;
            ++x;
    ***REMOVED***

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
***REMOVED***

    function moveSourcesRight() {
        nodes.forEach(function (node) {
            if (!node.targetLinks.length) {
                node.x = d3.min(node.sourceLinks, function (d) { return d.target.x; ***REMOVED***) - 1;
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

    function moveSinksRight(x) {
        nodes.forEach(function (node) {
            if (!node.sourceLinks.length) {
                node.x = x - 1;
        ***REMOVED***
    ***REMOVED***);
***REMOVED***

    function scaleNodeBreadths(kx) {
        nodes.forEach(function (node) {
            node.x *= kx;
    ***REMOVED***);
***REMOVED***

    function computeNodeDepths(iterations) {
        var nodesByBreadth = d3.nest()
            .key(function (d) { return d.x; ***REMOVED***)
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function (d) { return d.values; ***REMOVED***);

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
            relaxRightToLeft(alpha *= .99);
            resolveCollisions();
            relaxLeftToRight(alpha);
            resolveCollisions();
    ***REMOVED***

        function initializeNodeDepth() {
            var ky = d3.min(nodesByBreadth, function (nodes) {
                return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        ***REMOVED***);

            nodesByBreadth.forEach(function (nodes) {
                nodes.forEach(function (node, i) {
                    node.y = i;
                    node.dy = node.value * ky;
            ***REMOVED***);
        ***REMOVED***);

            links.forEach(function (link) {
                link.dy = link.value * ky;
        ***REMOVED***);
    ***REMOVED***

        function relaxLeftToRight(alpha) {
            nodesByBreadth.forEach(function (nodes, breadth) {
                nodes.forEach(function (node) {
                    if (node.targetLinks.length) {
                        var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                        node.y += (y - center(node)) * alpha;
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***);

            function weightedSource(link) {
                return center(link.source) * link.value;
        ***REMOVED***
    ***REMOVED***

        function relaxRightToLeft(alpha) {
            nodesByBreadth.slice().reverse().forEach(function (nodes) {
                nodes.forEach(function (node) {
                    if (node.sourceLinks.length) {
                        var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                        node.y += (y - center(node)) * alpha;
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***);

            function weightedTarget(link) {
                return center(link.target) * link.value;
        ***REMOVED***
    ***REMOVED***

        function resolveCollisions() {
            nodesByBreadth.forEach(function (nodes) {
                var node,
                    dy,
                    y0 = 0,
                    n = nodes.length,
                    i;

                // Push any overlapping nodes down.
                nodes.sort(ascendingDepth);
                for (i = 0; i < n; ++i) {
                    node = nodes[i];
                    dy = y0 - node.y;
                    if (dy > 0) node.y += dy;
                    y0 = node.y + node.dy + nodePadding;
            ***REMOVED***

                // If the bottommost node goes outside the bounds, push it back up.
                dy = y0 - nodePadding - size[1];
                if (dy > 0) {
                    y0 = node.y -= dy;

                    // Push any overlapping nodes back up.
                    for (i = n - 2; i >= 0; --i) {
                        node = nodes[i];
                        dy = node.y + node.dy + nodePadding - y0;
                        if (dy > 0) node.y -= dy;
                        y0 = node.y;
                ***REMOVED***
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***

        function ascendingDepth(a, b) {
            return a.y - b.y;
    ***REMOVED***
***REMOVED***

    function computeLinkDepths() {
        nodes.forEach(function (node) {
            node.sourceLinks.sort(ascendingTargetDepth);
            node.targetLinks.sort(ascendingSourceDepth);
    ***REMOVED***);
        nodes.forEach(function (node) {
            var sy = 0, ty = 0;
            node.sourceLinks.forEach(function (link) {
                link.sy = sy;
                sy += link.dy;
        ***REMOVED***);
            node.targetLinks.forEach(function (link) {
                link.ty = ty;
                ty += link.dy;
        ***REMOVED***);
    ***REMOVED***);

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
    ***REMOVED***

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
    ***REMOVED***
***REMOVED***

    function center(node) {
        return node.y + node.dy / 2;
***REMOVED***

    function value(link) {
        return link.value;
***REMOVED***

    return sankey;
***REMOVED***;