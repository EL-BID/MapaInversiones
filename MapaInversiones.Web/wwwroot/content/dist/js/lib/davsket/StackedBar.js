;(function(){
	var padding = [0,0,0,0],
		deltaGap = 0.12

	/**
	 * Draws a stacked bar where a value is a inner
	 * representation from a total
	 *
	 * @param Object data
	 *   {
	 *		yAxis: {
	 *			name: 'Name of the Y Axis',
	 *			breaks: 6
	 *		},
	 *		xAxis: {
	 *			labels: function(){ return name },
	 *		},
	 *		tooltip: function(){ return innrHTML }
	 *		data: {
	 *				total: {
	 *					name: 'Total Name',
	 *					values: []
	 *				},
	 *				inner: {
	 *					name: 'Children Name',
	 *					values: []
	 *				}
	 *			}
	 *   }
	 */
	function StackedBarChart( elemId, width, height, data ){
		var totalValues = data.data.total.values,
			innerValues = data.data.inner.values,
			// Bar dimensions
			barCount = totalValues.length,
			rowBarWidth = width / barCount,
			barGap = deltaGap * rowBarWidth,
			barWidth = Math.floor( rowBarWidth - 2 * barGap ),
			maxVal,
			// Graph limits
			barMaxHeight = height,
			// Raphaël
			paper = Raphael( elemId, width, height ),
			// Counters and temporals
			i, tVal, iVal, tHeigh, iHeight,
			left = 0, top = 0

		maxVal = Math.max.apply(null, totalValues)

		for( i = 0; i < totalValues.length; i++ ){
			tVal = totalValues[i]
			iVal = innerValues[i]
			tHeigh = Math.floor( ( tVal / maxVal ) * barMaxHeight )
			iHeight = Math.floor( ( iVal / tVal ) * tHeigh )
			paper.rect( left + barGap, barMaxHeight - tHeigh, barWidth, tHeigh)
				.attr({
					fill: '#00b5c6',
					'stroke-width': 0
				})
			paper.rect( left + barGap, barMaxHeight - iHeight, barWidth, iHeight)
				.attr({
					fill: '#009dac',
					'stroke-width': 0
				})
			// paper.rect( left, 0, barWidth, barMaxHeight)
			left += 2*barGap + barWidth
		}
	}

	window.StackedBarChart = StackedBarChart
}());