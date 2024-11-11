export const createOrUpdate = async (payload) => {
    const {ctx, device, token,db} = payload;
    const data= {
        phoneNumber: ctx?.from,
        pushName: ctx?.pushName ?? ctx?.key?.remoteJid,
        device,
        token
    }
    await db.updateOne({phoneNumber: ctx?.from},{...data},{upsert: true});
}

export const findByPhone = async (phone,db) => {
    return db.findOne({phoneNumber: phone});
}
