/*global Raphael, define*/
define(['app/utils/allColors'], function( allColors ){
	var sectorColors = allColors,
		regionsColors = [
			'#FBA74D',
			'#2280A2',
			'#3BB778',
			'#1CC1B3',
			'#8EC63F',
			'#fff568',
			'#f36523'
		]

	function drawSemiPie(elem, radius, data, labels, colors, noCurrency){
		var r = Raphael(elem, radius*2.2, radius*2.2),
			pie, dataNumber = [], i,
			dataLabel = [],
			opts = {
				startFromFixedAngle: 90,
				labels: labels,
				minPercent: 0.00001
			}

		if(!data)
			return

		if( colors ){
			opts.colors = colors,
			opts.stroke = colors
		}else{
			if(data.length > regionsColors.length){
				opts.colors = sectorColors
				opts.stroke = sectorColors
			}else{
				opts.colors = regionsColors
				opts.stroke = regionsColors
			}
		}

		for(i=0; i<data.length; i++){
			dataNumber[i] = data[i].rawValue
			if( typeof data[i].value == 'Number'||
				data[i].value.indexOf('%') == -1 ){
				data[i].value +='%'
			}
			dataLabel[i] = data[i].value
		}

		pie = r.semiPiechart(radius*1.1, radius*1.1, radius, dataNumber, opts, dataLabel)

		pie.hover(function () {
			this.sector.stop();
			this.sector.animate({ transform: 's1.1 1.1 ' + this.cx + ' ' + this.cy }, 100/*, 'bounce'*/);
			// if(!this.pop)
			this.pop = createPopup(
				this.sector, data[this.sector.value.order].label + ' - ' +
					data[this.sector.value.order].value + '<br />'+
					(noCurrency ? data[this.sector.value.order].rawValue : data[this.sector.value.order].rawValue.toCurrency()),
				labels ? 19 : 44)
			this.pop.show()
		}, function () {
			this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 200/*, 'bounce'*/);
			this.pop.remove()
		});

		return pie
	}

	function drawBars(elem, data, labels, opts){
		var barGraph,
			width = elem.offsetWidth,
			height,
			r = Raphael(elem, width, height)
		
		opts = opts || {}

		height = opts.height || width * 0.577

		if( !data )
			return
		
		opts.colors = opts.colors || sectorColors

		if( width < 150 || height < 100) return
			
		barGraph = r.barchart(50, 10, width - 100, height - 50, data, opts)

		barGraph.hover(function () {
			var raw = data[this.bar.value.order].rawValue
			this.bar.stop();
			this.bar.animate({ transform: 's1.1 1 ' + this.cx + ' ' + this.cy }, 100/*, 'bounce'*/);
			// if(!this.pop)
			if(!opts.invertedData){
				this.pop = createPopup(this.bar, data[this.bar.value.order].label +
					' - ' + data[this.bar.value.order].value +
					'<br>' + raw.toCurrency().replace(/\$\s*/,''), 0, -20)
			}else{
				this.pop = createPopup(this.bar, data[this.bar.value.order].label.replace(/(HIDROCARBURO|MINERAL)_FISCALIZADOS$/i,'$1').replace(/_/g,' ') +
					'<br>' + raw +
					'%<br>(' + data[this.bar.value.order].value.toCurrency().replace(/\$\s*/,'') + ')', 0, -20)
			}
			this.pop.show()
		}, function () {
			this.bar.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 200/*, 'bounce'*/);
			this.pop.remove()
		})

		if( labels ){
			//Labels
			r.text(width/2, height - 45, labels[0]).attr({
				'text-anchor': 'middle',
				'fill': '#777',
				'font-size': '11px'
			})
			r.text(8, height/2, labels[1]).attr({
				'text-anchor': 'middle',
				'fill': '#777',
				'font-size': '11px'
			}).rotate(-90)
		}
	}

	function createPopup(node, htmlContent, hMargin, vMargin){
		var popUp = $('<div>',{'class': 'graph-tooltip'}).html(htmlContent)

		vMargin = vMargin || 0
		hMargin = hMargin || 0

		popUp.appendTo(document.body)
		// debugger;
		popUp.css({
			top: $(node.paper.canvas).offset().top + node.getBBox().y - popUp[0].offsetHeight + vMargin,
			left: $(node.paper.canvas).offset().left + node.getBBox().x + node.getBBox().width/2 + hMargin,
			display: 'none'
		})

		return popUp
	}

	return {
		drawSemiPie: drawSemiPie,
		drawBars: drawBars
	}
})