import { getRealTimeDatabase } from "my-utils";
import { gmoPrivateApiClass } from "..";

export async function getGMOPrivateAPI(label: string): Promise<gmoPrivateApiClass> {
    const rdb = await getRealTimeDatabase()
    const apiKey = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + label + '/apiKey')) as string
    const secret = await rdb.get(await rdb.getReference('settings/gmo/accounts/' + label + '/apiSecret')) as string
    return new gmoPrivateApiClass({
        apiKey: apiKey,
        apiSecret: secret
    })
}