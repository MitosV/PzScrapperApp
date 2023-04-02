

const getData = async (id) => {
    const options = {
        method: 'POST',
        headers: {collectioncount: '1'},
        body: new URLSearchParams({collectioncount: '1', 
        'publishedfileids[0]': id})
    };
    
    const res = await fetch(`https://api.steampowered.com/ISteamRemoteStorage/GetCollectionDetails/v1/?access_token=${process.env.steam_access_token}`, options)
    const response = await res.json()
    return response;
}


const getAllItems = async (id) => {
    const res = await getData(id)
    const childrens = res.response.collectiondetails['0'].children
    const items = []

    if (childrens == undefined){
        return []
    }
    
    for (const element of childrens) {
        if (!items.includes(element.publishedfileid)){
            items.push(element.publishedfileid)
        }
    }

    return items
}

//2930609308

const getInfoItem = async (id) => {
    const options = {
        method: 'POST',
        body: new URLSearchParams({itemcount: '1', 'publishedfileids[0]': id})
    };

    const res = await fetch(`https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?access_token=${process.env.steam_access_token}`, options)
    const response = await res.json()
    return response;
}

const getModID = async (id) => {
    const res = await getInfoItem(id);
    const response = res["response"];
    
    const details = response["publishedfiledetails"][0]
    const description = details.description
    if (description == undefined) {
        return "null"
    }
    const last = description.match(/(?:Mod(?:\s?)ID)(?:\:)(?:[\s+])([\w._-]+)/g).pop()
        .split("Mod ID: ").pop();
    return last;
}


const getAll = async (id) => {
    const items = await getAllItems(id)
    const mod = []
    const fail = []
    const complete = {}
    if (items.length <= 0){
        return {
            result: complete,
            fails: [`Collection Id ${id} is incorrect`]
        }
    }
    for (const item of items){
        const modID = await getModID(item)
        if (!mod.includes(modID)){
            if (modID === 'null'){
                if (!fail.includes(item)){
                    fail.push(item)
                }
                continue
            }
            mod.push(modID)
            complete[item] = modID
        }
    }

    return {
        result: complete,
        fails: fail
    }
}

export default async function handler(req, res) {
    if(req.method !== "POST"){
        res.status(404).json({
            status: 404,
            error: "Method isn't POST"
        })
        return
    }

    const body = JSON.parse(req.body)

    res.status(200).json(await getAll(body.id))
}