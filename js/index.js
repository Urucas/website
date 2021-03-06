var myTrigger;
var app = {
	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	current_view: null,
	db: null,
	baseURL: "http://cinema.urucas.com/api",
	db_version: null,
	tmp_db_evrsion: null,
	movies: [],
    uuid: null,
	// Application modules
	modules: [
	{ id: "principal", view: "principal.html"},
	{ id: "cartelera", view: "cartelera.html", callback: function() { app.listCartelera();} },
	{ id: "cines", view: "cines.html"},
	{ id: "estrenos", view: "estrenos.html", callback: function() { app.listEstrenos(); }},
	{ id: "pelicula", view: "pelicula.html", callback: function() { app.loadMovieInfo(); }},
	{ id: "configuracion", view: "configuracion.html"},
	{ id: "recomendados", view: "recomendados.html", callback: function() {  app.listRecomendados(); }},
	{ id: "search", view: "cartelera.html", callback: function() { app.search(); } },
	],
	// Application autoloader
	load: function(hash) {
		//	console.log("page to open -> "+hash);
		app.modules.forEach(function(m){
			if(hash == m.id) {
				app.loadView(m.view, m.callback, m.id);
				return;
			}
		});
	},
	// Application view loader
	loadView: function(view, callback, view_id) {

		try { scroll(0,0); }catch(e){};

		app.current_view = view_id;
		$("#wrapper").include(view, function(){
		
			try { toggle('menu'); } catch(e) { }

			try { callback(); } catch(e) { }

		});
		/*
		$("#wrapper").load(view, function(){

			// load html file from <include /> elements
			$("#wrapper").find("include").each(function(){
				var inc = this.getAttribute("src");
				var el = this;
				$.ajax({ 
					url:inc, 
					data:[], 
					success:function(data){
						$(el).replaceWith(data);					
					}, 
					async: false
				});
			});

			try { toggle('menu'); } catch(e) { }

			if(callback != undefined && typeof callback == "function") {
				callback();
			}
		});
		*/
	},
	refreshMovies: function() {
		
		app.db.transaction(function(tx) {
			tx.executeSql("SELECT * from peliculas ORDER BY estreno DESC ", [], function(tx, res) {
				var movies = [];
				try {
					for(var i=0; i< res.rows.length; i++) {
						var movie = {
							pid: res.rows.item(i).pid, titulo: res.rows.item(i).titulo, titulo_original: res.rows.item(i).titulo_original,
							elenco: res.rows.item(i).elenco, director: res.rows.item(i).director, sinopsis: res.rows.item(i).sinopsis,
							thumb: res.rows.item(i).thumb, trailer: res.rows.item(i).trailer, fecha_alta: res.rows.item(i).fecha_alta,
							origen: res.rows.item(i).origen, anio: res.rows.item(i).anio, duracion: res.rows.item(i).duracion,
							genero: res.rows.item(i).genero, horarios_txt: res.rows.item(i).horarios_txt, estreno: res.rows.item(i).estreno,
							puntaje: res.rows.item(i).puntaje, img_cover: res.rows.item(i).img_cover
						}
						movies.push(movie);
					}
					app.movies = movies;

				}catch(e) {}
			});
		}, function(e){
			console.log(e);
		});
	
	}, 
	loadSearch: function(q) {
		app.q = q == undefined ? jQuery.trim($("#field").val()) : jQuery.trim(q);
		if(window.location.hash == "#search") {
			app.search();
		}else {
			window.location.href= "#search";
		}
	},
	search: function() {
		try {
			app.db.transaction(function(tx) {

				var where = [
					"titulo LIKE '%"+app.q+"%'",
					"titulo_original LIKE '%"+app.q+"%'",
					"elenco LIKE '%"+app.q+"%'",
					"director LIKE '%"+app.q+"%'",
					"sinopsis LIKE '%"+app.q+"%'",
					"genero LIKE '%"+app.q+"%'",
					"horarios_txt LIKE '%"+app.q+"%'"
				].join(" OR ");
				tx.executeSql("SELECT * from peliculas WHERE "+ where + " ORDER BY estreno DESC ", [], function(tx, res) {
					var movies = [];
					try {
						for(var i=0; i< res.rows.length; i++) {
							var movie = {
								pid: res.rows.item(i).pid, titulo: res.rows.item(i).titulo, titulo_original: res.rows.item(i).titulo_original,
								elenco: res.rows.item(i).elenco, director: res.rows.item(i).director, sinopsis: res.rows.item(i).sinopsis,
								thumb: res.rows.item(i).thumb, trailer: res.rows.item(i).trailer, fecha_alta: res.rows.item(i).fecha_alta,
								origen: res.rows.item(i).origen, anio: res.rows.item(i).anio, duracion: res.rows.item(i).duracion,
								genero: res.rows.item(i).genero, horarios_txt: res.rows.item(i).horarios_txt, estreno: res.rows.item(i).estreno,
								puntaje: res.rows.item(i).puntaje, img_cover: res.rows.item(i).img_cover
							}
							movies.push(movie);
						}
					$("#field").val(app.q);
					if(movies.length == 0){
						$("#cartelera").html('<div class="info">No se encontraron resultados, afina tu puntería</div>');
					}else{
						app.renderList("cartelera", movies);
					}

				}catch(e) { 
					console.log(e); 
				}
			});
			}, function(e) {
				console.log("ERROR: " + e.message);
			});
		}catch(e) {
			console.log(e);
		}
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	share: function(){
		try {
			window.plugins.socialsharing.available(function(isAvailable) {
				if (isAvailable) {
					window.plugins.socialsharing.share(
						"Sos cinero? Descargate la app para tener la cartelera de cine en tu smartphone!", 
						null, 
						null, 
						"http://cineros.com.ar"
						);
				}
			});
		}catch(e){ console.log(e); }
	},
	onDeviceReady: function() {
		// app.receivedEvent('deviceready');
		//;	
	
		setTimeout(function(){ 
			$("#splash").hide();
		}, 2000);

		// important event to autolod the modules and views
		window.onhashchange = function() {
			var hash = window.location.hash;
			hash = hash.replace("#","");
			app.load(hash);
		}

        try{ app.uuid = device.uuid; }catch(e){ console.log("cant get device uuid"+e.message); }

		// admob creation
		try {
			admob.createBannerView(
					{'publisherId': 'ca-app-pub-7488172185490417/1616483686', 'adSize': admob.AD_SIZE.BANNER}, 
					function(){
						app.adCreateBannerVewSuccess();
					}, function(){
					});

		}catch(e) { }

		try {

			app.db = window.sqlitePlugin.openDatabase({name: "cineros", bgType:0});
			app.db.transaction(function(tx) {
				// tx.executeSql('DROP TABLE IF EXISTS version_table');
				// creo las DB si no exostes
				tx.executeSql('CREATE TABLE IF NOT EXISTS version_table (id integer primary key, version integer)');
				tx.executeSql('CREATE TABLE IF NOT EXISTS peliculas (id integer primary key, pid integer, titulo text, titulo_original text, elenco blob, director text, sinopsis blob, thumb text, trailer text, fecha_alta text, origen text, anio text, duracion text, genero text, horarios_txt blob, estreno integer, puntaje integer, img_cover text)');

				tx.executeSql("select version from version_table;", [], function(tx, res) {
					if(!res.rows.length) {
						app.db_version = 1
					tx.executeSql("INSERT INTO version_table (version) VALUES (?)", [1], function(tx, res) {
						app.getDBVersion();
					});
					}else {
						app.db_version = res.rows.item(0).version;
						app.getDBVersion();
					}
				});
				tx.executeSql("SELECT * from peliculas;", [], function(tx, res) {
					var movies = [];
					try {
						for(var i=0; i< res.rows.length; i++) {
							var movie = {
								pid: res.rows.item(i).pid, titulo: res.rows.item(i).titulo, titulo_original: res.rows.item(i).titulo_original,
					elenco: res.rows.item(i).elenco, director: res.rows.item(i).director, sinopsis: res.rows.item(i).sinopsis,
					thumb: res.rows.item(i).thumb, trailer: res.rows.item(i).trailer, fecha_alta: res.rows.item(i).fecha_alta,
					origen: res.rows.item(i).origen, anio: res.rows.item(i).anio, duracion: res.rows.item(i).duracion,
					genero: res.rows.item(i).genero, horarios_txt: res.rows.item(i).horarios_txt, estreno: res.rows.item(i).estreno,
					puntaje: res.rows.item(i).puntaje, img_cover: res.rows.item(i).img_cover
							}
							movies.push(movie);
						}
						app.movies = movies;
					}catch(e) {
						console.log(e);
					}
				});

			}, function(e) {
				// console.log("ERROR: " + e.message);
			});

		}catch(e) {
			//			console.log(e);
		}

		document.location.href = "#principal";
	},
	getDBVersion: function() {

		// check if it has internet connection
		if(!app.checkInternet()){
			toast.alert("No se pudo conectar a internet, la información puede estar desactualizada");
		}else{
			// get the db version on the server
			var url = app.baseURL + "/getdbversion";
			
			try {
				$.post(url,{}, function(response){
					if(response.error) {
						toast.alert(response.error);
						return;
					}
					var db_version = response.version;
					var url = app.baseURL + "/getdbversion";
					if(db_version != app.db_version) {
						app.tmp_db_version = db_version;
						app.update();
					}else{
                        app.updateVotes();
                    }

				},'json');
			}catch(e) {bugsense.notify( error, { updatesDbversion: 'not working' } ); }
		}
	},
    updateVotes:function(){
        var url = app.baseURL + "/getvotes";

        toast.alert("Actualizando puntajes de las peliculas","short");
        try {
            $.post(url,{}, function(response){
                if(response.error) {
                    toast.alert(response.error);
                    return;
                }
                app.db.transaction(function(tx) {
                    var votos = response.votos;
                    for(var i=0;i<votos.length;i++){
                        tx.executeSql("UPDATE peliculas SET puntaje = ? WHERE pid = ?", [votos[i].puntaje, votos[i].id], function(tx, res) {
		        		});
                    }
                    app.refreshMovies();
					toast.alert("Ya tienes los puntajes de las peliculas actualizados, mira en Recomendados los elegidos de la gente");
                })
            },'json');
        }catch(e) {bugsense.notify( error, { updateVotes: e.getMessage() } ) }

    },
	update: function() {
		var url = app.baseURL + "/getpeliculas";
		//	console.log("update");

		toast.alert("Actualizando informacion de las peliculas","short");
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: url, 
			beforeSend: function(thisXHR) {
				myTrigger = setInterval (function (){
					
//					console.log(thisXHR);
//					console.log("ready state ->" + thisXHR.readyState);
					
					if (thisXHR.readyState > 2){
						var totalBytes  = thisXHR.getResponseHeader('Content-length');	
//						toast.alert("total bytes -> "+ totalBytes);
						var dlBytes = thisXHR.responseText.length;
						(totalBytes > 0)? toast.alert(Math.round ((dlBytes/ totalBytes) * 100) + "%"): toast.alert(Math.round (dlBytes/1024) + "K");
					}
				}, 500);
			},
			complete: function() {
	 		 	clearInterval(myTrigger);
			},
			success: function(response) {
				// clearInterval(myTrigger);
				if(response.error) {
					toast.alert(response.error);
					return;
				}
				//			console.log(JSON.stringify(response));
				for(var i=0; i< response.length; i++) {
					response[i].pid = response[i].id;
					delete response[i].id;
				}
				app.movies = response;
				var current_view = app.current_view;
				for(var i=0; i< app.modules.length; i++) {
					if(app.modules[i].id == current_view) {
						try { app.modules[i].callback(); }catch(e) { }
						i=100;
					}		
				}
				toast.alert("Informacion de las peliculas actualizada","short");
				var len = response.length;
				app.db.transaction(function(tx) {
					tx.executeSql("DELETE FROM peliculas", [], function(tx, res) {});
					for(var i=0; i<len; i++) {
						try {
							var movie = [];
							var campos = ["pid", "titulo", "titulo_original", "elenco", "director", "sinopsis", 
					"thumb", "trailer", "fecha_alta", "origen", "anio", "duracion", "genero", "horarios_txt", 
					"estreno", "puntaje", "img_cover"
					];
				var quest = [];
				for(var j=0; j < campos.length; j++) {
					quest.push("?");
					var campo = campos[j];
					movie.push(response[i][campo]);
				}
				var sql = "INSERT INTO peliculas ("+campos.join(",")+") VALUES ("+quest.join(",")+")";
				//						console.log(sql);
				// console.log(JSON.stringify(movie));

				tx.executeSql("INSERT INTO peliculas ("+campos.join(",")+") VALUES ("+quest.join(",")+")", movie, function(tx, res) {
					// console.log("insertId: " + res.insertId);
				});

				tx.executeSql("UPDATE version_table SET version = ? WHERE version = ?", [app.tmp_db_version, app.db_version], function(tx, res) {
					app.db_version = app.tmp_db_version;
				});

						}catch(e){
							continue;
						}
					}

				}, function(e) { 
					// console.log(e); 
				});


			}
		});

	},
	adCreateBannerVewSuccess: function() {
		try{
			admob.requestAd({
				'isTesting': false,
				'extras': {
				'color_bg': 'AAAAFF',
			'color_bg_top': 'FFFFFF',
			'color_border': 'FFFFFF',
			'color_link': '000080',
			'color_text': '808080',
			'color_url': '008000'
			}},
			function(){ },  
			function(){ }
			);
		}catch(e) { }
	},
	listRecomendados: function() {
		app.refreshMovies();
		// clono la info de app.movies para ordenarlos
		var recomendados = app.movies.slice(0);
		recomendados.sort(app.comparePuntaje);

		app.renderList("recomendados", recomendados.slice(0,8));
	},
	listCartelera: function() {
		app.refreshMovies();
		app.renderList("cartelera", app.movies);
	}, 
	listEstrenos: function() {
		app.refreshMovies();
		var estrenos = [];
		var movies = app.movies;
		for(var i in movies) {
			var movie = movies[i];
			if(movie.estreno == 1) {
				estrenos.push(movie);
			}
		}
		app.renderList("estrenos", estrenos);
	}, 
	renderList: function(container, movies) {
		// los listados son todos iguales asi que creo una funcion que renderize la lista
		var modifiers = {
			sinopsis: function(s){ return s.length > 130 ? s.substr(0,127)+"..." : s; }
		}
		if(movies.length > 0) {
			$("#"+container).render(
					"peli-list-item.html", 
					movies, 
					{ modifiers: modifiers }
					);
		}
	}, 
	comparePuntaje: function(m1, m2) {
		if(m1.puntaje > m2.puntaje) {
			return -1;
		}else {
			return 1;
		}
		return 0;
	},
	loadMovie: function(mid) {
		app.refreshMovies();
		app.movie = app.findMovie(mid);
		document.location.href = "#pelicula";
	},
	loadMovieInfo: function() {

		var movie = app.movie;
		$("#movie-img_cover").attr("src", movie.img_cover);
		$("#movie-puntaje").text(movie.puntaje);
		$("#movie-titulo").text(movie.titulo);
		$("#movie-desc").text(movie.sinopsis);
		$("#movie-titulo_original").text(movie.titulo_original);
		$("#movie-protagonistas").text(movie.elenco);
		$("#movie-director").text(movie.director);
		$("#movie-duracion").text(movie.duracion);
		$("#movie-genero").text(movie.genero);
		$("#movie-origen").text(movie.origen);

		$("#movie-voteup").unbind("click");
		$("#movie-votedown").unbind("click");

		$("#movie-voteup").click(function(){
			app.voteup(movie.pid);
		});
		$("#movie-votedown").click(function(){
			app.votedown(movie.pid);
		});
		$("#movie-horarios").html(movie.horarios_txt);

		$("#movie-trailer").unbind("click");
		$("#movie-trailer").click(function(){
			navigator.app.loadUrl(movie.trailer, { openExternal:true });
		});

	},
	findMovie: function(mid) {
		var movies = app.movies;
		for(var i in movies) {
			var movie = movies[i];
			if(movie.pid == mid) {
				return movie;
			}
		}
		return false;
	},
	voteup: function(mid) {
		app.vote(mid, 1);
	},
	votedown: function(mid) {
		app.vote(mid, 0);
	},
	vote: function(mid, vote) {
	
		if(app.uuid == null) {
			toast.alert("Ha ocurrido un error al votar, intenta nuevamente en unos minutos!");
			return;
		}
		if(!app.checkInternet()){
			toast.alert("No se pudo conectar a internet, intenta nuevamente en unos minutos!");
			return;
		}
		var url = app.baseURL+"/votepeli";
		vote = vote == 1 ? 1 : 0;
		var params = {id:mid, uuid: app.uuid, vote:vote};
		toast.alert("Votando...");
		$.post(url, params, function(response){
			if(response.error) {
				toast.alert(response.error);
				return;
			}
			var puntaje = response.porcentaje_positivo;
			$("#movie-puntaje").text(puntaje);
			try {
				app.db.transaction(function(tx) {
					tx.executeSql("UPDATE peliculas SET puntaje = ? WHERE pid = ?", [puntaje, mid], function(tx, res) {
					});

				}, function(e){
					console.log(e);
				});

			}catch(e){
				console.log(e);
			}
			toast.alert("Ya tenemos tu calificacion!");
		},'json');
	
	},
	checkInternet: function(){

		var networkState = navigator.connection.type;
		if(networkState == Connection.NONE){
			//onConnexionError();
			return false;
		}
		else{return true;}
	}
};

function toggle(id){
	if (document.getElementById){ //se obtiene el id
		var el = document.getElementById(id); //se define la variable "el" igual a nuestro div
		el.style.display = (el.style.display == 'none') ? 'block' : 'none'; //damos un atributo display:none que oculta el div
		el.style.zIndex = (el.style.zIndex == '-1') ? '1' : '-1';
		general.style.marginLeft = (general.style.marginLeft == '0px') ? '80px' : '0px';
		general.style.position = (general.style.position == 'absolute') ? 'fixed' : 'absolute';
	}
}

