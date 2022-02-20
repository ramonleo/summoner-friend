//const LocalStorage = require("./helpers/local-storage-helper.js")

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var {
    get,
    post,
    put,
    del
} = require("./utils/methods.js")

const LCUConnector = require('lcu-connector')
const connector = new LCUConnector()
const exec = require("child_process").exec
const fs = require("fs")
const path = require("path")
const JSONStream = require( "JSONStream" );
const json = require("big-json")

//global cache
let cacheLoaded = false;
let friendsCache = {};
let matchesCache = {};

// default config
/*let config = {
    hider: true
}*/

/*
// Attribute roles to players
const positionRoles = (first, second, id) => {
    if (first == "FILL") second = "FILL"
    document.getElementById(`first-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${first.toLowerCase()}.png`
    document.getElementById(`second-${id}`).src = `https://raw.communitydragon.org/11.20/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-${second.toLowerCase()}.png`
}

let cycles = {
    0: "UNSELECTED",
    1: "TOP",
    2: "JUNGLE",
    3: "MIDDLE",
    4: "BOTTOM",
    5: "UTILITY",
    6: "FILL"
}

let cycle1 = 0
let cycle2 = 0

const hider = (code) => {
    // console.log(`${path.join(__dirname, "utils/hider.exe")} ${code}`)
    exec(`${path.join(__dirname, "utils/hider.exe")} ${code}`)
}

// Cycle leader's roles on click
const cycleRole = (first, second, lane) => {
    cycle1 = +Object.keys(cycles).find(k => cycles[k] === first);
    cycle2 = +Object.keys(cycles).find(k => cycles[k] === second);

    if (lane == 1) {
        cycle1++
    }

    if (lane == 2) {
        cycle2++
    }

    if (cycle1 > 6) cycle1 = 0
    if (cycle2 > 6) cycle2 = 0

    put("/lol-lobby/v1/parties/metadata", {
        "positionPref": [
            cycles[cycle1],
            cycles[cycle2]
        ]
    })
}

let lobbyIds = []
let riotIds = []
let positions = {}

// Create player card
const createPlayer = (name, icon, id, lvl, percent, isLeader) => {
    var fieldset = document.createElement("fieldset")
    var legend = document.createElement("legend")
    var img = document.createElement("img")
    var border = document.createElement("img")
    var p = document.createElement("p")
    var lane1 = document.createElement("div")
    var lane2 = document.createElement("div")
    var ph = document.createElement("img")
    var ph2 = document.createElement("img")

    // ph.src = "placeholder"
    // ph2.src = "placeholder"

    ph.id = `first-${id}`
    ph2.id = `second-${id}`

    ph.className = "pos"
    ph2.className = "pos"

    lane1.className = "lane"
    lane1.id = `lane1-${id}`
    lane1.appendChild(ph)

    lane2.className = "lane"
    lane2.id = `lane2-${id}`
    lane2.appendChild(ph2)

    p.innerHTML = lvl

    border.src = `https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/prestigeborders/theme-${Math.ceil(lvl/25)}-border.png`
    border.className = "b"

    img.src = `https://raw.communitydragon.org/11.20/game/assets/ux/summonericons/profileicon${icon}.png`
    img.className = "a"
    img.style.backgroundColor = "rgba(128, 128, 128, 0.445)"
    img.style.backgroundImage = `linear-gradient(0deg, #65C178 ${percent}%, rgba(0, 0, 0, 0) ${percent}%)`

    legend.innerHTML = name

    fieldset.appendChild(legend)
    fieldset.appendChild(img)
    fieldset.appendChild(border)
    fieldset.appendChild(p)

    return new Promise(function(resolve, reject) {
        resolve(
            get("/lol-lobby/v2/lobby").then(res => {
                if (res.gameConfig.queueId != 430 && res.gameConfig.queueId != 450 && res.gameConfig.queueId != 900) {
                    fieldset.appendChild(lane1)
                    fieldset.appendChild(lane2)

                    if (isLeader) {
                        lane1.addEventListener("click", () => {
                            cycleRole(positions[id].first, positions[id].second, 1)
                        })

                        lane2.addEventListener("click", () => {
                            cycleRole(positions[id].first, positions[id].second, 2)
                        })
                    }
                }

                fieldset.className = "player"
                fieldset.id = id

                document.getElementById("container").appendChild(fieldset)
            })
        )
    })

}

// Create a main menu when not in lobby
const mainMenu = () => {
    var a = document.createElement("div")
    var b = document.createElement("div")
    var c = document.createElement("div")

    var sr = document.createElement("img")
    var ar = document.createElement("img")
    var sp = document.createElement("img")

    sr.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/classic_sru/img/game-select-icon-default.png"
    ar.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/aram/img/game-select-icon-default.png"
    sp.src = "https://raw.communitydragon.org/11.20/plugins/rcp-be-lol-game-data/global/default/content/src/leagueclient/gamemodeassets/shared/img/icon-rgm-empty.png"

    sr.className = "game"
    ar.className = "game"
    sp.className = "game"

    sr.id = "sr"
    ar.id = "ar"
    sp.id = "sp"

    a.className = "cont"
    b.className = "cont"
    c.className = "cont"

    a.id = "cont-sr"
    b.id = "cont-ap"
    c.id = "cont-sp"

    a.appendChild(sr)
    b.appendChild(ar)
    c.appendChild(sp)

    document.getElementById("container").appendChild(a)
    document.getElementById("container").appendChild(b)
    document.getElementById("container").appendChild(c)

    var bp = document.createElement("button")
    var dp = document.createElement("button")
    var rsd = document.createElement("button")
    var rf = document.createElement("button")

    var arm = document.createElement("button")

    var spec = document.createElement("button")

    bp.innerHTML = "Blind Pick"
    dp.innerHTML = "Draft Pick"
    rsd.innerHTML = "Ranked Solo/Duo"
    rf.innerHTML = "Ranked Flex"

    arm.innerHTML = "Aram"

    spec.innerHTML = "URF"

    sr.addEventListener("click", () => {
        a.appendChild(bp)
        a.appendChild(dp)
        a.appendChild(rsd)
        a.appendChild(rf)
        arm.remove()
        spec.remove()
    })

    ar.addEventListener("click", () => {
        b.appendChild(arm)
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        spec.remove()
    })

    sp.addEventListener("click", () => {
        c.appendChild(spec)
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
    })

    // get into lobby
    bp.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 430 })
    })

    dp.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 400 })
    })

    rsd.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 420 })
    })

    rf.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 440 })
    })

    arm.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 450 })
    })

    spec.addEventListener("click", () => {
        bp.remove()
        dp.remove()
        rsd.remove()
        rf.remove()
        arm.remove()
        spec.remove()
        post("/lol-lobby/v2/lobby", { "queueId": 900 })
    })

    //ids
    //Blind Pick = 430
    //Draft Pick = 400
    //Ranked Solo/Duo = 420
    //Ranked Flex = 440

    //Aram = 450

    //Special (urf) = 900
}
*/
//let menu = false

// Refresh Friend History
function refreshMatchHistory() {    
    setTimeout(async () => {        
        for (const [puuid, summoner] of Object.entries(friendsCache)) {
            requestCount = 0;
            console.log("History")
            console.log(JSON.stringify(summoner));
            if (!(puuid in matchHistoryCache)) {
                matchHistory = {}
                matchHistory["puuid"] = puuid
                matchHistory["matches"] = []
                matchHistory["lastUpdate"] = 0
                matchHistory["fullHistory"] = false
                matchHistoryCache[puuid] = matchHistory
            }

            //Checks if matches has been updated in the last 20 minutes
            console.log(matchHistory["lastUpdate"])
            if(Date.now() - matchHistory["lastUpdate"] < 1200000) {
                console.log("Match history for " + summoner["name"] + " is up to date");
                return
            } else {
                if(!("gameName" in summoner["friendData"])) {
                    console.log("Sem gamename");
                    console.log(summoner);
                }
                console.log("Updating Matches For: " + summoner["friendData"]["gameName"])
                doneUpdating = false
                begIndex = 0
                endIndex = 200                
                do {
                    console.log("BegIndex: " + begIndex + " EndIndex: " + endIndex)
                    await get("/lol-match-history/v1/products/lol/"+ puuid + "/matches?begIndex=" + begIndex + "&endIndex=" + endIndex).then(res => {
                        requestCount++;
                        console.log("Got Match History for " + summoner["friendData"]["gameName"])                        
                        //console.log(res)
                        //console.log(JSON.stringify(res))
                        if("games" in res) {
                            games = res["games"]["games"]
                        } else {
                            games = []
                            console.error("No Game Data Found")
                            doneUpdating = true;
                            return;
                        }
                        if (games.length == 0) {
                            console.log("No More Games For " + summoner["friendData"]["gameName"] + "! " + requestCount + " Requests")
                            doneUpdating = true;
                            matchHistory["lastUpdate"] = Date.now()
                            matchHistory["fullHistory"] = true
                            saveCache();
                            return;
                        }
                        games.forEach(game => {
                            if(!(game["gameId"] in matchHistory["matches"])) {
                                matchHistory["matches"][game["gameId"]] = game
                            } else {
                                if (matchHistory["fullHistory"]) {
                                    doneUpdating = true;
                                    return;
                                } 
                            }                            
			
                            matchSummonerName = game["participantIdentities"][0]["player"]["summonerName"]
                            if(!(matchSummonerName in summoner["previousNames"])) {
                			    summoner["previousNames"][matchSummonerName] = {
                                    firstSeen: game["gameCreationDate"],
                                    lastSeen: game["gameCreationDate"]
                                }
                            } else {
                                if (game["gameCreationDate"] > summoner["previousNames"][matchSummonerName]["lastSeen"]) {
                                    summoner["previousNames"][matchSummonerName]["lastSeen"] = game["gameCreationDate"]
                                }
                                if (game["gameCreationDate"] < summoner["previousNames"][matchSummonerName]["firstSeen"]) {
                                    summoner["previousNames"][matchSummonerName]["firstSeen"] = game["gameCreationDate"]
                                }
                            }
                        })
                        begIndex += 200
                        endIndex += 200
                    }).catch(err => {
                        console.log(err)
                    });

                } while (!doneUpdating);
            }            
            
        };
        //refreshMatchHistory();
    }, 1000);
        

    /*
		gamesList = await getRequest(conn, f'/lol-match-history/v1/products/lol/{puuid}/matches?begIndex={begIndex}&endIndex={endIndex}')
		if gamesList is None:
			break
		if len(gamesList["games"]["games"]) == 0:
			break
		
		for game in gamesList["games"]["games"]:
			previousNames.add(game["participantIdentities"][0]["player"]["summonerName"])

		begIndex += 200
		endIndex += 200*/
	return null
}
function refreshFriend(friend) {
    sid = friend['id']
    puuid = friend['puuid']
    summonerId = friend['summonerId']
    
    summoner = {
        friendData: friend,
        previousNames: {},
        createDate: new Date(),
        lastUpdate: new Date()
    }
    if (!(friendsCache.constructor === Object)) {
        friendsCache = {}
    }
    if (!(puuid in friendsCache)) {
        friendsCache[puuid] = summoner
    } else {
        friendsCache[puuid]["friendData"] = summoner["friendData"];
        friendsCache[puuid]["createDate"] = summoner["createDate"];
        friendsCache[puuid]["lastUpdate"] = new Date();
    }
}

const keepFriendsUpdated = async () => {
    //Keep refreshing friends
    setInterval(() => {
        console.log("Getting friends")
        get("/lol-chat/v1/friends").then(res => {
            if (res.code == "ECONNREFUSED") {

            }
            if (res.httpStatus == 404) {
                /*if (!menu) {
                    mainMenu()
                    lobbyIds.length = 0
                    riotIds.length = 0
                    document.getElementById("friends").style.display = "none"
                    document.querySelectorAll(".friend").forEach(e => {
                        e.remove()
                    })
                }
                return menu = true
                */
            }
            // menu = false
                res.forEach(friend => {
                    refreshed = refreshFriend(friend)
                });
            /*get("/lol-lobby/v2/lobby/members").then(res => {
            })*/
        });
        //LocalStorage.ClearStorage("FriendsCache")
        //LocalStorage.LocalStoreList("FriendsCache", friendsCache, 30)
    }, 5000)
}

// Connect to LCU event
connector.on('connect', (data) => {
    console.log("Connected to LCU")
    console.log(data)
    window.auth = data
    //LocalStorage.ClearStorage("FriendsCache");
    //return;
    //friendsCache =  LocalStorage.GetLocalStorageData("FriendsCache")


    loadCache(); //Loads the cache from local storage and refreshes the friends

    /*console.log("Size " + Object.keys(friendsCache).length)
    if (Object.keys(friendsCache).length > 0) {
        friendsCache = friendsCache[0].value
    } else {
        friendsCache = {}
    }*/
    

    /*
    setInterval(() => {
        get("/lol-lobby/v2/lobby").then(res => {
            if (res.code == "ECONNREFUSED") {

            }
            if (res.httpStatus == 404) {
                if (!menu) {
                    mainMenu()
                    lobbyIds.length = 0
                    riotIds.length = 0
                    document.getElementById("find-match").style.display = "none"
                    document.getElementById("leave").style.display = "none"
                    document.querySelectorAll(".player").forEach(e => {
                        e.remove()
                    })
                }
                return menu = true
            }
            // menu = false
            get("/lol-lobby/v2/lobby/members").then(res => {
                console.log(window.getComputedStyle(document.getElementById("cancel")).display)
                if (window.getComputedStyle(document.getElementById("cancel")).display == "none") {
                    document.getElementById("find-match").style.display = "block"
                    document.getElementById("leave").style.display = "block"
                } else {
                    document.getElementById("find-match").style.display = "none"
                }

                document.querySelectorAll(".cont").forEach(e => {
                    e.remove()
                })

                lobbyIds.forEach(id => {
                    if (!riotIds.includes(id)) {
                        lobbyIds.slice(lobbyIds.indexOf(id), 1)
                        document.getElementById(id).remove()
                    }
                })
                riotIds.length = 0
                Object.keys(res).forEach(async player => {
                    if (positions.hasOwnProperty(res[player].summonerId)) {
                        if (JSON.stringify(positions[res[player].summonerId]) !== JSON.stringify({
                                first: res[player].firstPositionPreference,
                                second: res[player].secondPositionPreference
                            })) {
                            positions[res[player].summonerId] = {
                                first: res[player].firstPositionPreference,
                                second: res[player].secondPositionPreference
                            }
                            positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                        }
                    }

                    positions[res[player].summonerId] = {
                        first: res[player].firstPositionPreference,
                        second: res[player].secondPositionPreference
                    }
                    riotIds.push(res[player].summonerId)
                    if (lobbyIds.includes(res[player].summonerId)) return
                    lobbyIds.push(res[player].summonerId)
                    let percent = await get(`/lol-summoner/v1/summoners/${res[player].summonerId}`).then(res2 => res2.percentCompleteForNextLevel)
                    console.log(positions)
                    createPlayer(res[player].isLeader ? res[player].summonerName + "👑" : res[player].summonerName, res[player].summonerIconId, res[player].summonerId, res[player].summonerLevel, percent, res[player].isLeader, res[player].firstPositionPreference, res[player].secondPositionPreference).then(() => {
                        positionRoles(res[player].firstPositionPreference, res[player].secondPositionPreference, res[player].summonerId)
                    })

                })
            })
        })

    }, 1000)
    */

    document.getElementById("container").style.display = "flex"
    document.getElementById("waiting").style.display = "none"
    const node = document.getElementById("window")
    node.replaceWith(...node.childNodes);
    document.getElementById("waiting").remove()
    /*
    document.getElementById("find-match").addEventListener("click", e => {
        post("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            if (!stat(res)) return
            document.getElementById("cancel").style.display = "block"
            document.getElementById("find-match").style.display = "none"
        })
    })

    document.getElementById("cancel").addEventListener("click", e => {
        del("/lol-lobby/v2/lobby/matchmaking/search").then(res => {
            if (!stat(res)) return
            document.getElementById("find-match").style.display = "block"
            document.getElementById("cancel").style.display = "none"
        })
    })

    document.getElementById("leave").addEventListener("click", e => {
        del("/lol-lobby/v2/lobby").then(res => {
            if (!stat(res)) return
            document.getElementById("find-match").style.display = "none"
            document.getElementById("cancel").style.display = "none"
            document.getElementById("leave").style.display = "none"
        })
    })*/
    
    // console.log(config.hider)
    //hider(config.hider ? 0 : 5)
})

// Check if request status is ok
const stat = (res) => {
    console.log(res.status)
    return ((res.status == 204 || res.status == 201 || res.status == 200) ? true : false);
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("container").style.display = "none"
})

const saveCache = () => {
    //console.log("Going to save cache")
    //console.log(friendsCache)

    var transformStream_friends = JSONStream.stringify();
    var outputStream_friends = fs.createWriteStream( __dirname + "/friendsCache.json" );

    var transformStream_matches = JSONStream.stringify();
    var outputStream_matches = fs.createWriteStream( __dirname + "/matchesCache.json" );

    // In this case, we're going to pipe the serialized objects to a data file.
    transformStream_friends.pipe( outputStream_friends );
    transformStream_matches.pipe( outputStream_matches );
    
    // Iterate over the records and write EACH ONE to the TRANSFORM stream individually.
    // --
    // NOTE: If we had tried to write the entire record-set in one operation, the output
    // would be malformed - it expects to be given items, not collections.
    console.log("Saving:")
    console.log(friendsCache)

    Object.values(matchesCache).forEach( transformStream_matches.write );
    Object.values(friendsCache).forEach( transformStream_friends.write );
    
    // Once we've written each record in the record-set, we have to end the stream so that
    // the TRANSFORM stream knows to output the end of the array it is generating.
    transformStream_matches.end();
    transformStream_friends.end();
    
    // Once the JSONStream has flushed all data to the output stream, let's indicate done.
    outputStream_matches.on(
        "finish",
        function handleFinish() {
            console.log("Matches Cache saved")    
        }
    );
    outputStream_friends.on(
        "finish",
        function handleFinish() {
            console.log("Friends Cache Saved")    
        }
    );

    /*
    const stringifyStream = json.createStringifyStream({
        body: lodash.cloneDeep(friendsCache)
    });*/
    
    /*stringifyStream.on('data', function(strChunk) {
        // => BIG_POJO will be sent out in JSON chunks as the object is traversed
        console.log("Writing");
        console.log(strChunk);
        fs.writeFile("friendsCache.json", strChunk, () => {
            console.log("Cache saved")
        })
    });*/
        
    
}

const loadCache = () => {
    if (!fs.existsSync("friendsCache.json")) fs.writeFileSync("friendsCache.json", "");
    const readStream_friends = fs.createReadStream('friendsCache.json');
    const parseStream_friends = json.createParseStream();

    if (!fs.existsSync("matchesCache.json")) fs.writeFileSync("matchesCache.json", "");
    const readStream_matches = fs.createReadStream('matchesCache.json');
    const parseStream_matches = json.createParseStream();

    
    parseStream_friends.on('data', function(pojo) {
        // => receive reconstructed POJO
        console.log("Friends Cache loaded")
        console.log(pojo);
        for (let key in pojo) {
            friendsCache[pojo[key]["friendData"]["puuid"]] = pojo[key]
        }
        //friendsCache = pojo[0]
        //Tests if friendsCache is undefined
        if (friendsCache == undefined) {
            friendsCache = {}
        }
        cacheLoaded = true

        //console.log("Friends Cache")
        console.log(friendsCache)
    
        keepFriendsUpdated()    
    });
    
    readStream_friends.pipe(parseStream_friends);

    parseStream_matches.on('data', function(pojo) {
        // => receive reconstructed POJO
        console.log("Matches Cache loaded")
        console.log(pojo);
        for (let key in pojo) {
            matchesCache[pojo[key]["puuid"]] = pojo[key]
        }
        //friendsCache = pojo[0]
        //Tests if friendsCache is undefined
        if (matchesCache == undefined) {
            matchesCache = {}
        }
        cacheLoaded = true

        //console.log("Friends Cache")
        console.log(matchesCache)
    
        
        refreshMatchHistory()
    
    });
    
    readStream.pipe(parseStream);    

}


/*const saveConfig = () => {
    fs.writeFile("config.json", JSON.stringify(config), () => {
        console.log("Config saved")
    })
}

const loadConfig = () => {
    if (!fs.existsSync("config.json")) fs.writeFile("config.json", JSON.stringify(config), () => {
        console.log("Config created")
    })
    fs.readFile("config.json", (err, data) => {
        if (err) return err
        config = JSON.parse(data)
    })
}*/


// Load config
loadConfig()

// Start listening for the LCU client
connector.start();