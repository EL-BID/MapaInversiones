{ 
	"type": "FeatureCollection",
	"features": [
		{ 
			"type": "Feature",
			"geometry":{ "type": "Point", "coordinates": [0.0, 0.0] },
			"properties": {"prop0": "value0"}
		},
		{ 
			"type": "Feature",
			"geometry": 
			{ 
				"type": "LineString",
				"coordinates": [ [100.0, 0.0], [0, 0] ]
			},
			"properties": {
				"prop0": "value0",
				"prop1": 0.0
			}
		},
		{ 
			"type": "Feature",
			"geometry": 
			{ 
				"type": "MultiLineString",
				"coordinates": [ [ [100.0, 0.0], [0, 0] ],  [ [0.0, 100.0], [0, 0] ] ]
			},
			"properties": {
				"prop0": "value0",
				"prop1": 0.0
			}
		},	    
		{ 
			"type": "Feature",
			"geometry": 
			{ 
				"type": "Polygon",
				"coordinates": [ [ [ -18.941291, 62.633710 ], [ -65.741277, 13.257630 ], [ -21.335155, 10.655546 ], [ 7.935411, 21.175493 ], [ 8.668439, 47.243419 ], [ -18.941291, 62.633710 ] ] ] 
			},
			"properties": {
				"prop0": "value0",
				"prop1": {"this": "that"}
			}
		}
	]
}