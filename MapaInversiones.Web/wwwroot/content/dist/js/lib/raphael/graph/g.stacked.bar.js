/*!
 * g.Raphael 0.51 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009-2012 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function () {
    var mmin = Math.min,
        mmax = Math.max;

    function finger(x, y, width, height, dir, ending, isPath, paper) {
        var path,
            ends = { round: 'round', sharp: 'sharp', soft: 'soft', square: 'square' };

        // dir 0 for horizontal and 1 for vertical
        if ((dir && !height) || (!dir && !width)) {
            return isPath ? "" : paper.path();
        }

        ending = ends[ending] || "square";
        height = Math.round(height);
        width = Math.round(width);
        x = Math.round(x);
        y = Math.round(y);

        switch (ending) {
            case "round":
                if (!dir) {
                    var r = ~~(height / 2);

                    if (width < r) {
                        r = width;
                        path = [
                            "M", x + .5, y + .5 - ~~(height / 2),
                            "l", 0, 0,
                            "a", r, ~~(height / 2), 0, 0, 1, 0, height,
                            "l", 0, 0,
                            "z"
                        ];
                    } else {
                        path = [
                            "M", x + .5, y + .5 - r,
                            "l", width - r, 0,
                            "a", r, r, 0, 1, 1, 0, height,
                            "l", r - width, 0,
                            "z"
                        ];
                    }
                } else {
                    r = ~~(width / 2);

                    if (height < r) {
                        r = height;
                        path = [
                            "M", x - ~~(width / 2), y,
                            "l", 0, 0,
                            "a", ~~(width / 2), r, 0, 0, 1, width, 0,
                            "l", 0, 0,
                            "z"
                        ];
                    } else {
                        path = [
                            "M", x - r, y,
                            "l", 0, r - height,
                            "a", r, r, 0, 1, 1, width, 0,
                            "l", 0, height - r,
                            "z"
                        ];
                    }
                }
                break;
            case "sharp":
                if (!dir) {
                    var half = ~~(height / 2);

                    path = [
                        "M", x, y + half,
                        "l", 0, -height, mmax(width - half, 0), 0, mmin(half, width), half, -mmin(half, width), half + (half * 2 < height),
                        "z"
                    ];
                } else {
                    half = ~~(width / 2);
                    path = [
                        "M", x + half, y,
                        "l", -width, 0, 0, -mmax(height - half, 0), half, -mmin(half, height), half, mmin(half, height), half,
                        "z"
                    ];
                }
                break;
            case "square":
                if (!dir) {
                    path = [
                        "M", x, y + ~~(height / 2),
                        "l", 0, -height, width, 0, 0, height,
                        "z"
                    ];
                } else {
                    path = [
                        "M", x + ~~(width / 2), y,
                        "l", 1 - width, 0, 0, -height, width - 1, 0,
                        "z"
                    ];
                }
                break;
            case "soft":
                if (!dir) {
                    r = mmin(width, Math.round(height / 5));
                    path = [
                        "M", x + .5, y + .5 - ~~(height / 2),
                        "l", width - r, 0,
                        "a", r, r, 0, 0, 1, r, r,
                        "l", 0, height - r * 2,
                        "a", r, r, 0, 0, 1, -r, r,
                        "l", r - width, 0,
                        "z"
                    ];
                } else {
                    r = mmin(Math.round(width / 5), height);
                    path = [
                        "M", x - ~~(width / 2), y,
                        "l", 0, r - height,
                        "a", r, r, 0, 0, 1, r, -r,
                        "l", width - 2 * r, 0,
                        "a", r, r, 0, 0, 1, r, r,
                        "l", 0, height - r,
                        "z"
                    ];
                }
        }

        if (isPath) {
            return path.join(",");
        } else {
            return paper.path(path);
        }
    }

/*\
 * Paper.Stackedvbarchart
 [ method ]
 **
 * Creates a vertical bar chart
 **
 > Parameters
 **
 - x (number) x coordinate of the chart
 - y (number) y coordinate of the chart
 - width (number) width of the chart (respected by all elements in the set)
 - height (number) height of the chart (respected by all elements in the set)
 - values (array) values
 - opts (object) options for the chart
 o {
 o type (string) type of endings of the bar. Default: 'square'. Other options are: 'round', 'sharp', 'soft'.
 o gutter (number)(string) default '20%' (WHAT DOES IT DO?)
 o vgutter (number)
 o colors (array) colors be used repeatedly to plot the bars. If multicolumn bar is used each sequence of bars with use a different color.
 o stacked (boolean) whether or not to tread values as in a stacked bar chart
 o to
 o stretch (boolean)
 o }
 **
 = (object) path element of the popup
 > Usage
 | r.Stackedvbarchart(0, 0, 620, 260, [76, 70, 67, 71, 69], {})
 \*/
 
    function StackedVBarchart(paper, x, y, width, height, values, opts) {
        opts = opts || {};

        var chartinst = this,
            type = opts.type || "square",
            gutter = parseFloat(opts.gutter || 10),
            chart = paper.set(),
            bars = paper.set(),
            covers = paper.set(),
            covers2 = paper.set(),
            total = 0,
            stacktotal = [],
            multi = 0,
            colors = opts.colors || chartinst.colors,
            len = values.length,
            gap = 0,
            linesCount = 10,
            ind = 0;

        for(ind = values.length; ind--;){
        	total = Math.max(total, values[ind].rawValue)
        }


        // if (Raphael.is(values[0], "array")) {
        //     total = [];
        //     multi = len;
        //     len = 0;

        //     for (var i = values.length; i--;) {
        //         bars.push(paper.set());
        //         total.push(Math.max.apply(Math, values[i]));
        //         len = Math.max(len, values[i].length);
        //     }

        //     if (opts.stacked) {
        //         for (var i = len; i--;) {
        //             var tot = 0;

        //             for (var j = values.length; j--;) {
        //                 tot +=+ values[j][i] || 0;
        //             }

        //             stacktotal.push(tot);
        //         }
        //     }

        //     for (var i = values.length; i--;) {
        //         if (values[i].length < len) {
        //             for (var j = len; j--;) {
        //                 values[i].push(0);
        //             }
        //         }
        //     }

        //     total = Math.max.apply(Math, opts.stacked ? stacktotal : total);
        // }
        
        total = (opts.to) || total;

        var barwidth = width / (len * (100 + gutter) ) * 100,
            barhgutter = barwidth * gutter / 100,
            barvgutter = opts.vgutter == null ? 20 : opts.vgutter,
            stack = [],
            X = x + barhgutter,
            Y = (height - 2 * barvgutter) / total,
            dectotal = Math.pow(10, total.toString().length)
        
        gap = dectotal/linesCount
        while(dectotal-gap > total){
        	dectotal -= gap
        }
        gap = dectotal/linesCount
		

        // Numeros...
        function scalesFor(max, min, numScales){
            var s, len, hidnDigs, i,
                units, scales = []

            len = max.toString().length
            hidnDigs = len - (len % 3 || 3)
            
            for(i=0; i<=numScales; i++){
                s = min + ((max - min)/
                    numScales * i)
                s = Math.round( s / Math.pow(10, hidnDigs) )
                scales.push(s)
            }

            if(hidnDigs == 3){
                units = 'Miles'
            }else if(hidnDigs == 6){
                units = 'Millones'
            }else if(hidnDigs == 9){
                units = 'Miles de Millones'
            }else if(hidnDigs == 12){
                units = 'Billones'
            }else if(hidnDigs == 15){
                units = 'Miles de Billones'
            }else if(hidnDigs == 18){
                units = 'Millones de Billones'
            }else if(hidnDigs == 18){
                units = 'Trillones'
            }

            return {units: units, scales: scales}
        }

        if (!opts.stretch) {
            barhgutter = Math.round(barhgutter);
            barwidth = Math.floor(barwidth);
        }

        !opts.stacked && (barwidth /= multi || 1);
		
        var vpos, units = scalesFor(total, 0, linesCount)

        for(var i=0; i<=linesCount; i++){
        	vpos = Math.round(barvgutter + i * ((height - 2 * barvgutter)/linesCount))
	        paper.path('M'+ x + ' ' + (vpos+y) + 'L' + (width + x) + ' ' + (vpos+y) + 'L')
	        	.attr({
	        		stroke: '#ddd',
	        		opacity: 0.8,
	        		'stroke-width': '1'
	        	})
            paper.text(x - 8, vpos+y, units.scales[linesCount-i] )
                .attr({
                    'text-anchor': 'end',
                    'fill': '#777' 
                })
        }
        
        // paper.text(x + width, height + 5, '( Cifras en ' + units.units + ' de Pesos Colombianos )' )
        //     .attr({
        //         'text-anchor': 'end',
        //         'fill': '#aaa' 
        //     })

        for (i = 0; i < len; i++) {
            stack = [];

            for (var j = 0; j < (multi || 1); j++) {
                var h = Math.round( values[i].rawValue * Y ),
                    top = y + height - barvgutter - h,
                    bar = finger(Math.round(X + barwidth / 2), top + h, barwidth, h, true, type, null, paper).attr({ stroke: "none", fill: colors[multi ? j : i] });

                if (multi) {
                    bars[j].push(bar);
                } else {
                    bars.push(bar);
                }

                bar.y = top;
                bar.x = Math.round(X + barwidth / 2);
                bar.w = barwidth;
                bar.h = h;
                bar.value = values[i];
                bar.value.order = i;

                if (!opts.stacked) {
                    X += barwidth;
                } else {
                    stack.push(bar);
                }
            }

            if (opts.stacked) {
                var cvr;

                covers2.push(cvr = paper.rect(stack[0].x - stack[0].w / 2, y, barwidth, height).attr(chartinst.shim));
                cvr.bars = paper.set();

                var size = 0;

                for (var s = stack.length; s--;) {
                    stack[s].toFront();
                }

                for (var s = 0, ss = stack.length; s < ss; s++) {
                    var bar = stack[s],
                        cover,
                        h = (size + bar.value) * Y,
                        path = finger(bar.x, y + height - barvgutter - !!size * .5, barwidth, h, true, type, 1, paper);

                    cvr.bars.push(bar);
                    size && bar.attr({path: path});
                    bar.h = h;
                    bar.y = y + height - barvgutter - !!size * .5 - h;
                    covers.push(cover = paper.rect(bar.x - bar.w / 2, bar.y, barwidth, bar.value * Y).attr(chartinst.shim));
                    cover.bar = bar;
                    cover.value = bar.value;
                    size += bar.value;
                }

                X += barwidth;
            }

            X += barhgutter;
        }

        covers2.toFront();
        X = x + barhgutter;

        if (!opts.stacked) {
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < (multi || 1); j++) {
                    var cover;

                    covers.push(cover = paper.rect(Math.round(X), y + barvgutter, barwidth, height - barvgutter).attr(chartinst.shim));
                    cover.bar = multi ? bars[j][i] : bars[i];
                    cover.value = cover.bar.value;
                    X += barwidth;
                }

                X += barhgutter;
            }
        }

        chart.label = function (labels, isBottom) {
            labels = labels || [];
            this.labels = paper.set();

            var L, l = -Infinity;

            if (opts.stacked) {
                for (var i = 0; i < len; i++) {
                    var tot = 0;

                    for (var j = 0; j < (multi || 1); j++) {
                        tot += values[i].rawValue;

                        if (j == multi - 1) {
                            var label = paper.labelise(labels[i], tot, total);

                            L = paper.text(bars[i * (multi || 1) + j].x, y + height - barvgutter / 2, label).attr(txtattr).insertBefore(covers[i * (multi || 1) + j]);

                            var bb = L.getBBox();

                            if (bb.x - 7 < l) {
                                L.remove();
                            } else {
                                this.labels.push(L);
                                l = bb.x + bb.width;
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < (multi || 1); j++) {
                        var label = paper.labelise(multi ? labels[j] && labels[j][i] : labels[i], values[i].rawValue, total);

                        L = paper.text(bars[i * (multi || 1) + j].x, isBottom ? y + height - barvgutter / 2 : bars[i * (multi || 1) + j].y - 10, label).attr(txtattr).insertBefore(covers[i * (multi || 1) + j]);

                        var bb = L.getBBox();

                        if (bb.x - 7 < l) {
                            L.remove();
                        } else {
                            this.labels.push(L);
                            l = bb.x + bb.width;
                        }
                    }
                }
            }
            return this;
        };

        chart.hover = function (fin, fout) {
            covers2.hide();
            covers.show();
            covers.mouseover(fin).mouseout(fout);
            return this;
        };

        chart.hoverColumn = function (fin, fout) {
            covers.hide();
            covers2.show();
            fout = fout || function () {};
            covers2.mouseover(fin).mouseout(fout);
            return this;
        };

        chart.click = function (f) {
            covers2.hide();
            covers.show();
            covers.click(f);
            return this;
        };

        chart.each = function (f) {
            if (!Raphael.is(f, "function")) {
                return this;
            }
            for (var i = covers.length; i--;) {
                f.call(covers[i]);
            }
            return this;
        };

        chart.eachColumn = function (f) {
            if (!Raphael.is(f, "function")) {
                return this;
            }
            for (var i = covers2.length; i--;) {
                f.call(covers2[i]);
            }
            return this;
        };

        chart.clickColumn = function (f) {
            covers.hide();
            covers2.show();
            covers2.click(f);
            return this;
        };

        chart.push(bars, covers, covers2);
        chart.bars = bars;
        chart.covers = covers;
        return chart;
    };
    
    //inheritance
    var F = function() {};
    F.prototype = Raphael.g;
    HBarchart.prototype = StackedVBarchart.prototype = new F; //prototype reused by hbarchart
    
    Raphael.fn.stackedbarchart = function(x, y, width, height, values, opts) {
        return new StackedVBarchart(this, x, y, width, height, values, opts);
    };
})();