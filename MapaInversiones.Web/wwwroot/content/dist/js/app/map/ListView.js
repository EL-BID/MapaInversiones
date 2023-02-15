/*global define, ko, doT*/
define(['app/controller/AppState'], function( AppState ){
	
	function ListView(){
		this.root = $('#projects-list-view')
		this.projects = ko.observableArray([])
	
		AppState.on('projects-list-loaded', this.projectsListLoaded.bind(this))
		AppState.on('loading-projects-list', this.onLoading.bind(this))
		this.root.find('.pagination').on('click', 'a', this.loadPage.bind(this))
		this.root.find('.back').on('click', this.toMapMode)
		this.pages = ko.observableArray([])
		this.actual = 0
		this.loading = ko.observable(true)
	}


	ListView.prototype.onLoading = function(){
		this.loading(true)
		this.projects( [] )
		this.root.find('.pagination').html('')
		$('html, body').animate({ scrollTop: 0 }, 200)
	}

	ListView.prototype.pageNumberTempl = doT.compile('<a href="#" class="{{? it.active}}active{{?}}" data-page="{{=it.page}}">{{=it.page}}</a>')

	ListView.prototype.projectsListLoaded = function( data ){
		data.objects = data.objects || []

		$.each(data.objects, function(e, k){
			var items = ["Regional", "Departamental", "Municipal"],
				item = items[Math.floor(Math.random()*items.length)];
			k.finalization = item;
		})

		
		this.projects( data.objects )
		//data.page_number
		//data.total_pages
		this.pages([])
		this.drawPages(+ data['pageNumber'], + data['totalPages'])
		$('html, body').animate({
			scrollTop: $('#controls').offset().top
		}, 300);
		this.loading(false)
	}

	ListView.prototype.loadPage = function(e){
		this.loading(true)
		AppState.setPage( e.target.getAttribute('data-page') )
		return false
	}

	ListView.prototype.toMapMode = function(){
		AppState.setListMode( false )
		return false
	}

	ListView.prototype.drawPages = function( actual, total ){
		var pagesHTML = '',
			i,
			SOMA1 = 15,
			SOMA2 = 5

		this.actual = actual

		if( actual > 1 ){
			pagesHTML += '<a class="prev" href="#" data-page="' +
				(actual-1) + '">&lt;</a>'
		}
		if( total < SOMA1 ){
			for( i = 1; i<=total; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual})
			}
		}else{
			for( i = 1; i < SOMA2; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual})
			}
			if( actual > SOMA2 + 1 && actual < total - SOMA2 ){
				pagesHTML += '...'
				pagesHTML += this.pageNumberTempl({page: actual - 1, active: i==actual})
				pagesHTML += this.pageNumberTempl({page: actual, active: true})
				pagesHTML += this.pageNumberTempl({page: actual + 1, active: i==actual})
				pagesHTML += '...'
			}else{
				if( actual < total - SOMA2 ){
					for( i = SOMA2; i<=SOMA2 + 2; i++ ){
						pagesHTML += this.pageNumberTempl({page: i, active: i==actual})
					}
					pagesHTML += '...'
				}else{
					pagesHTML += '...'
					for( i = total-7; i<=total-SOMA2+1; i++ ){
						pagesHTML += this.pageNumberTempl({page: i, active: i==actual})
					}

				}
			}
			for( i = total - SOMA2 + 2; i<=total; i++ ){
				pagesHTML += this.pageNumberTempl({page: i, active: i==actual})
			}
		}

		if( actual < total ){
			pagesHTML += '<a class="next" href="#" data-page="' +
				(actual+1) + '">&gt;</a>'
		}

		this.root.find('.pagination').html(pagesHTML)
	}

	var lv = new ListView()
	ko.applyBindings(lv, lv.root[0])
})