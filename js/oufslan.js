$(function() {
    var currentMap ='';
    var phpUrl = './php/oufslan.php';
    var phpServerUrl = './php/server.php';
    start();
    function start(){
        actions();
        getServer()
        .done(function(d){
            $.each(jQuery.parseJSON(d), function(index, value){
                    $("#tf2-server").append('<option data-ip="' + value.ip + '" data-port="' + value.port + '">' + value.ip + ':' + value.port + '</option>'); 
            });
            init();
        });
        setInterval(message(), 18000);
    }
    function reload(){
        getServer()
        .done(function(d){
            $("#tf2-server").empty();
            $.each(jQuery.parseJSON(d), function(index, value){
                $("#tf2-server").append('<option data-ip="' + value.ip + '" data-port="' + value.port + '">' + value.ip +':' + value.port + '</option>'); 
            });
            init();
        });
        setInterval(message(), 18000);
    }
    function init(){
        getRules();
        getMaps();
        getInfo();
        getPlayers();
    }
    function message(){
        rcon(["say", "Bienvenue sur le serveur des Oufs LAN"]);
    }
    function actions(){
        $("#mp-tournament-input").change(function(){
            if($(this).prop('checked')){ $(".tournoi-only").addClass('tournoi-only-enabled'); } else { $(".tournoi-only").removeClass('tournoi-only-enabled') }
        })
        $("#tf2-server").change(function(){
            init();
        });
        $("#refresh-player-btn").click(function(){
            partialRefesh();
        });
        $('#changeMap').click(function(){
            changeMap($("#mapsList option:selected" ).text());
        });
        $(".zone").on("click", ".btn", function(){
            var id = $(this).parent().attr('id');
            switch(id){
                case "servers":
                    $("#serverModal").modal("show");
                    getServer().done(function(d){
                        var htmlString = "";
                        $.each(jQuery.parseJSON(d), function(index, value){
                                htmlString += '<div>';
                                htmlString += '<label>ip</label>';
                                htmlString += '<input type="text" id="ip" value="' + value.ip + '">';
                                htmlString += '<label>port</label>';
                                htmlString += '<input type="text" id="port" value="' + value.port + '">';
                                htmlString += '<button type="button" class="btn btn-xs" data-action="delete" data-id="' + value.id + '">supprimer</button>';
                                htmlString += '</div>';
                        });
                        htmlString += '<div>';
                        htmlString += '<label>ip</label>';
                        htmlString += '<input id="new-ip" type="text">';
                        htmlString += '<label>port</label>';
                        htmlString += '<input id="new-port" type="text">';
                        htmlString += '<button type="button" class="btn btn-xs" data-action="add">ajouter</button>';
                        htmlString += '</div>';
                        $("#serverModal .modal-body").html(htmlString);
                    });
                    
                break;
                case "maps":
                    rcon(["say", "[ADMIN] Changement de la map dans 8 secondes"]);
                    setTimeout(changelvl, 16000);
                    function changelvl(){
                        rcon(["changelevel", $("#maps-input option:selected" ).text()])
                    }
                    setTimeout(refresh, 20000);
                    $("#myModal").modal("show");
                break; 
                case "restart-server":
                    rcon(["_restart", ""]);
                break;
                case "restart-map":
                    rcon(["say", "[ADMIN] Redémarrage de la carte dans " + $("#restart-map-input").val() + " secondes"]);
                    rcon(["mp_restartgame", $("#restart-map-input").val()]);
                    setTimeout(refresh, 9000);
                    $("#myModal").modal("show");
                break;   
                case "say":
                    rcon(["say", "[ADMIN] " + $("#say-input").val()]);
                break;   
                case "time-limit":
                    rcon(["say", "[ADMIN] Limite de temps : " + $("#time-limit-input").val() + " minutes"]);
                    rcon(["mp_timelimit", $("#time-limit-input").val()]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
                case "winning-rounds":
                    rcon(["say", "[ADMIN] Victoire : " + $("#winning-rounds-input").val() + " rounds"]);
                    rcon(["mp_winlimit", $("#winning-rounds-input").val()]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
                case "max-rounds":
                    rcon(["say", "[ADMIN] Max rounds : " + $("#max-rounds-input").val()]);
                    rcon(["mp_maxrounds", $("#max-rounds-input").val()]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
                case "randomize-teams":
                    rcon(["say", "[ADMIN] Mélange des équipes"]);
                    rcon(["mp_scrambleteams", ""]);
                break;
                case "auto-balance-teams":
                    ($("#auto-balance-teams-input").prop('checked')) ? rcon(["mp_autoteambalance", 1]) : rcon(["mp_autoteambalance", 0]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
                case "sv-cheats":
                    ($("#sv-cheats-input").prop('checked')) ? rcon(["sv_cheats", 1]) : rcon(["sv_cheats", 0]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
                case "mp-tournament":
                    var answer = confirm("Le changement du mode tournamet necessite le redemarrage de la map");
                    if(answer == true){
                        var rconSring = "";
                        ($("#mp-tournament-input").prop('checked'))? rconSring = "mp_tournament 1; " : rconSring = "mp_tournament 0; ";
                        if($("#weapons-input").prop('checked')){ rconSring += 'mp_tournament_whitelist "cfg/oufslan-weapon.txt"; '; }
                        console.log(rconSring);
                        rconSring += 'say "[ADMIN] redemarrage de la carte dans 8 secondes"; ';
                        rconSring += 'changelevel ' + $("#maps-input option:selected" ).text();
                        rcon([rconSring]);
                        setTimeout(refresh, 9000);
                        $("#myModal").modal("show");
                    }
                break;
                case "mp-tournament-teamname":
                        var rconSring = "";
                        if($("#mp_tournament_blueteamname").val()){ rconSring += 'mp_tournament_blueteamname "' + $("#mp_tournament_blueteamname").val() + '"; ' }
                        if($("#mp_tournament_redteamname").val()){ rconSring += 'mp_tournament_redteamname "' + $("#mp_tournament_redteamname").val() + '"; ' }
                        rcon([rconSring]);
                        setTimeout(partialRefesh, 500);
                break;
                case "mp_tournament_restart":
                        rcon(["mp_tournament_restart", ""]);
                        rcon(["say", "[ADMIN] Tournoi redemarré"]);
                        setTimeout(partialRefesh, 500);
                break;
                
                case "rcon":
                    rcon([$("#rcon-input").val()]);
                    $("#myModal").modal("show");
                    setTimeout(partialRefesh, 2000);
                break;
            }
            
        });
        $("#players").on("click", "#kick-player-btn", function(){
            rcon(["kick", $(this).data('name')]);
            setTimeout(partialRefesh, 2000);
        });
        $("#players").on("click", "#refresh-player-btn", function(){
            setTimeout(partialRefesh, 2000);
        });
        $("#serverModal").on('click', ".btn", function(){
            switch($(this).data("action")){
                case 'delete':
                    deleteServer($(this).data("id"))
                    .done(function(){
                        $("#serverModal").modal("hide");
                    });
                    reload();
                break;
                case 'add':
                    addServer($("#new-ip").val(), $("#new-port").val())
                    .done(function(){
                        $("#serverModal").modal("hide");
                        reload();
                    });
                    
                break;
           } 
            
        });
    }
    function refresh(){
        $("#myModal").modal("hide");
        init();
    }
    function partialRefesh(){
        $("#myModal").modal("hide");
        getRules();
        getInfo();
        getPlayers();
    }
    function getInfo(){
        $.ajax( {
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "getInfo", "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port") }
		})
        .done(function(d) {
            if(isJson(d)){
                var obj = jQuery.parseJSON(d);
                var htmlString = '<table class="table"><thead><tr><td colspan="2">' +  obj.HostName + '</td></tr></thead>';
                htmlString += '<tbody>';
                htmlString += '<tr><td>Map</td><td>' + obj.Map + '</td>';
                htmlString += '<tr><td>Players</td><td>' + obj.Players + ' / ' + obj.MaxPlayers + '</td>';
                htmlString += '<tr><td>Port</td><td>' + obj.GamePort + '</td>';
                htmlString += '</tbody></table>';
                $("#info").html(htmlString);
                currentMap = obj.Map;
                $("#current-map-div").html(currentMap);  
            } else {
                $("#info").html("le serveur ne répond pas");
            }
             
        });
    }
    function isJson(s){
        try {
            JSON.parse(s);
            return true;
        } catch (e) {
            return false;
        }
    }
    function getRules(){
        $.ajax( {
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "getRules", "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port") }
		})
        .done(function(d) {
            if(isJson(d)){
                var obj = jQuery.parseJSON(d);
                $("#time-limit-input").val(obj.mp_timelimit);
                $("#max-rounds-input").val(obj.mp_maxrounds);
                $("#winning-rounds-input").val(obj.mp_winlimit);
                (obj.mp_autoteambalance == 1) ? $('#auto-balance-teams-input').attr('checked', true) : $('#auto-balance-teams-input').attr('checked', false);
                (obj.sv_cheats == 1) ? $('#sv-cheats-input').attr('checked', true) : $('sv-cheats-input').attr('checked', false);
                if(obj.mp_tournament == 1) {
                    $('#tournament-lbl').html('Mode tournoi : <font color="green"> Actif</font>');
                    $('#mp-tournament-input').attr('checked', true);
                    $(".tournoi-only").addClass('tournoi-only-enabled');
                } else{
                    $('#tournament-lbl').html('Mode tournoi : <font color="red"> Inactif</font>');
                    $('#mp-tournament-input').attr('checked', false);
                    $(".tournoi-only").removeClass('tournoi-only-enabled');
                }
                var htmlString = "<ul>";
                $.each(obj, function(index, value){
                    htmlString += "<li><b>" + index + "</b> " + value + "</li>";
                })
                htmlString += "</ul>";
                $("#server-vars").html(htmlString); 
            } else {
                $("#server-vars").html(""); 
            }
        });
    }
    function getPlayers(){
        $.ajax( {
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "GetPlayers", "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port") }
		})
        .done(function(d) {
            if(isJson(d)){
                var obj = jQuery.parseJSON(d);
                var htmlString = '<table class="table table-sm"><thead><tr><td>Player</td><td>frag</td><td><button type="button" class="btn btn-sm" id="refresh-player-btn">Rafraichir</button></td></tr></thead>';
                htmlString += '<tbody>';
                $.each(jQuery.parseJSON(d), function(index, value){
                    htmlString += '<tr><td>' + value.Name + '</td><td>' + value.Frags + '</td>';
                    htmlString += '<td><button type="button" class="btn btn-xs" id="kick-player-btn" data-name="' + value.Name + '">kick</button></td></tr>';
                });
                htmlString += '<tbody></table>';
                $("#players").html(htmlString);
            } else {
                $("#players").html("");
            }
 
        });
    }
    function getMaps(){
        $.ajax( {
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "getMaps", "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port") }
		})
        .done(function(d) {
            var tmaps = d.split("PENDING:   (fs) ");
            var htmlString ="";
            $.each(tmaps, function(index, value){
                value = value.replace(/[\n\r]/g, '');
                if(value != "-------------"){
                    if(value == currentMap){
                        htmlString += '<option value="' + value + '" selected>' + value + '</option>';
                    } else {
                        htmlString += '<option value="' + value + '">' + value + '</option>';
                    }
                    
                }
            });
            $("#maps-input").empty().append(htmlString);
        });
    }
    function rcon(data){
        $.ajax({
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": data[0], "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port"), "value" : data[1] }
		});
    }
    function changeMap(map){
        $.ajax({
			url :           phpUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "changeMap", "ip" : $("#tf2-server option:selected").data("ip"), "port" : $("#tf2-server option:selected").data("port") }
		});
    }
    function getServer(){
        return $.ajax( {
			url :           phpServerUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "getServer"}
		});
    }
    function deleteServer(id){
        return $.ajax( {
			url :           phpServerUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "deleteServer", id : id}
		});
    }
    function addServer(ip, port){
        return $.ajax( {
			url :           phpServerUrl,
			type:           'post',
			timeout:        5000,
			cache:          false,  
			data:           { "action": "addServer", ip : ip, port : port}
		});
    }
    
});